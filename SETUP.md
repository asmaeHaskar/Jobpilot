# JobPilot - Setup & Implementation Guide

## Project Overview

**JobPilot** is an AI-powered job application automation platform that helps users:
- Upload and analyze their CVs to extract skills
- Match their profiles with relevant job opportunities
- Generate personalized application messages using AI
- Track all job applications in one place

All services used are **completely FREE** with no paid dependencies.

## ✅ What's Been Implemented

### Database (Supabase)
- ✅ `profiles` table - User profile information
- ✅ `cvs` table - Uploaded CVs with extracted skills and experience
- ✅ `jobs` table - Job listings from RemoteOK and GitHub Jobs APIs
- ✅ `applications` table - Application tracking with status (applied, interview, accepted, rejected)
- ✅ `job_matches` table - AI-powered job matching scores
- ✅ Row Level Security (RLS) policies for user data privacy

### Backend APIs (All Free)

**CV Management:**
- `POST /api/cvs/upload` - Upload CV and extract skills using AI
  - Uses OpenAI GPT-4 Mini via Vercel AI Gateway (free tier)
  - Extracts: skills, years of experience, education, certifications

**Job Sources:**
- `GET /api/jobs/fetch` - Fetch jobs from free public sources
  - RemoteOK API (no auth needed)
  - GitHub Jobs API (public)
  - Deduplicates and caches in Supabase
- `POST /api/admin/seed-jobs` - Populate jobs database

**Job Matching:**
- `POST /api/jobs/match` - Match user CV against available jobs
  - Calculates match scores based on:
    - Skill overlap
    - Experience level
    - Location preferences
    - Job type compatibility
  - Returns top 50 matches with scores

**Application Tracking:**
- `POST /api/applications` - Create new application
- `GET /api/applications` - Retrieve user's applications
- `PUT /api/applications` - Update application status
- `DELETE /api/applications` - Delete application
- Integrates AI message generation for personalized cover letters

### Frontend Pages

**Authentication:**
- `/auth/login` - User login
- `/auth/signup` - New user registration

**Dashboard:**
- `/dashboard` - Main dashboard with quick stats and actions
- `/dashboard/setup` - Onboarding with job seeding trigger
- `/dashboard/cvs/upload` - Upload and analyze CVs
- `/dashboard/jobs` - Browse matched job opportunities
- `/dashboard/applications` - Track all applications
- `/dashboard/settings` - User preferences and account management

### Features Included

1. **CV Parsing with AI**
   - Extracts technical and soft skills
   - Calculates years of experience
   - Identifies job titles and companies
   - Uses GPT-4 Mini for intelligent parsing

2. **Intelligent Job Matching**
   - Skill-based matching algorithm
   - Experience level consideration
   - Location preference matching
   - Deduplication of job listings

3. **AI-Generated Cover Letters**
   - Personalized application messages
   - Generated using OpenAI GPT-4 Mini
   - Tailored to specific jobs and companies

4. **Application Tracking**
   - Status management (applied, interview, accepted, rejected)
   - Custom notes and messages
   - Statistics dashboard
   - Filter and search capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (installed via Vercel Sandbox)
- Supabase account (connected to v0)
- AI Gateway access (included with Vercel)

### 1. Initial Setup

The project is already configured with:
- Supabase client (lib/supabase/client.ts)
- Supabase server client (lib/supabase/server.ts)
- Environment variables automatically set

### 2. Seed Job Data

First-time setup requires loading jobs into the database:

**Option A: Via Dashboard UI**
1. Sign up at `/auth/signup`
2. Go to `/dashboard/setup`
3. Click "Load Jobs" button
4. Wait for ~50 jobs to be loaded from free sources

**Option B: Via API**
```bash
curl -X POST http://localhost:3000/api/admin/seed-jobs \
  -H "Authorization: Bearer dev-key" \
  -H "Content-Type: application/json"
```

### 3. Upload CV

1. Navigate to Dashboard
2. Click "Upload Your CV"
3. Upload a PDF, DOCX, or TXT file
4. CV is analyzed and skills are extracted

### 4. Browse Jobs

1. Go to "Job Opportunities"
2. View jobs matched to your profile
3. See match percentage and matched skills
4. Click "Apply Now" or "View Details"

### 5. Track Applications

1. Visit "My Applications"
2. See all applications with status
3. Update application status as you get responses
4. View personalized messages for each application

## 📊 Free Services Used

### APIs (No Auth Required)
- **RemoteOK** - Remote job listings
- **GitHub Jobs** - Software development jobs
- **Vercel AI Gateway** - AI model access (OpenAI, Anthropic, Google)

### Database
- **Supabase PostgreSQL** - Free tier includes:
  - 500MB database
  - 2GB file storage
  - Up to 50,000 monthly active users
  - Row Level Security

### AI Models (Free via Vercel AI Gateway)
- **GPT-4 Mini** - CV parsing and cover letter generation
- **Can also use:** Claude 3.5 Haiku, Gemini Flash (free alternatives)

## 🔐 Security Features

### Row Level Security (RLS)
```sql
-- Each user can only see their own data
CREATE POLICY "Users can only see their own records"
  ON profiles FOR SELECT
  USING (auth.uid() = id);
```

### Authentication
- Supabase Auth with email/password
- Session management via cookies
- Protected API routes with user verification

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 + React 19 + TypeScript
- **UI Components:** shadcn/ui with Tailwind CSS
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **AI:** Vercel AI SDK v6 + AI Gateway
- **HTTP Client:** Fetch API + SWR
- **Styling:** Tailwind CSS v4

## 📝 Database Schema

### profiles
```sql
- id (uuid, PK, FK to auth.users)
- email (text)
- full_name (text)
- location (text)
- bio (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### cvs
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- file_name (text)
- file_url (text)
- raw_text (text)
- skills (text[])
- years_of_experience (integer)
- education (jsonb)
- created_at (timestamp)
```

### jobs
```sql
- id (uuid, PK)
- title (text)
- company (text)
- description (text)
- location (text)
- job_type (text)
- url (text, UNIQUE)
- source (text) - 'remoteok', 'github-jobs', etc.
- posted_at (timestamp)
- created_at (timestamp)
```

### applications
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- job_id (uuid, FK)
- cv_id (uuid, FK)
- status (text) - 'applied', 'interview', 'accepted', 'rejected'
- message (text) - Generated cover letter
- applied_at (timestamp)
- updated_at (timestamp)
```

### job_matches
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- job_id (uuid, FK)
- cv_id (uuid, FK)
- match_score (integer, 0-100)
- matched_skills (text[])
- created_at (timestamp)
```

## 🔄 Data Flow

1. **User Signup** → Profile created
2. **CV Upload** → Extract skills/experience
3. **Load Jobs** → Fetch from RemoteOK + GitHub Jobs
4. **Match Jobs** → Calculate scores, save matches
5. **Apply to Job** → Create application, generate message with AI
6. **Track Status** → Update application status

## 🚦 Next Steps / Future Enhancements

1. **Webhook Integration**
   - Vercel Cron to auto-seed jobs daily
   - Scheduled job matching updates

2. **Advanced Matching**
   - Salary range preferences
   - Remote/hybrid preference
   - Tech stack preferences
   - Company size preferences

3. **AI Enhancements**
   - Resume optimization suggestions
   - Interview preparation tips
   - Cover letter quality scoring

4. **Analytics**
   - Application success rate tracking
   - Time-to-interview metrics
   - Job source performance analytics

5. **Integrations**
   - LinkedIn profile sync
   - Automatic application submission
   - Interview scheduling

## 🆘 Troubleshooting

### "Missing Supabase environment variables"
- Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
- These should be automatically configured by v0

### "No jobs found"
- Click "Load Jobs" on the setup page to seed the database
- Jobs come from RemoteOK and GitHub Jobs APIs

### "Failed to upload CV"
- Ensure file is PDF, DOCX, or TXT
- Max file size is 10MB
- Check browser console for detailed error

### "Authentication errors"
- Clear browser cookies
- Log out and log back in
- Check Supabase Auth configuration in v0 settings

## 📞 Support

For issues or questions:
1. Check the v0 settings (gear icon)
2. Verify Supabase integration is connected
3. Check environment variables are set correctly
4. Review browser console for error messages

## 📄 License

This project is built with v0.app and uses open-source libraries.

---

**JobPilot** - Automate your job search with AI! 🚀
