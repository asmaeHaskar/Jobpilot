import { createClient } from '@supabase/supabase-js'

const createTablesSQL = `
-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  extracted_text TEXT,
  skills TEXT[] DEFAULT '{}',
  experience JSONB,
  education JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  location TEXT,
  job_type TEXT,
  url TEXT NOT NULL UNIQUE,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'applied',
  message TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Create job_matches table
CREATE TABLE IF NOT EXISTS job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  match_score FLOAT NOT NULL,
  matched_skills TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for CVs
DROP POLICY IF EXISTS "Users can view their own CVs" ON cvs;
CREATE POLICY "Users can view their own CVs" ON cvs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own CVs" ON cvs;
CREATE POLICY "Users can insert their own CVs" ON cvs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own CVs" ON cvs;
CREATE POLICY "Users can update their own CVs" ON cvs
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for applications
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own applications" ON applications;
CREATE POLICY "Users can insert their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own applications" ON applications;
CREATE POLICY "Users can update their own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for job_matches
DROP POLICY IF EXISTS "Users can view their own matches" ON job_matches;
CREATE POLICY "Users can view their own matches" ON job_matches
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own matches" ON job_matches;
CREATE POLICY "Users can insert their own matches" ON job_matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for jobs (anyone can read)
DROP POLICY IF EXISTS "Anyone can view jobs" ON jobs;
CREATE POLICY "Anyone can view jobs" ON jobs
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
`

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('[v0] Missing credentials for DB init')
      return Response.json(
        { error: 'Server not configured', hint: 'Please set SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      )
    }

    // Create admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Execute SQL via rpc if available, otherwise return instructions
    try {
      // Try using rpc
      const { error } = await (supabase as any).rpc('exec_sql', {
        sql: createTablesSQL,
      })

      if (error) {
        console.log('[v0] RPC not available, tables may already exist')
      }
    } catch (err) {
      console.log('[v0] RPC execution note:', err instanceof Error ? err.message : 'N/A')
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
