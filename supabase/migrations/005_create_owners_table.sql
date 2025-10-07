-- Create owners table
CREATE TABLE IF NOT EXISTS owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  slack_handle TEXT,
  bio TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop the existing projects.owner_id FK so we can repoint it
ALTER TABLE projects
  DROP CONSTRAINT IF EXISTS projects_owner_id_fkey;

-- Copy existing users into owners (best effort using email; duplicates skipped)
INSERT INTO owners (name, email, avatar_url, created_at, updated_at)
SELECT name, email, image, created_at, updated_at
FROM users
WHERE email IS NOT NULL
ON CONFLICT (email) DO NOTHING;

-- Migrate existing project owners to the new owners table
UPDATE projects
SET owner_id = owners.id
FROM owners
WHERE owner_id IN (SELECT id FROM users)
  AND (
    owners.email = (SELECT email FROM users WHERE users.id = projects.owner_id)
    OR (owners.email IS NULL AND owners.name = (SELECT name FROM users WHERE users.id = projects.owner_id))
  );

-- Restore the FK pointing projects.owner_id to owners(id)
ALTER TABLE projects
  ADD CONSTRAINT projects_owner_id_fkey
  FOREIGN KEY (owner_id)
  REFERENCES owners(id)
  ON DELETE SET NULL;

-- Helpful index for case-insensitive owner lookups
CREATE INDEX IF NOT EXISTS idx_owners_name ON owners ((lower(name)));

-- Trigger to keep updated_at fresh
CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON owners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS and keep permissive policies for now
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on owners" ON owners FOR SELECT USING (true);
CREATE POLICY "Allow public insert on owners" ON owners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on owners" ON owners FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on owners" ON owners FOR DELETE USING (true);