'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Empty } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { DeleteIcon, DownloadIcon, PlusIcon, FileIcon, BriefcaseIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function CVsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [cvs, setCvs] = useState<any[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCVs()
    }
  }, [isAuthenticated, user])

  const loadCVs = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
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
    if (!confirm('Are you sure you want to delete this CV? This will also delete all job matches associated with it.')) return

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

  const downloadCV = (cv: any) => {
    if (cv.file_url) {
      window.open(cv.file_url, '_blank')
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
          <p className="text-muted-foreground">Upload and manage your resumes for job matching</p>
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
          description="Upload your first CV to get started with AI-powered job matching and personalized applications."
          action={
            <Link href="/dashboard/cvs/upload">
              <Button>Upload Your CV</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {cvs.map((cv) => (
            <Card key={cv.id} className="hover:border-primary/50 transition">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <FileIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cv.file_name}</CardTitle>
                        <CardDescription>
                          Uploaded {new Date(cv.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCV(cv)}
                    >
                      <DownloadIcon className="w-4 h-4" />
                    </Button>
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

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Experience</p>
                    <p className="text-2xl font-bold">
                      {cv.experience?.years || 0} <span className="text-sm font-normal text-muted-foreground">years</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Skills</p>
                    <p className="text-2xl font-bold">
                      {cv.skills?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Education</p>
                    <p className="text-2xl font-bold">
                      {cv.education ? '✓' : '—'}
                    </p>
                  </div>
                </div>

                {cv.skills && cv.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BriefcaseIcon className="w-4 h-4" />
                      Top Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cv.skills.slice(0, 8).map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {cv.skills.length > 8 && (
                        <Badge variant="outline">+{cv.skills.length - 8}</Badge>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  className="w-full mt-2"
                  onClick={() => router.push('/dashboard/jobs')}
                >
                  View Matched Jobs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
