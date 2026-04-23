-- Mission Kitty — Migration 003
-- Adds target_count (times per day) and completed_count
-- Run this in Supabase SQL Editor AFTER 002_add_recurrence.sql

-- How many times this mission must be done per period (default 1)
ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS target_count integer NOT NULL DEFAULT 1
  CHECK (target_count >= 1);

-- How many times it has been done today
ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS completed_count integer NOT NULL DEFAULT 0
  CHECK (completed_count >= 0);
