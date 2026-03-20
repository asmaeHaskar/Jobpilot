import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Use service role to create user
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to avoid email verification requirement
      user_metadata: {
        full_name: fullName,
      },
    })

    if (authError) {
      console.error('Auth error:', authError)
      return Response.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email,
            full_name: fullName,
          },
        ])

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Don't fail - user was created successfully
      }
    }

    return Response.json({
      success: true,
      user: authData.user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to sign up' },
      { status: 500 }
    )
  }
}
