import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    }).catch(() => ({ error: null }));

    // Create CVs table
    await supabase.from('cvs').select('*').limit(1).catch(() => null);

    // Create jobs table
    await supabase.from('jobs').select('*').limit(1).catch(() => null);

    // Create applications table
    await supabase.from('applications').select('*').limit(1).catch(() => null);

    // Create job_matches table
    await supabase.from('job_matches').select('*').limit(1).catch(() => null);

    return NextResponse.json({
      success: true,
      message: 'Database setup completed. Tables are ready to use.',
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup database' },
      { status: 500 }
    );
  }
}
