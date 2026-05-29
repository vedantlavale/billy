-- Run this in your Supabase SQL editor

-- Profiles table
create table if not exists public.profiles (
  id                uuid references auth.users(id) primary key,
  email             text,
  plan              text default 'free',
  plan_type         text,
  plan_expires_at   timestamp,
  invoice_count     int default 0,
  invoice_reset_at  timestamp default now(),
  profession        text,
  onboarding_completed boolean default false,
  onboarding_completed_at timestamp,
  created_at        timestamp default now()
);

-- Invoices table
create table if not exists public.invoices (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id),
  template_id text,
  data        jsonb,
  status      text default 'draft',
  created_at  timestamp default now()
);

-- Subscriptions table
create table if not exists public.subscriptions (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references public.profiles(id) unique,
  dodo_plan_id       text,
  plan_type          text,
  status             text,
  current_period_end timestamp
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS: profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS: invoices
alter table public.invoices enable row level security;

create policy "Users can view own invoices"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "Users can insert own invoices"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "Users can update own invoices"
  on public.invoices for update
  using (auth.uid() = user_id);

-- RLS: subscriptions
alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);
