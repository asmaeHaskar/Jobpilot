'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { ArrowRightIcon, UploadIcon, TargetIcon, MessageSquareIcon } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    cvCount: 0,
    applicationCount: 0,
    matchCount: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      const session = await supabase.auth.getSession()
      if (!session.data.session) {
        router.push('/auth/login')
        return
      }

      const userId = session.data.session.user.id

      try {
        // Get CV count
        const { count: cvCount } = await supabase
          .from('cvs')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)

        // Get application count
        const { count: applicationCount } = await supabase
          .from('applications')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)

        // Get match count
        const { count: matchCount } = await supabase
          .from('job_matches')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)

        setStats({
          cvCount: cvCount || 0,
          applicationCount: applicationCount || 0,
          matchCount: matchCount || 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to JobPilot</h1>
        <p className="text-muted-foreground">
          Automate your job search and land your dream role faster with AI-powered applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your CVs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.cvCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Uploaded resumes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Applications Sent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.applicationCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Total applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Job Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.matchCount}</div>
            <p className="text-xs text-muted-foreground mt-2">Matching opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Get Started</h2>
        
        {stats.cvCount === 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition cursor-pointer">
              <Link href="/dashboard/cvs/upload">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>Upload Your CV</CardTitle>
                      <CardDescription>
                        Start by uploading your resume to extract your skills
                      </CardDescription>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition opacity-50 cursor-not-allowed">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TargetIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Find Matching Jobs</CardTitle>
                    <CardDescription>Upload a CV first to find matching opportunities</CardDescription>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-primary/50 transition cursor-pointer">
              <Link href="/dashboard/cvs">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>Manage CVs</CardTitle>
                      <CardDescription>View or upload new resumes</CardDescription>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition cursor-pointer">
              <Link href="/dashboard/jobs">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TargetIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>Find Jobs</CardTitle>
                      <CardDescription>Browse matching opportunities</CardDescription>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Link>
            </Card>

            <Card className="hover:border-primary/50 transition cursor-pointer">
              <Link href="/dashboard/applications">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquareIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>Applications</CardTitle>
                      <CardDescription>Track your job applications</CardDescription>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
