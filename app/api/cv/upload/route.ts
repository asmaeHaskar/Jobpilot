import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file as text (for PDF/DOCX we'll extract text in preprocessing)
    const buffer = await file.arrayBuffer()
    const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer)

    // Extract basic info from CV text
    const skills = extractSkills(text)
    const experience = extractExperience(text)

    // Store CV in database
    const { data: cvData, error: cvError } = await supabase
      .from('cvs')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        raw_text: text.substring(0, 10000), // Store first 10k chars
        skills: skills,
        years_of_experience: experience,
      })
      .select()
      .single()

    if (cvError) {
      console.error('CV insert error:', cvError)
      return NextResponse.json(
        { error: 'Failed to save CV' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        cv: cvData,
        message: 'CV uploaded successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('CV upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to extract skills from text
function extractSkills(text: string): string[] {
  const skillKeywords = [
    'javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#',
    'react', 'vue', 'angular', 'node.js', 'express',
    'mongodb', 'postgresql', 'mysql', 'redis', 'firebase',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes',
    'git', 'agile', 'scrum', 'rest api', 'graphql',
    'html', 'css', 'tailwind', 'bootstrap',
    'sql', 'nosql', 'orm', 'testing', 'ci/cd',
  ]

  const lowerText = text.toLowerCase()
  const foundSkills = skillKeywords.filter(skill => 
    new RegExp(`\\b${skill}\\b`).test(lowerText)
  )

  return [...new Set(foundSkills)]
}

// Helper function to extract years of experience
function extractExperience(text: string): number {
  const patterns = [
    /(\d+)\s+years?\s+of\s+experience/gi,
    /experience:\s*(\d+)\s+years?/gi,
    /exp:\s*(\d+)\s+(?:yrs?|years?)/gi,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return parseInt(match[1])
    }
  }

  return 0
}
