-- Waitlist table for capturing email signups during pre-launch
-- Apply via Supabase SQL editor or `supabase db push`

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  created_at  timestamp default now()
);

alter table public.waitlist enable row level security;

-- Allow anyone (even anonymous) to insert
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

-- Only authenticated users with service_role can view
create policy "Only admins can view waitlist"
  on public.waitlist for select
  using (auth.jwt() ->> 'role' = 'service_role');
