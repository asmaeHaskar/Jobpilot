'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  sent: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    loadApplications()
  }, [router])

  const loadApplications = async () => {
    const session = await supabase.auth.getSession()
    if (!session.data.session) {
      router.push('/auth/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, jobs(title, company, location)')
        .eq('user_id', session.data.session.user.id)
        .order('applied_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])
    } catch (error) {
      console.error('Error loading applications:', error)
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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track all your job applications in one place</p>
      </div>

      {applications.length === 0 ? (
        <Empty
          title="No applications yet"
          description="Start applying to jobs to see your applications here."
          action={
            <Button onClick={() => router.push('/dashboard/jobs')}>
              Browse Jobs
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="hover:border-primary/50 transition">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle>{app.jobs?.title}</CardTitle>
                    <CardDescription>{app.jobs?.company}</CardDescription>
                  </div>
                  <Badge className={statusColors[app.status] || ''}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{app.jobs?.location}</p>
                {app.generated_message && (
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Message Sent:</p>
                    <p className="text-sm line-clamp-2">{app.generated_message}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Applied {new Date(app.applied_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
