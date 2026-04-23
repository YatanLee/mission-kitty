-- Mission Kitty — Migration 002
-- Adds monthly frequency, custom every-N-days recurrence, and last_completed_date
-- Run this in Supabase SQL Editor AFTER 001_init.sql

-- 1. Drop old frequency check constraint
ALTER TABLE public.missions
  DROP CONSTRAINT IF EXISTS missions_frequency_check;

-- 2. Add updated constraint that includes 'monthly' and 'custom'
ALTER TABLE public.missions
  ADD CONSTRAINT missions_frequency_check
  CHECK (frequency IN ('daily', 'weekly', 'monthly', 'custom'));

-- 3. interval_days — for custom recurrence (e.g. every 3 days)
ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS interval_days integer
  CHECK (interval_days IS NULL OR interval_days > 0);

-- 4. last_completed_date — used to calculate next due date for custom
ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS last_completed_date date;
