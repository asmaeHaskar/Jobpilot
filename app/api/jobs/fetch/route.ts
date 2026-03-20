import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Fetch jobs from RemoteOK API (free, no authentication required)
async function fetchFromRemoteOK(): Promise<any[]> {
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'JobPilot/1.0',
      },
    });

    if (!response.ok) {
      console.warn('RemoteOK API error:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Filter and transform RemoteOK jobs
    const jobs = (Array.isArray(data) ? data : data.jobs || [])
      .filter((job: any) => job.id && job.id !== 'apikey')
      .map((job: any) => ({
        title: job.title,
        company: job.company,
        description: job.description || '',
        location: job.location || 'Remote',
        job_type: 'Remote',
        url: job.url,
        source: 'remoteok',
        posted_at: new Date(job.date * 1000),
      }))
      .slice(0, 50); // Limit to 50 jobs

    return jobs;
  } catch (error) {
    console.error('RemoteOK fetch error:', error);
    return [];
  }
}

// Fetch from GitHub Jobs API (free, no authentication)
async function fetchFromGitHubJobs(): Promise<any[]> {
  try {
    const response = await fetch(
      'https://jobs.github.com/positions.json?description=developer&full_time=true',
      {
        headers: {
          'User-Agent': 'JobPilot/1.0',
        },
      }
    );

    if (!response.ok) {
      console.warn('GitHub Jobs API error:', response.statusText);
      return [];
    }

    const data = await response.json();

    const jobs = (Array.isArray(data) ? data : [])
      .map((job: any) => ({
        title: job.title,
        company: job.company,
        description: job.description || '',
        location: job.location || 'Remote',
        job_type: 'Full Time',
        url: job.url,
        source: 'github-jobs',
        posted_at: new Date(job.created_at),
      }))
      .slice(0, 50);

    return jobs;
  } catch (error) {
    console.error('GitHub Jobs fetch error:', error);
    return [];
  }
}

// Fetch from JustRemote API
async function fetchFromJustRemote(): Promise<any[]> {
  try {
    const response = await fetch('https://justremote.co/api/v1/jobs?limit=50', {
      headers: {
        'User-Agent': 'JobPilot/1.0',
      },
    });

    if (!response.ok) {
      console.warn('JustRemote API error:', response.statusText);
      return [];
    }

    const data = await response.json();

    const jobs = (data.jobs || [])
      .map((job: any) => ({
        title: job.title,
        company: job.company_name,
        description: job.description || '',
        location: 'Remote',
        job_type: 'Remote',
        url: job.url,
        source: 'justremote',
        posted_at: new Date(job.created_at),
      }))
      .slice(0, 50);

    return jobs;
  } catch (error) {
    console.error('JustRemote fetch error:', error);
    return [];
  }
}

export async function GET() {
  try {
    const supabase = await createServerClient();

    // Fetch jobs from multiple sources in parallel
    const [remoteOKJobs, githubJobs, justRemoteJobs] = await Promise.all([
      fetchFromRemoteOK(),
      fetchFromGitHubJobs(),
      fetchFromJustRemote(),
    ]);

    // Combine and deduplicate jobs by URL
    const allJobs = [...remoteOKJobs, ...githubJobs, ...justRemoteJobs];
    const seenUrls = new Set<string>();
    const uniqueJobs = allJobs.filter(job => {
      if (seenUrls.has(job.url)) return false;
      seenUrls.add(job.url);
      return true;
    });

    // Save new jobs to database (upsert by URL)
    const jobsToInsert = uniqueJobs.map(job => ({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      job_type: job.job_type,
      url: job.url,
      source: job.source,
      posted_at: job.posted_at,
    }));

    if (jobsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('jobs')
        .upsert(jobsToInsert, { onConflict: 'url' });

      if (insertError) {
        console.error('Database insert error:', insertError);
      }
    }

    // Return paginated results
    const { data: savedJobs, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .order('posted_at', { ascending: false })
      .limit(100);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: savedJobs?.length || 0,
      jobs: savedJobs || [],
      sources: ['remoteok', 'github-jobs', 'justremote'],
    });
  } catch (error) {
    console.error('Job fetching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to trigger job fetch (useful for cron jobs)
export async function POST() {
  return GET();
}
