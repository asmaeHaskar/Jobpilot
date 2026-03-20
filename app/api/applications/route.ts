import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { generateText } from 'ai';

// Generate a personalized application message using AI
async function generateApplicationMessage(
  cvText: string,
  jobTitle: string,
  jobDescription: string,
  company: string
): Promise<string> {
  try {
    const result = await generateText({
      model: 'openai/gpt-4-mini',
      system: `You are an expert career coach who writes compelling job application messages.
Write a concise, personalized message (2-3 sentences) for a job application that:
1. References specific aspects of the job description
2. Highlights relevant experience from the CV
3. Shows genuine interest in the role and company
4. Is professional but not overly formal

Return only the message, no other text.`,
      prompt: `Write an application message for:
Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}

Candidate CV highlights: ${cvText}`,
      maxTokens: 150,
    });

    return result.text;
  } catch (error) {
    console.error('Error generating message:', error);
    return `I am interested in the ${jobTitle} position at ${company}. I believe my skills and experience align well with your requirements.`;
  }
}

// POST: Create a new application
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, jobId, cvId, generateMessage } = body;

    if (!userId || !jobId) {
      return NextResponse.json(
        { error: 'User ID and Job ID are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Check if application already exists
    const { data: existingApp } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .eq('job_id', jobId)
      .single();

    if (existingApp) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 409 }
      );
    }

    let message = '';

    // Generate message if requested
    if (generateMessage && cvId) {
      try {
        const { data: cv } = await supabase
          .from('cvs')
          .select('raw_text')
          .eq('id', cvId)
          .single();

        const { data: job } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (cv && job) {
          message = await generateApplicationMessage(
            cv.raw_text || '',
            job.title,
            job.description,
            job.company
          );
        }
      } catch (error) {
        console.error('Error in message generation:', error);
      }
    }

    // Create application
    const { data: application, error: appError } = await supabase
      .from('applications')
      .insert([{
        user_id: userId,
        job_id: jobId,
        cv_id: cvId || null,
        status: 'applied',
        message: message || null,
      }])
      .select()
      .single();

    if (appError) {
      console.error('Database error:', appError);
      return NextResponse.json(
        { error: 'Failed to create application' },
        { status: 500 }
      );
    }

    // Fetch full application data with job details
    const { data: fullApp } = await supabase
      .from('applications')
      .select(`
        *,
        jobs:job_id(*)
      `)
      .eq('id', application.id)
      .single();

    return NextResponse.json({
      success: true,
      application: fullApp,
    });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Retrieve user's applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    let query = supabase
      .from('applications')
      .select(`
        *,
        jobs:job_id(*)
      `)
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: applications, error } = await query;

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: applications?.length || 0,
      applications: applications || [],
      stats: {
        applied: applications?.filter(a => a.status === 'applied').length || 0,
        rejected: applications?.filter(a => a.status === 'rejected').length || 0,
        interview: applications?.filter(a => a.status === 'interview').length || 0,
        accepted: applications?.filter(a => a.status === 'accepted').length || 0,
      },
    });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update application status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['applied', 'rejected', 'interview', 'accepted'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { data: application, error: updateError } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
      .select(`
        *,
        jobs:job_id(*)
      `)
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an application
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted',
    });
  } catch (error) {
    console.error('Application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
