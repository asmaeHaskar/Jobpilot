import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// Calculate similarity between two arrays of skills
function calculateSimilarity(userSkills: string[], jobKeywords: string[]): {
  score: number;
  matchedSkills: string[];
} {
  const userSkillsLower = userSkills.map(s => s.toLowerCase());
  const jobKeywordsLower = jobKeywords.map(k => k.toLowerCase());

  const matchedSkills: Set<string> = new Set();
  let matches = 0;

  // Direct matches
  userSkillsLower.forEach((skill, index) => {
    if (jobKeywordsLower.some(keyword => 
      keyword.includes(skill) || skill.includes(keyword)
    )) {
      matches++;
      matchedSkills.add(userSkills[index]);
    }
  });

  // Partial matches
  userSkillsLower.forEach((skill, index) => {
    jobKeywordsLower.forEach(keyword => {
      const skillWords = skill.split(/[\s-]+/);
      const keywordWords = keyword.split(/[\s-]+/);
      
      if (skillWords.some(sw => keywordWords.some(kw => 
        sw.length > 3 && kw.length > 3 && 
        (sw === kw || Math.abs(sw.length - kw.length) <= 2)
      ))) {
        if (!matchedSkills.has(userSkills[index])) {
          matches += 0.5;
          matchedSkills.add(userSkills[index]);
        }
      }
    });
  });

  const maxMatches = Math.max(userSkillsLower.length, jobKeywordsLower.length);
  const score = Math.min(100, (matches / maxMatches) * 100);

  return {
    score: Math.round(score),
    matchedSkills: Array.from(matchedSkills),
  };
}

// Extract keywords from job description
function extractJobKeywords(description: string, title: string): string[] {
  const keywords: Set<string> = new Set();

  // Technical skill keywords
  const techSkills = [
    'javascript', 'typescript', 'react', 'nodejs', 'python', 'java', 'c++', 'c#', 'go', 'rust',
    'sql', 'mongodb', 'postgresql', 'mysql', 'elasticsearch', 'redis',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'heroku', 'vercel',
    'git', 'github', 'gitlab', 'bitbucket',
    'api', 'rest', 'graphql', 'grpc',
    'html', 'css', 'scss', 'tailwind',
    'nextjs', 'angular', 'vue', 'svelte',
    'express', 'flask', 'django', 'fastapi', 'spring', 'rails',
    'agile', 'scrum', 'kanban', 'ci/cd', 'devops',
    'testing', 'jest', 'mocha', 'pytest', 'rspec',
    'firebase', 'supabase', 'clerk', 'auth0',
  ];

  const combinedText = `${title} ${description}`.toLowerCase();

  techSkills.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'g');
    if (regex.test(combinedText)) {
      keywords.add(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  });

  // Extract job title patterns
  const titleMatch = combinedText.match(/(?:seeking|looking for|need|require[ds]?)\s+(?:a\s+)?([^,.;]+)/i);
  if (titleMatch) {
    keywords.add(titleMatch[1].trim());
  }

  return Array.from(keywords);
}

// Match jobs for a user's CV
async function matchJobsForUser(userId: string, cvId: string) {
  const supabase = await createServerClient();

  // Get user's CV with skills
  const { data: cv, error: cvError } = await supabase
    .from('cvs')
    .select('*')
    .eq('id', cvId)
    .eq('user_id', userId)
    .single();

  if (cvError || !cv) {
    throw new Error('CV not found');
  }

  const userSkills = cv.skills || [];

  // Get all jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*');

  if (jobsError || !jobs) {
    throw new Error('Failed to fetch jobs');
  }

  // Match each job
  const matches: any[] = [];
  const seenJobIds = new Set<string>();

  for (const job of jobs) {
    if (seenJobIds.has(job.id)) continue;
    seenJobIds.add(job.id);

    const jobKeywords = extractJobKeywords(job.description, job.title);
    const { score, matchedSkills } = calculateSimilarity(userSkills, jobKeywords);

    // Only save matches with score >= 30
    if (score >= 30) {
      matches.push({
        user_id: userId,
        job_id: job.id,
        cv_id: cvId,
        match_score: score,
        matched_skills: matchedSkills,
      });
    }
  }

  // Save matches to database (upsert to avoid duplicates)
  if (matches.length > 0) {
    const { error: insertError } = await supabase
      .from('job_matches')
      .upsert(matches, {
        onConflict: 'user_id,job_id,cv_id',
      });

    if (insertError) {
      console.error('Insert error:', insertError);
    }
  }

  return matches;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, cvId } = await request.json();

    if (!userId || !cvId) {
      return NextResponse.json(
        { error: 'User ID and CV ID are required' },
        { status: 400 }
      );
    }

    // Match jobs for the CV
    const matches = await matchJobsForUser(userId, cvId);

    // Fetch detailed match data
    const supabase = await createServerClient();
    const { data: detailedMatches, error } = await supabase
      .from('job_matches')
      .select(`
        *,
        jobs:job_id(*)
      `)
      .eq('user_id', userId)
      .eq('cv_id', cvId)
      .order('match_score', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch matches' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      matchCount: matches.length,
      matches: detailedMatches || [],
    });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve existing matches for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cvId = searchParams.get('cvId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    let query = supabase
      .from('job_matches')
      .select(`
        *,
        jobs:job_id(*)
      `)
      .eq('user_id', userId)
      .order('match_score', { ascending: false });

    if (cvId) {
      query = query.eq('cv_id', cvId);
    }

    const { data: matches, error } = await query;

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch matches' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      matchCount: matches?.length || 0,
      matches: matches || [],
    });
  } catch (error) {
    console.error('Matching error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
