import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

async function fetchFromRemoteOK() {
  try {
    const response = await fetch('https://remoteok.io/api', {
      headers: { 'User-Agent': 'JobPilot/1.0' },
    })
    if (!response.ok) return []
    
    const data = await response.json()
    return (Array.isArray(data) ? data : [])
      .filter((job: any) => job.id && job.id !== 'apikey')
      .slice(0, 50)
      .map((job: any) => ({
        title: job.title || '',
        company: job.company || 'Unknown',
        description: job.description || '',
        location: job.location || 'Remote',
        job_type: 'Remote',
        url: job.url || '',
        source: 'remoteok',
        posted_at: new Date(job.date * 1000).toISOString(),
      }))
  } catch (error) {
    console.error('RemoteOK fetch error:', error)
    return []
  }
}

async function fetchFromGitHubJobs() {
  try {
    const response = await fetch(
      'https://jobs.github.com/positions.json?description=developer&full_time=true',
      { headers: { 'User-Agent': 'JobPilot/1.0' } }
    )
    if (!response.ok) return []
    
    const data = await response.json()
    return (Array.isArray(data) ? data : [])
      .slice(0, 50)
      .map((job: any) => ({
        title: job.title || '',
        company: job.company || 'Unknown',
        description: job.description || '',
        location: job.location || 'Remote',
        job_type: 'Full Time',
        url: job.url || '',
        source: 'github-jobs',
        posted_at: new Date(job.created_at).toISOString(),
      }))
  } catch (error) {
    console.error('GitHub Jobs fetch error:', error)
    return []
  }
}

export async function POST(request: NextRequest) {
  try {
    // Basic security check - in production, verify this is called from Vercel cron
    const authHeader = request.headers.get('authorization')
    const expectedKey = process.env.CRON_SECRET || 'dev-key'
    
    if (authHeader !== `Bearer ${expectedKey}` && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting job seed...')

    const [remoteOkJobs, githubJobs] = await Promise.all([
      fetchFromRemoteOK(),
      fetchFromGitHubJobs(),
    ])

    const allJobs = [...remoteOkJobs, ...githubJobs]
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.url, job])).values()
    )

    console.log(`Found ${uniqueJobs.length} unique jobs`)

    if (uniqueJobs.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No jobs found from sources',
      })
    }

    const { error: upsertError, data } = await supabase
      .from('jobs')
      .upsert(uniqueJobs, { onConflict: 'url' })
      .select('count', { count: 'exact' })

    if (upsertError) {
      console.error('Insert error:', upsertError)
      return NextResponse.json(
        { error: 'Failed to insert jobs', details: upsertError },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${uniqueJobs.length} jobs`,
      count: uniqueJobs.length,
    })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { count } = await supabase
      .from('jobs')
      .select('count', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      totalJobs: count || 0,
    })
  } catch (error) {
    console.error('Count error:', error)
    return NextResponse.json(
      { error: 'Failed to count jobs' },
      { status: 500 }
    )
  }
}
