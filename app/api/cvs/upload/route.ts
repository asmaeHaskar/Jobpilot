import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateText, Output } from 'ai';

// Extract text from file
async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const text = Buffer.from(buffer).toString('utf-8');
  
  // Simple text extraction - in production you'd use pdf-parse or similar
  // For now, we'll just extract readable text
  return text.replace(/[^\x20-\x7E\n]/g, ' ').trim();
}

// Parse CV with AI to extract structured information
async function parseCVWithAI(cvText: string) {
  try {
    const result = await generateText({
      model: 'openai/gpt-4-mini', // Using AI Gateway (free tier included)
      system: `You are an expert CV parser. Extract and return structured information from the CV text provided.
Focus on:
1. Skills (technical and soft skills)
2. Years of experience
3. Job titles and companies
4. Education
5. Certifications

Return the data in a structured format with clear sections.`,
      prompt: `Parse this CV and extract key information:\n\n${cvText}`,
      maxTokens: 1000,
    });

    // Parse the response to extract skills and experience
    const text = result.text;
    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);

    return { skills, experience, education, rawText: text };
  } catch (error) {
    console.error('Error parsing CV with AI:', error);
    // Fallback: simple keyword extraction
    return {
      skills: extractSkillsFromText(cvText),
      experience: extractYearsOfExperience(cvText),
      education: null,
      rawText: cvText,
    };
  }
}

// Simple skill extraction from text
function extractSkillsFromText(text: string): string[] {
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'nodejs', 'python', 'java', 'c++', 'c#', 'go', 'rust',
    'sql', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
    'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'html', 'css', 'nextjs', 'angular',
    'vue', 'express', 'flask', 'django', 'spring', 'salesforce', 'figma', 'adobe', 'photoshop',
    'machine learning', 'ai', 'data science', 'analytics', 'communication', 'leadership',
    'project management', 'problem solving', 'collaboration', 'testing', 'qa'
  ];

  const lowerText = text.toLowerCase();
  const foundSkills = new Set<string>();

  skillKeywords.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    if (regex.test(lowerText)) {
      foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  return Array.from(foundSkills);
}

function extractYearsOfExperience(text: string): number {
  const matches = text.match(/(\d+)\s*(?:years?|yrs?)\s+(?:of\s+)?(?:experience|exp)/gi);
  if (matches && matches.length > 0) {
    const years = matches[0].match(/\d+/);
    return years ? parseInt(years[0]) : 0;
  }
  return 0;
}

function extractSkills(text: string): string[] {
  const skillsMatch = text.match(/skills?:?\s*([^\n]+)/gi);
  if (skillsMatch) {
    return skillsMatch[0]
      .replace(/skills?:?\s*/i, '')
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  return extractSkillsFromText(text);
}

function extractExperience(text: string): { years: number; titles: string[] } {
  const yearsMatch = text.match(/(\d+)\s*(?:years?|yrs?)/i);
  const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;

  const titlePatterns = [
    /(?:current\s+)?(?:job\s+)?title:?\s*([^\n]+)/gi,
    /(?:position|role):?\s*([^\n]+)/gi,
  ];

  const titles: Set<string> = new Set();
  titlePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) {
        titles.add(match[1].trim());
      }
    }
  });

  return { years, titles: Array.from(titles) };
}

function extractEducation(text: string): { degree?: string; institution?: string } | null {
  const degreeMatch = text.match(/(?:degree|B\.?S\.?|B\.?A\.?|M\.?S\.?|M\.?A\.?|Ph\.?D\.?)[^\n]*/i);
  const schoolMatch = text.match(/(?:university|college|school|institute)[^\n]*/i);

  if (degreeMatch || schoolMatch) {
    return {
      degree: degreeMatch ? degreeMatch[0].trim() : undefined,
      institution: schoolMatch ? schoolMatch[0].trim() : undefined,
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    const userId = data.get('userId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Extract text from file
    const cvText = await extractTextFromFile(file);

    if (!cvText || cvText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from file' },
        { status: 400 }
      );
    }

    // Parse CV with AI
    const parsedData = await parseCVWithAI(cvText);

    // Get Supabase client
    const supabase = await createServerClient();

    // Upload file to Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(fileName, file, { upsert: false });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('cvs')
      .getPublicUrl(fileName);

    // Save CV metadata to database
    const { data: cvData, error: dbError } = await supabase
      .from('cvs')
      .insert([{
        user_id: userId,
        file_name: file.name,
        file_url: urlData.publicUrl,
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        raw_text: cvText,
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save CV metadata' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cv: cvData,
      parsed: parsedData,
    });
  } catch (error) {
    console.error('CV upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
