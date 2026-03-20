'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { CheckCircleIcon, AlertCircleIcon, ExternalLinkIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function InitPage() {
  const router = useRouter()
  const [initializing, setInitializing] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showManualInstructions, setShowManualInstructions] = useState(false)

  useEffect(() => {
    // Auto-initialize on page load
    initializeDatabase()
  }, [])

  const initializeDatabase = async () => {
    try {
      setInitializing(true)
      setError(null)

      console.log('[v0] Starting database initialization...')

      const response = await fetch('/api/db/init', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('[v0] Init error:', data.error)
        setError(data.error || 'Failed to initialize database')
        setShowManualInstructions(true)
        return
      }

      console.log('[v0] Database initialized successfully')
      setInitialized(true)
      toast.success('Database initialized successfully!')

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('[v0] Init error:', error)
      const message = error instanceof Error ? error.message : 'An error occurred'
      setError(message)
      setShowManualInstructions(true)
    } finally {
      setInitializing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">Setting Up JobPilot Database</CardTitle>
          <CardDescription>
            Initializing your database tables...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {initializing && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Spinner />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Creating database tables and configuring security...
              </p>
            </div>
          )}

          {initialized && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <CheckCircleIcon className="w-12 h-12 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-green-600">Setup Complete!</p>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircleIcon className="w-12 h-12 text-red-600" />
              </div>
              <div className="text-center space-y-3">
                <div>
                  <p className="font-semibold text-red-600 mb-1">Automatic Setup Failed</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>

                {showManualInstructions && (
                  <div className="bg-muted p-4 rounded-lg text-left space-y-3 mt-4">
                    <p className="font-semibold text-sm">Manual Setup (2 minutes):</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Open your Supabase Dashboard</li>
                      <li>Go to <strong>SQL Editor</strong></li>
                      <li>Click <strong>New Query</strong></li>
                      <li>Copy the SQL from <code className="bg-background px-2 py-1 rounded">/scripts/init-database.sql</code></li>
                      <li>Paste it and click <strong>Run</strong></li>
                      <li>Come back here and click <strong>Retry</strong></li>
                    </ol>
                  </div>
                )}

                <div className="flex gap-2 justify-center pt-2">
                  <Button
                    onClick={initializeDatabase}
                    disabled={initializing}
                  >
                    {initializing ? 'Retrying...' : 'Retry Auto Setup'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://app.supabase.com', '_blank')}
                  >
                    <ExternalLinkIcon className="w-4 h-4 mr-2" />
                    Open Supabase
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
