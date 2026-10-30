-- Core Four Score: anonymous results plus optional leads. Run once in Supabase > SQL Editor.
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  health numeric, self numeric, wealth numeric, relationships numeric, total numeric,
  lowest text, answers jsonb, source text
);
alter table public.scores enable row level security;
drop policy if exists "anyone can submit a score" on public.scores;
create policy "anyone can submit a score" on public.scores for insert to anon, authenticated with check (true);
drop policy if exists "coach reads scores" on public.scores;
create policy "coach reads scores" on public.scores for select using (public.is_coach());

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  score_id uuid references public.scores (id) on delete set null,
  handle text, email text,
  health numeric, self numeric, wealth numeric, relationships numeric, total numeric, lowest text,
  note text
);
alter table public.leads enable row level security;
drop policy if exists "anyone can leave details" on public.leads;
create policy "anyone can leave details" on public.leads for insert to anon, authenticated with check (true);
drop policy if exists "coach reads leads" on public.leads;
create policy "coach reads leads" on public.leads for select using (public.is_coach());
drop policy if exists "coach updates leads" on public.leads;
create policy "coach updates leads" on public.leads for update using (public.is_coach());
