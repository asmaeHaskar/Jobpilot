'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function JobsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<any[]>([])
  const [cvCount, setCvCount] = useState(0)

  useEffect(() => {
    loadData()
  }, [router])

  const loadData = async () => {
    const session = await supabase.auth.getSession()
    if (!session.data.session) {
      router.push('/auth/login')
      return
    }

    try {
      // Check if user has CVs
      const { count } = await supabase
        .from('cvs')
        .select('*', { count: 'exact' })
        .eq('user_id', session.data.session.user.id)

      setCvCount(count || 0)

      // Get jobs (placeholder - will be populated with API integration)
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .limit(10)

      setJobs(data || [])
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  if (cvCount === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <Empty
          title="Upload a CV to find matching jobs"
          description="Start by uploading your resume so we can match you with relevant opportunities."
          action={
            <Button onClick={() => router.push('/dashboard/cvs/upload')}>
              Upload Your CV
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <p className="text-muted-foreground">
          Matching opportunities based on your CV will appear here soon
        </p>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No jobs loaded yet. Jobs will be fetched from integrated APIs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:border-primary/50 transition">
              <CardHeader>
                <div className="space-y-1">
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.company}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{job.location}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
