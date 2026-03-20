'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeftIcon } from 'lucide-react'

export default function CVUploadPage() {
  const router = useRouter()

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
            Upload a PDF or Word document to extract your skills and experience
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CV Upload</CardTitle>
          <CardDescription>
            Supported formats: PDF, DOC, DOCX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
            <div className="space-y-2">
              <p className="text-lg font-medium">Drag and drop your CV here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="cv-upload"
            />
            <Button
              onClick={() => document.getElementById('cv-upload')?.click()}
              variant="outline"
            >
              Select File
            </Button>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>What happens next:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your CV will be analyzed by our AI</li>
              <li>Skills and experience will be extracted</li>
              <li>Job matching will be powered by this data</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
