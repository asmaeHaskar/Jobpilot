import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create client with anon key for login
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('[v0] Login error:', error.message)
      return Response.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return Response.json({
      success: true,
      user: data.user,
      session: data.session,
    })
  } catch (error) {
    console.error('[v0] Login API error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    )
  }
}
