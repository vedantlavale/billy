-- Security hardening: lock down plan/quota columns and enforce the free
-- invoice limit in the database itself.
--
-- Why: the publishable (anon) key ships in the browser bundle, and the previous
-- RLS only said "a user may update their own profile row" and "a user may insert
-- their own invoices". That let any signed-in user, straight from the devtools
-- console:
--   1. flip profiles.plan to 'pro' (free Pro) or zero out invoice_count, and
--   2. insert invoices directly, bypassing the app-side free-tier limit.
--
-- This migration moves both controls into the database so no client path can
-- bypass them. Run it in the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- 1. Protect billing/quota columns on profiles from client-side writes.
--
-- authenticated/anon may still update their own row (e.g. onboarding fields),
-- but may NOT change any plan- or usage-controlled column. Those may only be
-- changed by SECURITY DEFINER functions (which run as the table owner) or by the
-- service_role (the Dodo webhook). current_user reflects the executing DB role:
-- 'authenticated'/'anon' for normal PostgREST requests, the owner for SECURITY
-- DEFINER functions, 'service_role' for service-key requests.
-- ---------------------------------------------------------------------------
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    if (new.plan            is distinct from old.plan)
    or (new.plan_type       is distinct from old.plan_type)
    or (new.plan_expires_at is distinct from old.plan_expires_at)
    or (new.invoice_count   is distinct from old.invoice_count)
    or (new.invoice_reset_at is distinct from old.invoice_reset_at) then
      raise exception 'Not allowed to modify plan or usage fields'
        using errcode = 'insufficient_privilege';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_privileged_columns();

-- ---------------------------------------------------------------------------
-- 2. Let a user downgrade their OWN expired day-pass without touching the
-- protected columns directly. Replaces the inline update that /api/generate-pdf
-- used to run as the authenticated user (now blocked by the trigger above).
-- ---------------------------------------------------------------------------
create or replace function public.expire_day_plan()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set plan = 'free', plan_type = null, plan_expires_at = null
   where id = auth.uid()
     and plan = 'pro'
     and plan_type = 'day'
     and plan_expires_at is not null
     and plan_expires_at < now();
end;
$$;

revoke all on function public.expire_day_plan() from public;
grant execute on function public.expire_day_plan() to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Enforce the free-tier invoice limit and count invoices atomically, for
-- EVERY insert path (API or a direct client insert). Runs as the table owner
-- (SECURITY DEFINER) so its profiles update is allowed past the trigger in (1).
--
-- Keep the free monthly limit (5) in sync with FREE_MONTHLY_LIMIT in lib/plans.ts.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_invoice_quota()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  free_monthly_limit constant int := 5;
  v_plan            text;
  v_plan_type       text;
  v_plan_expires_at timestamp;
  v_count           int;
  v_reset_at        timestamp;
  v_effective_pro   boolean;
begin
  -- Lock the owner's profile so concurrent inserts can't race the check below.
  select plan, plan_type, plan_expires_at,
         coalesce(invoice_count, 0), coalesce(invoice_reset_at, now())
    into v_plan, v_plan_type, v_plan_expires_at, v_count, v_reset_at
    from public.profiles
   where id = new.user_id
   for update;

  if not found then
    raise exception 'Profile not found for user %', new.user_id
      using errcode = 'foreign_key_violation';
  end if;

  -- A pro plan still active counts as pro; an expired day-pass is effectively free.
  v_effective_pro := v_plan = 'pro'
    and not (v_plan_type = 'day'
             and v_plan_expires_at is not null
             and v_plan_expires_at < now());

  -- Roll the monthly window forward once a full month has elapsed, and persist
  -- the reset (the old app-only logic computed this but never wrote it back, so
  -- the counter and the displayed usage drifted apart).
  if now() >= v_reset_at + interval '1 month' then
    v_count := 0;
    v_reset_at := now();
  end if;

  if not v_effective_pro and v_count >= free_monthly_limit then
    raise exception 'invoice_limit_reached'
      using errcode = 'check_violation';
  end if;

  update public.profiles
     set invoice_count    = v_count + 1,
         invoice_reset_at = v_reset_at,
         first_invoice_at = coalesce(first_invoice_at, now())
   where id = new.user_id;

  return new;
end;
$$;

drop trigger if exists enforce_invoice_quota_trigger on public.invoices;
create trigger enforce_invoice_quota_trigger
  before insert on public.invoices
  for each row execute function public.enforce_invoice_quota();

-- ---------------------------------------------------------------------------
-- 4. Retire the old counter RPC. Counting now happens inside the insert trigger,
-- and the RPC took an arbitrary target_user_id with no auth check, so any user
-- could inflate another user's usage. Remove it from client-callable roles.
-- ---------------------------------------------------------------------------
revoke all on function public.increment_invoice_count(uuid) from public, anon, authenticated;
