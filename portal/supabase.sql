-- Locked In Dept. portal: run once in Supabase > SQL Editor.
-- One row per member holding their progress, Core Four history, threads and settings.

create table if not exists public.member_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.member_state enable row level security;

create policy "members read own state" on public.member_state
  for select using (auth.uid() = user_id);
create policy "members insert own state" on public.member_state
  for insert with check (auth.uid() = user_id);
create policy "members update own state" on public.member_state
  for update using (auth.uid() = user_id);

-- Only invited members can sign in: keep "Allow new users to sign up" OFF in
-- Authentication > Providers > Email, and add members under Authentication > Users > Invite.
