import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

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

async function seedJobs() {
  console.log('Starting job seeding...')
  
  try {
    const [remoteOkJobs, githubJobs] = await Promise.all([
      fetchFromRemoteOK(),
      fetchFromGitHubJobs(),
    ])

    const allJobs = [...remoteOkJobs, ...githubJobs]
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.url, job])).values()
    )

    console.log(`Found ${uniqueJobs.length} unique jobs`)

    if (uniqueJobs.length > 0) {
      const { error } = await supabase
        .from('jobs')
        .upsert(uniqueJobs, { onConflict: 'url' })

      if (error) {
        console.error('Insert error:', error)
        process.exit(1)
      }

      console.log(`Successfully inserted ${uniqueJobs.length} jobs`)
    }

    process.exit(0)
  } catch (error) {
    console.error('Seeding error:', error)
    process.exit(1)
  }
}

seedJobs()
