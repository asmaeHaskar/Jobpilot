# JobPilot - Complete Setup Guide

## Quick Start (3 Steps)

### Step 1: Initialize Database (1 minute)
Go to: `http://localhost:3000/setup`
- The page will auto-initialize your database
- Or manually run the SQL from `scripts/create-tables.sql` in Supabase Dashboard

### Step 2: Sign Up
Go to: `http://localhost:3000/auth/signup`
- Fill in your email, password, and name
- Click "Sign Up"
- Account is created and auto-confirmed (no email verification needed)

### Step 3: Use the App
Go to: `http://localhost:3000/dashboard`
- Upload your CV
- Browse jobs
- Apply to jobs with AI-generated messages
- Track applications

---

## Features Included

✅ User Authentication (Signup/Login)
✅ CV Upload & AI Processing
✅ Job Matching Algorithm
✅ Application Tracking
✅ AI-Generated Application Messages
✅ Dashboard with Statistics
✅ Responsive UI Design

---

## Architecture

### APIs Created
- `POST /api/auth/signup` - User registration with email auto-confirm
- `POST /api/auth/login` - User login
- `POST /api/setup/init-db` - Database initialization
- `POST /api/cvs/upload` - CV upload and processing
- `POST /api/jobs/fetch` - Fetch jobs from free sources
- `POST /api/jobs/match` - Match jobs to user CV
- `POST /api/applications` - Track applications

### Database Tables
- `profiles` - User profiles
- `cvs` - Uploaded CVs with extracted skills
- `jobs` - Job listings
- `applications` - User applications
- `job_matches` - Job matching scores

### Pages
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/setup` - Database setup page
- `/dashboard` - Main dashboard
- `/dashboard/jobs` - Job browser
- `/dashboard/cvs` - CV management
- `/dashboard/applications` - Application tracking

---

## Troubleshooting

### 1. "Missing Supabase environment variables"
- Your Supabase credentials are not loaded
- Check that you have set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server: `Ctrl+C` then `npm run dev`

### 2. "Could not find the table 'public.profiles'"
- Run the setup page: `http://localhost:3000/setup`
- Or manually execute SQL from `scripts/create-tables.sql` in Supabase

### 3. "Email not confirmed"
- All emails are auto-confirmed during signup
- If you still get this error, recreate your account

### 4. Database initialization fails
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Create a new query
4. Copy-paste the SQL from `scripts/create-tables.sql`
5. Click "Run"

---

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these from your Supabase Project Settings.

---

## All Fixes Applied

✅ Signup now uses server-side API with email auto-confirm
✅ Login redirects through secure API
✅ Database auto-initializes on first visit to `/setup`
✅ No more "Missing environment variables" crashes
✅ All pages properly handle missing tables
✅ Responsive design for all devices
✅ Error handling for all edge cases

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Check browser console for error messages (F12)
3. Check Supabase logs in Supabase Dashboard
4. Verify all environment variables are set correctly
5. Try restarting the dev server

---

**Happy job hunting with JobPilot!** 🚀
