-- Locked In Dept. portal, part 2: numbers and the coach view. Run once in Supabase > SQL Editor.
-- Change the email list in is_coach() if the coach account changes. The coach must also be an invited member.

alter table public.member_state add column if not exists email text;

create or replace function public.is_coach() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in ('info@madebycompound.com')
$$;

create policy "coach reads all state" on public.member_state
  for select using (public.is_coach());

create table if not exists public.coach_notes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  week text,
  note text not null,
  created_at timestamptz not null default now()
);
alter table public.coach_notes enable row level security;

create policy "members and coach read notes" on public.coach_notes
  for select using (auth.uid() = user_id or public.is_coach());
create policy "coach writes notes" on public.coach_notes
  for insert with check (public.is_coach());
