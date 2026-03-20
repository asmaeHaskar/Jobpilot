import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing required Supabase environment variables: ' +
      'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        cookie: cookieStore
          .getAll()
          .map(({ name, value }) => `${name}=${value}`)
          .join(';'),
      },
    },
  })
}
