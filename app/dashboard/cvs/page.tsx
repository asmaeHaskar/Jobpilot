'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { DeleteIcon, DownloadIcon, PlusIcon, CheckIcon, StarIcon } from 'lucide-react'
import { toast } from 'sonner'

export default function CVsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [cvs, setCvs] = useState<any[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadCVs()
  }, [router])

  const loadCVs = async () => {
    const session = await supabase.auth.getSession()
    if (!session.data.session) {
      router.push('/auth/login')
      return
    }

    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', session.data.session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCvs(data || [])
    } catch (error) {
      console.error('Error loading CVs:', error)
      toast.error('Failed to load CVs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cvId: string) => {
    if (!confirm('Are you sure you want to delete this CV?')) return

    setDeleting(cvId)
    try {
      const { error } = await supabase.from('cvs').delete().eq('id', cvId)

      if (error) throw error

      setCvs(cvs.filter((cv) => cv.id !== cvId))
      toast.success('CV deleted successfully')
    } catch (error) {
      console.error('Error deleting CV:', error)
      toast.error('Failed to delete CV')
    } finally {
      setDeleting(null)
    }
  }

  const handleSetPrimary = async (cvId: string) => {
    try {
      const session = await supabase.auth.getSession()
      const userId = session.data.session?.user.id

      // Remove primary from all CVs
      await supabase.from('cvs').update({ is_primary: false }).eq('user_id', userId)

      // Set as primary
      const { error } = await supabase
        .from('cvs')
        .update({ is_primary: true })
        .eq('id', cvId)

      if (error) throw error

      // Update local state
      setCvs(cvs.map((cv) => ({ ...cv, is_primary: cv.id === cvId })))
      toast.success('Primary CV updated')
    } catch (error) {
      console.error('Error setting primary CV:', error)
      toast.error('Failed to update primary CV')
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
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My CVs</h1>
          <p className="text-muted-foreground">Upload and manage your resumes</p>
        </div>
        <Link href="/dashboard/cvs/upload">
          <Button className="gap-2">
            <PlusIcon className="w-5 h-5" />
            Upload CV
          </Button>
        </Link>
      </div>

      {cvs.length === 0 ? (
        <Empty
          title="No CVs uploaded yet"
          description="Upload your first CV to get started with job matching and applications."
          action={
            <Link href="/dashboard/cvs/upload">
              <Button>Upload CV</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {cvs.map((cv) => (
            <Card key={cv.id} className="hover:border-primary/50 transition">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle>{cv.filename}</CardTitle>
                      {cv.is_primary && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <StarIcon className="w-3 h-3" />
                          Primary
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      Uploaded {new Date(cv.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!cv.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(cv.id)}
                      >
                        <StarIcon className="w-4 h-4 mr-1" />
                        Set as Primary
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cv.id)}
                      disabled={deleting === cv.id}
                    >
                      {deleting === cv.id ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        <DeleteIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {cv.extracted_skills && cv.extracted_skills.length > 0 && (
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Extracted Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {cv.extracted_skills.map((skill: string) => (
                        <div
                          key={skill}
                          className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
