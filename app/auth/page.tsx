'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Initialize database on first load
    const initDB = async () => {
      try {
        console.log('[v0] Initializing database...')
        const res = await fetch('/api/init-db', { method: 'POST' })
        const data = await res.json()
        console.log('[v0] Init result:', data)
      } catch (err) {
        console.error('[v0] Init error:', err)
      }

      // Redirect to signup
      router.push('/auth/signup')
    }

    initDB()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  )
}
