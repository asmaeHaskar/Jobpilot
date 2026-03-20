'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLinkIcon, BriefcaseIcon, MapPinIcon, BarChart3Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function JobsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState<any[]>([])
  const [allJobs, setAllJobs] = useState<any[]>([])
  const [cvCount, setCvCount] = useState(0)
  const [filterScore, setFilterScore] = useState(30)
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (isAuthenticated && user) {
      loadData()
    }
  }, [isAuthenticated, user])

  const loadData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Check if user has CVs
      const { count: cvCount, data: cvs } = await supabase
        .from('cvs')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      setCvCount(cvCount || 0)

      // Get all jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(200)

      setAllJobs(jobsData || [])

      // If user has CVs, fetch matches for first CV
      if ((cvCount || 0) > 0 && cvs && cvs.length > 0) {
        const { data: matchData } = await supabase
          .from('job_matches')
          .select(`
            *,
            jobs:job_id(*)
          `)
          .eq('user_id', user.id)
          .eq('cv_id', cvs[0].id)
          .gte('match_score', filterScore)
          .order('match_score', { ascending: false })

        setMatches(matchData || [])
      }

      // Load applied jobs
      const { data: appliedData } = await supabase
        .from('applications')
        .select('job_id')
        .eq('user_id', user.id)

      setAppliedJobs(new Set(appliedData?.map(a => a.job_id) || []))
    } catch (error) {
      console.error('Error loading jobs:', error)
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleApplyJob = async (jobId: string, cvId?: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          jobId,
          cvId: cvId || null,
          generateMessage: true,
        }),
      })

      if (response.status === 409) {
        toast.error('You have already applied to this job')
        return
      }

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to apply')
        return
      }

      setAppliedJobs(prev => new Set([...prev, jobId]))
      toast.success('Application submitted successfully!')
    } catch (error) {
      console.error('Apply error:', error)
      toast.error('Failed to apply')
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
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <Empty
          title="Upload a CV to find matching jobs"
          description="Start by uploading your resume so we can match you with relevant opportunities based on your skills."
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
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <p className="text-muted-foreground">
          {matches.length > 0 
            ? `Found ${matches.length} matching jobs for your profile`
            : 'Explore available opportunities'}
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <BriefcaseIcon className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">
                {allJobs.length > 0 
                  ? 'No matching jobs found. Try adjusting your CV or check back later for new opportunities.'
                  : 'No jobs available yet. Please check back soon.'}
              </p>
              {allJobs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/cvs/upload')}
                >
                  Upload Another CV
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card
              key={match.id}
              className={`hover:border-primary/50 transition ${
                appliedJobs.has(match.job_id) ? 'opacity-60' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                      <CardTitle className="text-xl">{match.jobs.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {match.match_score}% match
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4" />
                      {match.jobs.company}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="w-4 h-4" />
                  {match.jobs.location}
                </div>

                {match.matched_skills && match.matched_skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <BarChart3Icon className="w-4 h-4" />
                      Matched Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {match.matched_skills.slice(0, 5).map((skill: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {match.matched_skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.matched_skills.length - 5}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {match.jobs.description}
                </p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApplyJob(match.job_id)}
                    disabled={appliedJobs.has(match.job_id)}
                  >
                    {appliedJobs.has(match.job_id) ? 'Already Applied' : 'Apply Now'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(match.jobs.url, '_blank')}
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
