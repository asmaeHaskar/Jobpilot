'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, AlertCircleIcon, LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'loading' | 'ready' | 'initializing' | 'complete' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Auto-initialize on page load
    initializeDatabase()
  }, [])

  const initializeDatabase = async () => {
    try {
      setStep('initializing')
      setError(null)

      const response = await fetch('/api/setup/init-db', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to initialize database')
        setStep('error')
        return
      }

      setStep('complete')
      toast.success('Database initialized successfully!')

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('[v0] Init error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      setStep('error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">JobPilot Setup</CardTitle>
          <CardDescription>Initializing your database...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'loading' && (
            <div className="space-y-2 text-center">
              <LoaderIcon className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Initializing...</p>
            </div>
          )}

          {step === 'initializing' && (
            <div className="space-y-2 text-center">
              <LoaderIcon className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">Creating database tables...</p>
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-2 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto" />
              <p className="font-semibold text-green-600">Setup Complete!</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4">
              <div className="space-y-2 text-center">
                <AlertCircleIcon className="w-8 h-8 text-red-600 mx-auto" />
                <p className="font-semibold text-red-600">Setup Failed</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <div className="space-y-2">
                <Button onClick={initializeDatabase} className="w-full">
                  Retry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
