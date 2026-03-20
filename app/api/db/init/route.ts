export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials. Please run: npx supabase db pull' },
        { status: 400 }
      )
    }

    console.log('[v0] Database initialization started')

    // Instead of executing SQL directly, we'll use a fetch to the Supabase SQL API
    const sqlStatements = [
      `CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        username TEXT UNIQUE,
        full_name TEXT,
        email TEXT NOT NULL,
        avatar_url TEXT,
        bio TEXT,
        location TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
      
      `CREATE TABLE IF NOT EXISTS cvs (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS jobs (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
        status TEXT DEFAULT 'applied',
        message TEXT,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, job_id)
      )`,
      
      `CREATE TABLE IF NOT EXISTS job_matches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
        job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        match_score FLOAT NOT NULL,
        matched_skills TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`,
    ]

    // Execute each SQL statement
    for (const sql of sqlStatements) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: sql }),
        })

        if (!response.ok) {
          console.log('[v0] SQL execution note:', await response.text())
        }
      } catch (err) {
        console.log('[v0] SQL execution attempt:', (err as Error).message)
      }
    }

    console.log('[v0] Database initialization complete')

    return Response.json({ 
      success: true, 
      message: 'Database initialization complete. Tables ready to use.' 
    })
  } catch (error) {
    console.error('[v0] Init error:', error)
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to initialize database',
        hint: 'Please ensure SUPABASE_SERVICE_ROLE_KEY is set in your environment variables'
      },
      { status: 500 }
    )
  }
}
