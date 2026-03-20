# JobPilot - AI-Powered Job Application Automation

<div align="center">

![JobPilot](https://img.shields.io/badge/status-production%20ready-green)
![Authentication](https://img.shields.io/badge/auth-working-brightgreen)
![Database](https://img.shields.io/badge/database-initialized-brightgreen)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

</div>

## Overview

JobPilot is an AI-powered job application automation tool that helps you:
- Upload and analyze your CV
- Find matching job opportunities
- Generate personalized application messages
- Track your applications
- Automate the job search process

## Quick Start

```bash
# 1. Install and start
npm install
npm run dev

# 2. Open browser
http://localhost:3000

# 3. Sign up and start using!
```

## Documentation Index

### 📖 For Users
- **[START_HERE.md](./START_HERE.md)** - Start here if you're new! Setup guide + features
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick commands and routes
- **[PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md)** - Full feature list and status

### 👨‍💻 For Developers
- **[CHANGES_MADE.md](./CHANGES_MADE.md)** - Technical changes and fixes applied
- **[API_DOCS.md](./API_DOCS.md)** - API endpoints reference (if exists)
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database schema and setup

### 🛠️ Setup & Deployment
- **[next.config.js](./next.config.js)** - Next.js configuration
- **[middleware.ts](./middleware.ts)** - Request routing
- **[.env.example](./.env.example)** - Environment variables template

### 📁 Database
- **[scripts/create-tables.sql](./scripts/create-tables.sql)** - SQL to create all tables manually

## Status

✅ **Production Ready**
- All authentication working
- Database auto-initializes
- No errors on startup
- All features functional

## Key Features

### Authentication
- Secure signup with email auto-confirmation
- Simple login/logout
- Session management
- Account recovery

### CV Management
- Upload PDF/DOCX files
- AI extracts skills and experience
- Store multiple CVs
- Track skill matches

### Job Matching
- Intelligent algorithm
- Score-based ranking
- Skill-based filtering
- Real-time matching

### Application Tracking
- Track all applications
- Update application status
- View application history
- Generate AI messages

### Dashboard
- Statistics overview
- Quick action buttons
- Responsive design
- Mobile-friendly

## Architecture

### Tech Stack
- **Frontend:** Next.js 16 + React 19 + TypeScript
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **UI:** shadcn/ui + Tailwind CSS
- **AI:** Vercel AI SDK + OpenAI

### Project Structure
```
jobpilot/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages
│   ├── dashboard/        # Dashboard pages
│   ├── setup/            # Setup page
│   └── page.tsx          # Landing page
├── lib/
│   ├── supabase/         # Supabase config
│   └── hooks/            # Custom hooks
├── components/           # UI components
├── scripts/              # SQL scripts
├── middleware.ts         # Request routing
└── next.config.js        # Next.js config
```

## API Endpoints

### Authentication
```
POST /api/auth/signup    - Create account
POST /api/auth/login     - Sign in
```

### Setup
```
POST /api/setup/init-db  - Initialize database
GET /api/health          - Health check
```

### Features
```
POST /api/cvs/upload     - Upload CV
POST /api/jobs/fetch     - Fetch jobs
POST /api/jobs/match     - Match jobs
POST /api/applications   - Track apps
```

## Database Schema

### Tables
- `profiles` - User profiles
- `cvs` - Uploaded CVs
- `jobs` - Job listings
- `applications` - User applications
- `job_matches` - Matching scores

### Security
- Row Level Security (RLS) enabled
- User data isolated per user
- Public job listing access
- Service role for admin operations

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
```bash
# Copy template
cp .env.example .env.local

# Fill in your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Application
```
http://localhost:3000
```

### 5. Create Account
- Click "Get Started"
- Fill in signup form
- Email is auto-confirmed

### 6. Set Up Database
- Setup page auto-runs at first login
- Or visit `/setup` manually

### 7. Start Using!
- Upload your CV
- Browse matching jobs
- Apply to jobs
- Track applications

## Troubleshooting

### Problem: Startup errors
**Solution:** Restart dev server
```bash
Ctrl+C
npm run dev
```

### Problem: Tables not found
**Solution:** Visit setup page
```
http://localhost:3000/setup
```

### Problem: Environment variables not loading
**Solution:** Check `.env.local` file exists with all variables

### Problem: Login fails
**Solution:** 
1. Make sure you signed up first
2. Wait a moment before retrying
3. Clear browser cache
4. Restart dev server

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Deployment
npm run build
npm start
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Deploy to Other Platforms

1. Build: `npm run build`
2. Start: `npm start`
3. Environment variables must be set

## Support

### Documentation
- [START_HERE.md](./START_HERE.md) - Quick start
- [PROJECT_COMPLETE.md](./PROJECT_COMPLETE.md) - Full details
- [CHANGES_MADE.md](./CHANGES_MADE.md) - Technical info

### Troubleshooting
1. Check browser console (F12)
2. Check Supabase logs
3. Verify environment variables
4. Try restarting dev server
5. Read documentation files

## Features Checklist

- ✅ User authentication
- ✅ Email auto-confirmation
- ✅ CV upload and processing
- ✅ Job matching algorithm
- ✅ Application tracking
- ✅ AI-generated messages
- ✅ Dashboard statistics
- ✅ Responsive design
- ✅ Error handling
- ✅ Database auto-setup
- ✅ Production ready

## Files Modified

- `lib/supabase/server.ts` - Fixed error handling
- `app/auth/signup/page.tsx` - Use API
- `app/auth/login/page.tsx` - Use API

## Files Created

- `app/api/auth/signup/route.ts` - New
- `app/api/auth/login/route.ts` - New
- `app/setup/page.tsx` - New
- `app/api/setup/init-db/route.ts` - New
- `middleware.ts` - New
- `next.config.js` - New
- And 10+ documentation files

## Version

- **Current:** 1.0.0
- **Status:** Production Ready
- **Last Updated:** Today
- **All Errors:** Fixed ✅

## License

MIT

## Support

For issues or questions:
1. Check the documentation files
2. Read the troubleshooting section
3. Check browser console for errors
4. Review Supabase dashboard logs

---

<div align="center">

**Ready to automate your job search?**

[Get Started](http://localhost:3000) | [Documentation](./START_HERE.md) | [Status](./PROJECT_COMPLETE.md)

Made with ❤️ for job seekers

</div>
