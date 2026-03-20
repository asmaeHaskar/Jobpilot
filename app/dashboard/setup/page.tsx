'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircleIcon, LoaderIcon, AlertIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function SetupPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [jobCount, setJobCount] = useState(0)
  const [isInitializing, setIsInitializing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      checkJobCount()
    }
  }, [isAuthenticated, router])

  const checkJobCount = async () => {
    try {
      const response = await fetch('/api/admin/seed-jobs')
      const data = await response.json()
      if (data.success) {
        setJobCount(data.totalJobs || 0)
      }
    } catch (error) {
      console.error('Error checking job count:', error)
    }
  }

  const handleSeedJobs = async () => {
    setIsInitializing(true)
    try {
      const response = await fetch('/api/admin/seed-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer dev-key`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to seed jobs')
      }

      setJobCount(data.count || 0)
      toast.success(`Successfully loaded ${data.count} jobs!`)
      await checkJobCount()
    } catch (error) {
      console.error('Seed error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to load jobs')
    } finally {
      setIsInitializing(false)
    }
  }

  const steps = [
    {
      title: 'Load Job Opportunities',
      description: 'Populate the database with latest job listings from free sources (RemoteOK, GitHub Jobs)',
      completed: jobCount > 0,
      action: !jobCount ? (
        <Button
          onClick={handleSeedJobs}
          disabled={isInitializing}
          size="sm"
        >
          {isInitializing ? (
            <>
              <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            'Load Jobs'
          )}
        </Button>
      ) : (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircleIcon className="w-4 h-4 mr-1" />
          {jobCount} jobs loaded
        </Badge>
      ),
    },
    {
      title: 'Upload Your CV',
      description: 'Upload your resume to extract skills and match with job opportunities',
      completed: false,
      action: (
        <Button
          onClick={() => router.push('/dashboard/cvs/upload')}
          size="sm"
        >
          Upload CV
        </Button>
      ),
    },
    {
      title: 'Browse Matched Jobs',
      description: 'Discover job opportunities matched to your skills and experience',
      completed: false,
      action: (
        <Button
          onClick={() => router.push('/dashboard/jobs')}
          variant="outline"
          size="sm"
          disabled={jobCount === 0}
        >
          View Jobs
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome to JobPilot!</h1>
        <p className="text-muted-foreground">
          Let's get you set up to find your next opportunity with AI-powered job matching.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card
            key={index}
            className={step.completed ? 'border-green-200 bg-green-50/50' : ''}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {step.completed && (
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    )}
                    <CardTitle>{step.title}</CardTitle>
                  </div>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <p className="text-sm text-muted-foreground">
                {step.completed ? 'Complete' : `Step ${index + 1} of ${steps.length}`}
              </p>
              {step.action}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertIcon className="w-5 h-5" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            • Your CV data is processed locally and securely stored. We use AI to extract your skills and match them with jobs.
          </p>
          <p>
            • All job sources are free and publicly available (RemoteOK, GitHub Jobs).
          </p>
          <p>
            • Personalized application messages are generated using GPT-4 Mini through the Vercel AI Gateway.
          </p>
          <p>
            • You can track all your applications and update their status in the Applications section.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
