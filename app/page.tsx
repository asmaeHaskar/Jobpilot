'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { BriefcaseIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
        router.push('/dashboard')
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <BriefcaseIcon className="w-8 h-8" />
            JobPilot
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Automate Your Job Application
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              with AI
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            JobPilot uses artificial intelligence to help you apply to jobs faster and smarter. 
            Extract your skills from your CV, match jobs automatically, and generate personalized 
            application messages in seconds.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/auth/signup">
              <Button size="lg" className="h-12 px-8">
                Start Applying Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-lg border border-border/40 bg-card hover:bg-accent/50 transition">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Smart Job Matching</h3>
            <p className="text-muted-foreground">
              AI analyzes your CV to find the most relevant job opportunities
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border/40 bg-card hover:bg-accent/50 transition">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Personalized Messages</h3>
            <p className="text-muted-foreground">
              Generate customized application messages tailored to each job
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border/40 bg-card hover:bg-accent/50 transition">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BriefcaseIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Automated Applications</h3>
            <p className="text-muted-foreground">
              Apply to multiple jobs efficiently with a single click
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
