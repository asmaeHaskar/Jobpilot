# Getting Started with JobPilot

## 🚀 Quick Start (5 minutes)

### 1. Sign Up
- Go to `/auth/signup`
- Enter your email, password, and full name
- Click "Sign Up"

### 2. Initialize Database (Automatic)
- You'll be directed to a setup page
- Click "Retry" to initialize the database automatically
- If it fails, follow the manual instructions below

### 3. Upload Your CV
- Click "Upload Your CV"
- Drag and drop your resume (PDF, DOCX, or TXT)
- AI will extract your skills automatically

### 4. Find Job Matches
- Go to "Find Jobs"
- You'll see jobs matched to your CV
- Each job shows a match score (0-100%)

### 5. Apply to Jobs
- Click "Apply Now" on any job
- AI generates a personalized message
- Your application is tracked automatically

## 📋 Manual Database Setup

If automatic initialization fails:

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left menu
   - Click "New Query"

3. **Run the Setup SQL**
   - Copy all content from `/scripts/init-database.sql`
   - Paste it into the editor
   - Click "Run" button

4. **Verify**
   - Go to "Table Editor"
   - You should see these tables:
     - `profiles`
     - `cvs`
     - `jobs`
     - `applications`
     - `job_matches`

5. **Return to App**
   - Close the database setup page
   - Refresh the page
   - You should now see the dashboard

## 🔐 Disable Email Confirmation (Optional)

If you want to skip email confirmation:

1. Go to **Authentication** → **Providers** → **Email**
2. Disable "Confirm email"
3. New users can login immediately

## 🐛 Troubleshooting

### "Email not confirmed" error
- Make sure email confirmation is disabled (see above)
- OR check your email for a confirmation link

### "Table does not exist" error
- Run the database setup (see Manual Database Setup section)
- Make sure all tables were created successfully

### Login/Signup page blank
- Check your browser console for errors (F12)
- Make sure Supabase environment variables are set
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### CV upload fails
- Use PDF, DOCX, or TXT format
- Max file size: 10MB
- Check browser console for error details

### No job matches
- Make sure you've uploaded a CV first
- Your CV must contain identifiable skills
- Try uploading a different CV with more specific skills

## 📚 Features Overview

### Dashboard
- View your statistics
- Quick access to all features
- Track your progress

### CVs
- Upload multiple resumes
- AI extracts skills automatically
- View extracted information
- Manage your CV library

### Jobs
- Browse all available jobs
- See match scores for each job
- Filter by match percentage
- Apply with one click

### Applications
- Track all your applications
- Update application status
- See AI-generated messages
- Export application list

## 🤖 AI Features

### CV Analysis
- Extracts skills from your resume
- Identifies years of experience
- Recognizes education and certifications
- Analyzes job titles and companies

### Job Matching
- Scores jobs 0-100% based on your CV
- Shows matched skills
- Identifies skill gaps
- Ranks jobs by relevance

### Message Generation
- Creates personalized application messages
- Tailored to each job
- Highlights matching skills
- Professional tone

## 💾 Data Privacy

- All your data is encrypted
- RLS (Row Level Security) ensures only you can see your data
- Your CV is never shared with third parties
- You can delete your data anytime

## 🚨 Need Help?

1. Check the `DATABASE_SETUP.md` file
2. Review `SETUP.md` for technical details
3. Check the browser console (F12) for error messages
4. Ensure all environment variables are set correctly

## 🎯 Next Steps

After setup:

1. **Optimize Your CV**
   - Make sure it clearly lists your skills
   - Include relevant keywords
   - Add your experience and education

2. **Explore Jobs**
   - Browse all available opportunities
   - Identify your target roles
   - Note which skills are most in-demand

3. **Start Applying**
   - Apply to matching jobs
   - Track your applications
   - Monitor responses

4. **Refine**
   - Update your CV based on job descriptions
   - Upload multiple CV versions
   - Test different approaches

Good luck with your job search! 🍀
