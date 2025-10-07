# Supabase Setup Guide

## Step-by-Step Instructions

### Step 1: Create Supabase Project (if not already done)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details and wait for it to be ready

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under Project API keys)

### Step 3: Update Environment Variables

Create or update your `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

**Note:** Replace `your_project_url_here` and `your_anon_key_here` with actual values from Step 2.

### Step 4: Run Database Migrations

#### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_create_projects_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success. No rows returned"
8. Repeat steps 3-7 for `supabase/migrations/002_seed_initial_data.sql`

#### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 5: Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - ✅ statuses
   - ✅ streams
   - ✅ users
   - ✅ initiatives
   - ✅ releases
   - ✅ projects

3. Click on each table to verify data:
   - `statuses` should have 5 rows (Not started, In progress, At risk, Done, Cancelled)
   - `streams` should have 5 rows (Payments, Rewards, Growth, US, Mobile)
   - `users` should have 1 row (Product Team)
   - `initiatives` should have 3 rows (Q4 2025, Q1 2026, Q2 2026)
   - `releases` should have 3 rows (Q4 2025, Q1 2026, Q2 2026)
   - `projects` should be empty (ready for your data)

### Step 6: Test Database Connection

Create a simple test file or add this to your existing page:

```typescript
import { createClient } from '@/lib/supabase/client';

// Test function
async function testConnection() {
  const supabase = createClient();
  const { data, error } = await supabase.from('statuses').select('*');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful! Statuses:', data);
  }
}

// Call it
testConnection();
```

### Step 7: Migrate Your Existing Mock Data (Optional)

If you want to migrate your existing mock projects to the database, you can:

1. Open `supabase/migrations/003_migrate_existing_data.sql` (create this file)
2. Add INSERT statements for your existing projects
3. Run it in the SQL Editor

Example:
```sql
-- Get IDs first
WITH 
  payment_stream AS (SELECT id FROM streams WHERE name = 'Payments' LIMIT 1),
  in_progress_status AS (SELECT id FROM statuses WHERE name = 'In progress' LIMIT 1),
  product_user AS (SELECT id FROM users WHERE name = 'Product Team' LIMIT 1),
  q4_init AS (SELECT id FROM initiatives WHERE name = 'Q4 2025 Initiative' LIMIT 1),
  q4_release AS (SELECT id FROM releases WHERE name = 'Q4 2025' LIMIT 1)

INSERT INTO projects (name, description, start_date, end_date, status_id, stream_id, owner_id, initiative_id, release_id, progress)
SELECT 
  'FX Pt 2: 4 Popular Currencies',
  'China, Japan, Thailand, Philippines with complicated requirements. Addressing customer requests and covering all popular currencies to increase use of FX.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '4 months',
  (SELECT id FROM in_progress_status),
  (SELECT id FROM payment_stream),
  (SELECT id FROM product_user),
  (SELECT id FROM q4_init),
  (SELECT id FROM q4_release),
  25;
```

## Next Steps

Now that your database is set up, you can:

1. ✅ Create projects through the UI
2. ✅ Projects will persist across page reloads
3. ✅ Use the database query functions in `src/lib/db/queries.ts`
4. 🔄 Update your frontend to fetch from Supabase instead of mock data

## Troubleshooting

### Error: "Invalid API key"
- Check that your environment variables are correct
- Make sure you copied the **anon public** key (shown as "publishable" in the dashboard), not the service role key
- Restart your Next.js dev server after updating `.env.local`

### Error: "relation does not exist"
- Make sure you ran all migrations in order
- Check the SQL Editor for any error messages
- Verify tables exist in Table Editor

### Error: "Row Level Security policy"
- The migrations include permissive policies for development
- You can disable RLS temporarily in Table Editor → [table] → Settings → Enable RLS (toggle off)
- Remember to re-enable and add proper policies before production

## Security Reminder

⚠️ **Before going to production:**

1. Add proper authentication
2. Update RLS policies to restrict access
3. Never commit `.env.local` to git (it's already in `.gitignore`)
4. Use Row Level Security policies based on authenticated users

## Questions?

Check the `supabase/README.md` file for:
- Detailed schema documentation
- Example queries
- TypeScript types
- Security best practices

