'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircleIcon, XCircleIcon, Clock, MessageSquareIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  applied: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-4 h-4" />, label: 'Applied' },
  interview: { color: 'bg-purple-100 text-purple-800', icon: <MessageSquareIcon className="w-4 h-4" />, label: 'Interview' },
  accepted: { color: 'bg-green-100 text-green-800', icon: <CheckCircleIcon className="w-4 h-4" />, label: 'Accepted' },
  rejected: { color: 'bg-red-100 text-red-800', icon: <XCircleIcon className="w-4 h-4" />, label: 'Rejected' },
}

export default function ApplicationsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<any[]>([])
  const [stats, setStats] = useState({ applied: 0, interview: 0, accepted: 0, rejected: 0 })
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadApplications()
    }
  }, [isAuthenticated, user])

  const loadApplications = async () => {
    if (!user) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs:job_id(title, company, location, url)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })

      if (error) throw error

      setApplications(data || [])

      // Calculate stats
      const statData = {
        applied: (data || []).filter(a => a.status === 'applied').length,
        interview: (data || []).filter(a => a.status === 'interview').length,
        accepted: (data || []).filter(a => a.status === 'accepted').length,
        rejected: (data || []).filter(a => a.status === 'rejected').length,
      }
      setStats(statData)
    } catch (error) {
      console.error('Error loading applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        toast.error(data.error || 'Failed to update status')
        return
      }

      // Update local state
      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ))

      toast.success('Status updated')
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update status')
    }
  }

  const deleteApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications?id=${applicationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        toast.error('Failed to delete application')
        return
      }

      setApplications(applications.filter(app => app.id !== applicationId))
      toast.success('Application deleted')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete application')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    )
  }

  const filteredApplications = filterStatus
    ? applications.filter(app => app.status === filterStatus)
    : applications

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track all your job applications in one place</p>
      </div>

      {applications.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-blue-600">{stats.applied}</p>
                <p className="text-sm text-muted-foreground">Applied</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-purple-600">{stats.interview}</p>
                <p className="text-sm text-muted-foreground">Interviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                <p className="text-sm text-muted-foreground">Accepted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
          <div className="flex gap-4">
            <Select value={filterStatus || ''} onValueChange={(value) => setFilterStatus(value || null)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Applications</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredApplications.map((app) => {
            const config = statusConfig[app.status]
            return (
              <Card key={app.id} className="hover:border-primary/50 transition">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{app.jobs?.title}</CardTitle>
                      <CardDescription>{app.jobs?.company}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={config.color}>
                        <span className="mr-1">{config.icon}</span>
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{app.jobs?.location}</p>

                  {app.message && (
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Application Message:</p>
                      <p className="text-sm">{app.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                      {app.updated_at && app.updated_at !== app.applied_at && (
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date(app.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Select value={app.status} onValueChange={(newStatus) => updateApplicationStatus(app.id, newStatus)}>
                        <SelectTrigger className="w-[140px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteApplication(app.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
