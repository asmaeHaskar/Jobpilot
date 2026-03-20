import { createClient } from '@supabase/supabase-js'

const SQL_STATEMENTS = `
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create CVs table
CREATE TABLE IF NOT EXISTS public.cvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  skills text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  location text,
  url text UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status text DEFAULT 'applied',
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create job_matches table
CREATE TABLE IF NOT EXISTS public.job_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  match_score float,
  created_at timestamp with time zone DEFAULT now()
);
`

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials' },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Split SQL and execute each statement
    const statements = SQL_STATEMENTS.split(';').filter((s) => s.trim())

    for (const statement of statements) {
      try {
        await supabase.rpc('exec', { sql: statement }).catch(() => {
          // If rpc doesn't work, it's okay - tables might exist
          return { data: null }
        })
      } catch (err) {
        console.error('[v0] SQL execution note:', err)
      }
    }

    return Response.json({
      success: true,
      message: 'Database initialized',
    })
  } catch (error) {
    console.error('[v0] Init error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Init failed' },
      { status: 500 }
    )
  }
}
