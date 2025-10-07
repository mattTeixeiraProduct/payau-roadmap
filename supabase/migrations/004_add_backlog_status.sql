-- Migration: Add Backlog status
-- Description: Adds 'Backlog' as a new status option for projects
-- Created: 2025-10-07

-- Insert Backlog status
INSERT INTO statuses (name, color) VALUES
  ('Backlog', '#9CA3AF')
ON CONFLICT (name) DO NOTHING;

-- Rollback instructions:
-- To rollback this migration, run:
-- DELETE FROM statuses WHERE name = 'Backlog';

