'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon, UploadIcon, CheckIcon, AlertIcon, LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

export default function CVUploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedCV, setUploadedCV] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }

  const uploadFile = async (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt']
    
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!hasValidType && !hasValidExtension) {
      toast.error('Please upload a PDF, Word document, or text file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user?.id || '')

      const response = await fetch('/api/cvs/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to upload CV')
        return
      }

      setUploadedCV(data.cv)
      toast.success('CV uploaded and analyzed successfully!')

      // Trigger job matching after CV upload
      if (data.cv?.id && user?.id) {
        await fetch('/api/jobs/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, cvId: data.cv.id }),
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload CV')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Button>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Upload Your CV</h1>
          <p className="text-muted-foreground">
            Upload your resume to extract skills and get matched with relevant jobs
          </p>
        </div>
      </div>

      {!uploadedCV ? (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your CV</CardTitle>
            <CardDescription>
              Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center space-y-4 transition ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex justify-center">
                <div className="rounded-lg bg-muted p-4">
                  <UploadIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Drag and drop your CV here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Select File'
                )}
              </Button>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What we extract from your CV:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Technical and soft skills</li>
                <li>Years of experience</li>
                <li>Job titles and companies</li>
                <li>Education and certifications</li>
              </ul>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">What happens next:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your CV data is securely stored</li>
                <li>AI analyzes your skills and experience</li>
                <li>You get matched with relevant job opportunities</li>
                <li>Generate personalized application messages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  CV Uploaded Successfully
                </CardTitle>
                <CardDescription>
                  {uploadedCV.file_name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Skills Extracted</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedCV.skills && uploadedCV.skills.slice(0, 5).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {uploadedCV.skills && uploadedCV.skills.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      +{uploadedCV.skills.length - 5} more
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Experience</p>
                <p className="text-2xl font-bold">
                  {uploadedCV.experience?.years || 0} years
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setUploadedCV(null)}
                variant="outline"
              >
                Upload Another CV
              </Button>
              <Button
                onClick={() => router.push('/dashboard/jobs')}
              >
                View Matched Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
