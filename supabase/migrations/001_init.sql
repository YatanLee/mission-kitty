-- Mission Kitty — Initial Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Missions table
create table if not exists public.missions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  description   text,
  category      text not null default 'custom'
                  check (category in ('health', 'work', 'personal', 'custom')),
  frequency     text not null default 'daily'
                  check (frequency in ('daily', 'weekly')),
  is_done_today boolean not null default false,
  streak        integer not null default 0,
  due_date      date,
  created_at    timestamptz not null default now()
);

-- Row Level Security: each user only sees their own rows
alter table public.missions enable row level security;

create policy "Users can read own missions"
  on public.missions for select
  using (auth.uid() = user_id);

create policy "Users can insert own missions"
  on public.missions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own missions"
  on public.missions for update
  using (auth.uid() = user_id);

create policy "Users can delete own missions"
  on public.missions for delete
  using (auth.uid() = user_id);

-- Index for faster user queries
create index if not exists missions_user_id_idx on public.missions(user_id);

-- Daily reset function: resets is_done_today at midnight
-- Schedule this with pg_cron or Supabase scheduled functions
create or replace function reset_daily_missions()
returns void language plpgsql as $$
begin
  update public.missions
  set is_done_today = false
  where frequency = 'daily' and is_done_today = true;
end;
$$;
