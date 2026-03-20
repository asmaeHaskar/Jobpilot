# JobPilot - Setup Guide

## Project Overview

JobPilot is an AI-powered job application automation platform that helps users:
- Upload and analyze their CVs to extract skills and experience
- Automatically match with relevant job opportunities
- Track job applications and generate personalized application messages using AI

## Technology Stack

- **Frontend**: Next.js 16 + React 19 with shadcn/ui components
- **Backend**: Next.js API routes with Server Actions
- **Database**: Supabase (PostgreSQL)
- **AI**: Vercel AI Gateway (OpenAI GPT-4 Mini for cost-effectiveness)
- **Job Sources**: RemoteOK, GitHub Jobs, JustRemote (all free APIs, no authentication)
- **Authentication**: Supabase Auth

## Free Services Used

All services in this project are completely free:

1. **Supabase Database** - Included with Vercel integration
2. **AI Gateway (OpenAI GPT-4 Mini)** - Free tier via Vercel
3. **Job APIs** - All three job sources (RemoteOK, GitHub Jobs, JustRemote) are free and don't require authentication
4. **File Storage** - Supabase Storage (free tier included)

## Setup Instructions

### Step 1: Supabase Configuration

The Supabase integration is already connected. You need to initialize the database schema:

1. Go to your Supabase dashboard (https://supabase.com)
2. Navigate to the SQL editor
3. Run the SQL from `/scripts/init-database.sql` to create tables:
   - `profiles` - User profile information
   - `cvs` - Uploaded CV files and extracted data
   - `jobs` - Job listings from aggregated sources
   - `applications` - User job applications
   - `job_matches` - CV-to-job matching results

### Step 2: Create Storage Bucket

In Supabase dashboard:
1. Go to Storage
2. Create a new bucket named `cvs`
3. Set it to Public (or configure RLS as needed)

### Step 3: Environment Variables

All required environment variables should already be set through the Vercel integration:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

### Step 4: Run the Application

```bash
npm run dev
# or
pnpm dev
```

The app will start at `http://localhost:3000`

## Key Features & User Flow

### 1. Authentication (Already implemented)
- Users sign up/login via Supabase Auth
- Redirects to dashboard after authentication

### 2. CV Upload
- **Route**: `/dashboard/cvs/upload`
- Supports PDF, DOCX, DOC, TXT files
- AI extracts:
  - Technical and soft skills
  - Years of experience
  - Job titles
  - Education
  - Certifications

### 3. Job Matching
- Fetches jobs from 3 free sources simultaneously
- Matches user's CV skills against job descriptions
- Calculates match scores (0-100%)
- Only shows jobs with 30%+ match

### 4. Job Applications
- AI generates personalized application messages
- Tracks application status (Applied, Interview, Accepted, Rejected)
- Shows matched skills for each job

### 5. Application Tracking
- View all applications with statistics
- Filter by status
- Update application status
- Delete applications

## API Endpoints

### CV Upload
- **POST** `/api/cvs/upload`
- Accepts: FormData with `file` and `userId`
- Returns: Parsed CV with extracted skills

### Job Fetching
- **GET/POST** `/api/jobs/fetch`
- Fetches from RemoteOK, GitHub Jobs, JustRemote
- Saves to database and returns paginated results

### Job Matching
- **POST** `/api/jobs/match`
- Matches user's CV against all jobs
- Requires: `userId` and `cvId`
- Returns: Array of matches with scores

- **GET** `/api/jobs/match`
- Retrieves saved matches for a user
- Params: `userId`, optional `cvId`

### Applications
- **POST** `/api/applications`
- Creates new application with optional AI message
- **GET** `/api/applications`
- Retrieves user's applications, optional status filter
- **PATCH** `/api/applications`
- Updates application status
- **DELETE** `/api/applications?id=...`
- Deletes an application

## Skills Matching Algorithm

The matching algorithm:
1. Extracts keywords from job titles and descriptions
2. Compares against user's extracted skills
3. Calculates similarity score based on:
   - Direct keyword matches
   - Partial matches (e.g., "JavaScript" matching "JS")
   - Weighted by match type
4. Returns match score (0-100%) and matched skills list

## AI Features

### CV Parsing
Uses OpenAI GPT-4 Mini to extract structured information from CV text with fallback to keyword extraction if API fails.

### Application Message Generation
Generates 2-3 sentence personalized messages that:
- Reference specific job requirements
- Highlight relevant CV experience
- Show interest in the role
- Maintain professional tone

## Database Schema

### profiles
```sql
id UUID (PRIMARY KEY)
email TEXT (UNIQUE)
full_name TEXT
avatar_url TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### cvs
```sql
id UUID (PRIMARY KEY)
user_id UUID (FOREIGN KEY)
file_name TEXT
file_url TEXT
skills JSONB (array of skills)
experience JSONB (years, titles)
education JSONB (degree, institution)
raw_text TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### jobs
```sql
id UUID (PRIMARY KEY)
title TEXT
company TEXT
description TEXT
location TEXT
job_type TEXT
url TEXT (UNIQUE)
source TEXT (remoteok, github-jobs, justremote)
posted_at TIMESTAMP
created_at TIMESTAMP
```

### applications
```sql
id UUID (PRIMARY KEY)
user_id UUID (FOREIGN KEY)
job_id UUID (FOREIGN KEY)
cv_id UUID (FOREIGN KEY, nullable)
status TEXT (applied, interview, accepted, rejected)
message TEXT (generated application message)
applied_at TIMESTAMP
updated_at TIMESTAMP
```

### job_matches
```sql
id UUID (PRIMARY KEY)
user_id UUID (FOREIGN KEY)
job_id UUID (FOREIGN KEY)
cv_id UUID (FOREIGN KEY)
match_score FLOAT (0-100)
matched_skills JSONB (array of skills that matched)
created_at TIMESTAMP
```

## Deployment

To deploy to Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will automatically:
   - Detect environment variables from connected Supabase
   - Install dependencies
   - Build the project
4. Deploy when code is pushed

## File Structure

```
/app
  /api
    /applications - Application tracking endpoints
    /cvs/upload - CV upload endpoint
    /jobs
      /fetch - Job fetching endpoint
      /match - Job matching endpoint
    /setup - Initial setup endpoint
  /auth - Login/signup pages
  /dashboard - Main application
    /applications - Applications tracking
    /cvs - CV management
    /jobs - Job browsing and matching
    /settings - User settings
/components/ui - shadcn/ui components
/hooks - React hooks (useAuth, etc)
/lib/supabase - Supabase client configurations
/scripts - Database initialization scripts
```

## Troubleshooting

### "Missing Supabase environment variables"
- Verify Supabase integration is connected in Vercel settings
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set

### No jobs appearing
- Run `/api/jobs/fetch` to populate the database with jobs
- Check database for `jobs` table data
- Verify internet connection for API calls

### CV upload fails
- Check file size (max 10MB)
- Verify file format (PDF, DOCX, DOC, TXT)
- Ensure storage bucket `cvs` exists in Supabase

### Job matching returns no results
- Make sure CV skills were extracted properly
- Check that jobs have been fetched from job APIs
- Try uploading a different CV with more specific skills

## Next Steps

1. Test the application locally
2. Upload a sample CV
3. Verify job fetching works
4. Test the complete flow: Upload CV → View Matches → Apply to Job
5. Deploy to Vercel

## Support

For issues or questions:
- Check Supabase logs in dashboard
- Review browser console for client-side errors
- Check Vercel deployment logs for server-side errors
