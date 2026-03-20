export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    const checks = {
      environment: {
        supabase_url: supabaseUrl ? '✅ Set' : '❌ Missing',
        supabase_key: supabaseKey ? '✅ Set' : '❌ Missing',
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }

    // Test Supabase connection
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
          },
        })

        checks.supabase_connection = response.ok ? '✅ Connected' : '⚠️ Check failed'
      } catch (err) {
        checks.supabase_connection = `❌ Error: ${err instanceof Error ? err.message : 'Unknown'}`
      }
    }

    return Response.json({
      status: 'ok',
      message: 'JobPilot API is running',
      checks,
    })
  } catch (error) {
    return Response.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
