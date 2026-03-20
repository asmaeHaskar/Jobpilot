# Database Setup Guide

## Quick Start - Manual Setup (5 minutes)

If the automatic initialization doesn't work, follow these steps manually:

### Step 1: Go to Supabase SQL Editor

1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Copy and Paste the SQL

Copy the entire SQL from `/scripts/init-database.sql` and paste it into the SQL editor.

### Step 3: Run the Query

Click the **Run** button (or press Ctrl+Enter)

### Step 4: Verify

You should see these tables created in **Table Editor**:
- `profiles`
- `cvs`
- `jobs`
- `applications`
- `job_matches`

## What Each Table Does

| Table | Purpose |
|-------|---------|
| `profiles` | User account information |
| `cvs` | Uploaded resumes with extracted skills |
| `jobs` | Job listings from APIs |
| `applications` | Your job applications |
| `job_matches` | AI-generated job matches |

## If You Still Have Issues

### Problem: "Email not confirmed" error during login

**Solution:** Make sure email confirmation is disabled in Supabase:
1. Go to **Authentication** → **Providers** → **Email**
2. Disable "Confirm email"
3. OR use the magic link login option

### Problem: Tables already exist

That's fine! The SQL uses `CREATE TABLE IF NOT EXISTS` which won't duplicate tables.

### Problem: "Missing Supabase credentials"

Make sure these environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (for admin operations)

Find these in **Settings** → **API** in your Supabase dashboard.

## Testing the Setup

Once the database is initialized:

1. Sign up at `/auth/signup`
2. You should be redirected to dashboard automatically
3. The stats should show "0 CVs, 0 Applications, 0 Matches"
4. Click "Upload Your CV" to start

## Troubleshooting

If you see errors, check:
1. All environment variables are correctly set
2. Tables exist in Supabase SQL Editor
3. RLS policies are properly configured
4. Your browser console for specific error messages
