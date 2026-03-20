# JobPilot - Quick Start Guide

## Prerequisites

- Supabase connection already configured (done!)
- Vercel AI Gateway access (free)

## Get Started in 3 Steps

### Step 1: Initialize Database

Open your Supabase dashboard and run this SQL in the SQL Editor:

```sql
-- Copy all SQL from /scripts/init-database.sql and run it here
```

**Or** use the setup endpoint by visiting: `http://localhost:3000/api/setup` (after starting the dev server)

### Step 2: Create Storage Bucket

In Supabase Dashboard → Storage:
1. Click "Create bucket"
2. Name it: `cvs`
3. Set to Public (or configure RLS)
4. Click "Create"

### Step 3: Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## First Time User Flow

1. **Sign Up**
   - Go to `/auth/signup`
   - Create account with email & password
   
2. **Upload CV**
   - Click "My CVs" or "Upload Your CV"
   - Drag & drop or select a PDF/Word/Text file
   - Wait for AI to extract data
   
3. **View Matched Jobs**
   - Jobs are automatically fetched and matched
   - See match score for each job
   - Click "Apply Now" to submit
   
4. **Track Applications**
   - Visit "My Applications"
   - See stats and filter by status
   - Update status as you progress

## Testing with Sample Data

### Test CV Content
Create a simple text file or PDF with:
```
John Smith
Skills: Python, JavaScript, React, Node.js, SQL, AWS, Docker
Experience: 5 years as Software Engineer at Tech Company
Education: BS Computer Science, University of Tech
```

### Test the Flow
1. Upload the sample CV
2. Check "My CVs" to see extracted skills
3. Go to "Available Jobs" to see matches
4. Apply to a matched job
5. Check "My Applications" to track it

## API Endpoints You Can Test

### Fetch Jobs
```bash
curl http://localhost:3000/api/jobs/fetch
```

### Upload CV
```bash
# Requires authentication in production
curl -X POST http://localhost:3000/api/cvs/upload \
  -F "file=@resume.pdf" \
  -F "userId=YOUR_USER_ID"
```

### Get Applications
```bash
curl "http://localhost:3000/api/applications?userId=YOUR_USER_ID"
```

## Troubleshooting

### "Cannot find module" errors
- Delete `node_modules` and `.next` folders
- Run `npm install` then `npm run dev`

### Supabase connection fails
- Check environment variables in Settings → Vars
- Verify `NEXT_PUBLIC_SUPABASE_URL` and key are set
- Refresh the browser

### No jobs appear
- Run `/api/jobs/fetch` to populate database
- Wait a few seconds for jobs to load
- Check Network tab in browser DevTools

### CV upload fails
- Check file size (must be < 10MB)
- Verify file format (PDF, DOCX, DOC, TXT)
- Ensure `cvs` bucket exists in Supabase Storage

### Match score is too low
- Try uploading a CV with more specific technical skills
- Job sources may not have many matches
- Check that CV skills were properly extracted

## Database Structure

```
profiles
├── Users who sign up

cvs
├── User CV files
├── Extracted skills
├── Years of experience
└── Education

jobs
├── Listings from RemoteOK, GitHub, JustRemote
└── Updated when /api/jobs/fetch is called

applications
├── User's job applications
├── Application messages
└── Status tracking

job_matches
├── CV + Job combinations
├── Match scores
└── Matched skills
```

## Free Services Being Used

1. **Supabase** - Database & Auth (free tier)
2. **Vercel AI Gateway** - GPT-4 Mini for CV parsing and message generation (free)
3. **RemoteOK** - Free job API, no auth needed
4. **GitHub Jobs** - Free job API, no auth needed
5. **JustRemote** - Free job API, no auth needed

**Total cost: $0**

## Key Features

✓ CV Upload & AI Analysis
✓ Smart Job Matching (local algorithm, no API cost)
✓ Job Aggregation from 3 sources
✓ Auto-generated personalized messages
✓ Application tracking
✓ Status management

## Next Steps

1. Test the full flow locally
2. Create a few test accounts
3. Upload different CVs and test matching
4. Deploy to Vercel when ready
5. Share with friends!

## Common Questions

**Q: Does this cost anything?**
A: No! Everything uses free services.

**Q: Can users' CVs be seen by others?**
A: No. Row-Level Security (RLS) policies ensure users only see their own data.

**Q: How many jobs are available?**
A: RemoteOK + GitHub Jobs + JustRemote combined have hundreds of listings, fetched fresh each time.

**Q: Is the AI trained on user data?**
A: No. We use OpenAI's API through Vercel, which doesn't train on your data.

**Q: Can I add more job sources?**
A: Yes! Just add more API calls to `/api/jobs/fetch/route.ts`

## Support

- Check `SETUP_GUIDE.md` for detailed setup
- Check `COMPLETION_SUMMARY.md` for what's implemented
- Review logs in browser DevTools Console
- Check Vercel deployment logs for server errors

## Want to Extend?

Easy additions:
- Different CV formats (DOCX, Google Docs)
- Email notifications on new matches
- LinkedIn integration
- Salary filtering
- Auto-apply feature
- Interview scheduling

Feel free to customize and deploy!
