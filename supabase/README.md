# Supabase Database Setup for Roadmap Visualization

## Database Schema

### Tables Overview

1. **projects** - Main table storing roadmap projects
2. **statuses** - Project statuses (Not started, In progress, At risk, Done, Cancelled)
3. **streams** - Product streams (Payments, Rewards, Growth, US, Mobile)
4. **users** - Project owners/team members
5. **initiatives** - Quarterly initiatives
6. **releases** - Release versions/quarters

### Entity Relationship

```
projects
├── status_id → statuses
├── stream_id → streams
├── owner_id → users
├── initiative_id → initiatives
└── release_id → releases
```

## Setup Instructions

### 1. Run Migrations

You can run these migrations in two ways:

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - `001_create_projects_schema.sql`
   - `002_seed_initial_data.sql`
4. Click **Run** for each migration

#### Option B: Using Supabase CLI
```bash
# Make sure you're in the project directory
cd /Users/mattteixeira/Desktop/roadmap-visualisation

# Link to your Supabase project (if not already linked)
supabase link --project-ref your-project-ref

# Push migrations to Supabase
supabase db push
```

### 2. Verify Setup

Run this query in the SQL Editor to verify all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';
```

You should see:
- statuses
- streams
- users
- initiatives
- releases
- projects

## Database Schema Details

### Projects Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Project name |
| description | TEXT | Project description |
| start_date | DATE | Project start date |
| end_date | DATE | Project end date |
| status_id | UUID | Foreign key to statuses |
| stream_id | UUID | Foreign key to streams |
| owner_id | UUID | Foreign key to users |
| initiative_id | UUID | Foreign key to initiatives |
| release_id | UUID | Foreign key to releases |
| progress | INTEGER | Progress percentage (0-100) |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

### Example Queries

#### Get all projects with related data
```sql
SELECT 
  p.*,
  s.name as status_name,
  s.color as status_color,
  st.name as stream_name,
  st.color as stream_color,
  u.name as owner_name,
  i.name as initiative_name,
  r.name as release_name
FROM projects p
LEFT JOIN statuses s ON p.status_id = s.id
LEFT JOIN streams st ON p.stream_id = st.id
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN initiatives i ON p.initiative_id = i.id
LEFT JOIN releases r ON p.release_id = r.id
ORDER BY p.start_date;
```

#### Get projects by stream
```sql
SELECT p.*, s.name as stream_name
FROM projects p
JOIN streams s ON p.stream_id = s.id
WHERE s.name = 'Payments';
```

#### Get projects by status
```sql
SELECT p.*, st.name as status_name
FROM projects p
JOIN statuses st ON p.status_id = st.id
WHERE st.name = 'In progress';
```

## Security Notes

⚠️ **Important**: The current RLS policies allow public access for development. Before deploying to production:

1. Update RLS policies to restrict access based on authenticated users
2. Implement proper authentication with Supabase Auth
3. Add user roles and permissions

Example production policy:
```sql
-- Only allow authenticated users to insert/update/delete
CREATE POLICY "Authenticated users can manage projects" 
ON projects FOR ALL 
USING (auth.role() = 'authenticated');
```

## Next Steps

1. ✅ Run migrations
2. 🔄 Update your app to use Supabase instead of mock data
3. 🔐 Implement authentication (if needed)
4. 🚀 Deploy and test

## TypeScript Types

For reference, here are the TypeScript types matching the database schema:

```typescript
export type Status = {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export type Stream = {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export type User = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export type Initiative = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type Release = {
  id: string;
  name: string;
  quarter: string | null;
  year: number | null;
  release_date: string | null;
  created_at: string;
  updated_at: string;
}

export type Project = {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status_id: string;
  stream_id: string;
  owner_id: string | null;
  initiative_id: string | null;
  release_id: string | null;
  progress: number;
  created_at: string;
  updated_at: string;
}

// With relations
export type ProjectWithRelations = Project & {
  status: Status;
  stream: Stream;
  owner: User | null;
  initiative: Initiative | null;
  release: Release | null;
}
```

