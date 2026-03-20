# JobPilot Installation & Setup Checklist

## ✅ Pre-Installation Checklist

Before you start, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed (`npm --version`)
- [ ] A Supabase account (free at https://supabase.com)
- [ ] A code editor (VS Code recommended)

## 📦 Step 1: Clone/Setup Project

```bash
# If starting fresh
git clone <your-repo-url>
cd jobpilot

# Install dependencies
npm install

# Or with yarn
yarn install
```

## 🔑 Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Enter project name, database password, region
   - Wait for it to be ready (2-5 minutes)

2. **Get Your API Keys**
   - Go to Settings → API
   - Copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Create .env.local File**
   ```bash
   cp .env.example .env.local
   ```

4. **Fill in the Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...your-key...
   ```

## 🚀 Step 3: Start the App

```bash
npm run dev
# or
yarn dev
```

The app will start at `http://localhost:3000`

## 🗄️ Step 4: Initialize Database

### Option A: Automatic (Easiest)

1. Go to `http://localhost:3000/auth/signup`
2. Sign up with your email
3. You'll see a setup page - click "Retry"
4. Database will initialize automatically ✅

### Option B: Manual (If Automatic Fails)

1. Go to Supabase Dashboard
2. Click **SQL Editor** → **New Query**
3. Copy content from `/scripts/init-database.sql`
4. Paste it into the editor
5. Click **Run**

### Option C: Using Supabase CLI

```bash
# Login to Supabase
supabase login

# Initialize local Supabase
supabase init

# Apply migrations
supabase db push
```

## 🧪 Step 5: Test Everything

1. **Signup Test**
   - [ ] Go to `/auth/signup`
   - [ ] Create an account
   - [ ] See setup page
   - [ ] Database initializes

2. **Login Test**
   - [ ] Go to `/auth/login`
   - [ ] Login with your email
   - [ ] Redirected to dashboard

3. **Feature Test**
   - [ ] See dashboard stats
   - [ ] Click "Upload Your CV"
   - [ ] Upload a test CV
   - [ ] See extracted skills
   - [ ] Go to jobs page
   - [ ] See matched jobs
   - [ ] Apply to a job
   - [ ] Check applications page

## 🔍 Verification Checklist

After installation, verify:

- [ ] App loads at `http://localhost:3000`
- [ ] Sign up works
- [ ] Login works
- [ ] Dashboard shows stats
- [ ] Database tables exist in Supabase
- [ ] No errors in browser console (F12)

## 📊 Verify Database Tables

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Confirm you see:
   - [ ] `profiles`
   - [ ] `cvs`
   - [ ] `jobs`
   - [ ] `applications`
   - [ ] `job_matches`

## 🚀 Deployment Checklist

When ready to deploy:

- [ ] All features tested locally
- [ ] Environment variables configured
- [ ] Database initialized
- [ ] No console errors
- [ ] All documentation reviewed

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Go to https://vercel.com
# Import your repository
# Add environment variables
# Deploy
```

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
```bash
npm install
npm run dev
```

### Issue: "NEXT_PUBLIC_SUPABASE_URL is undefined"
1. Check `.env.local` file exists
2. Restart dev server (`npm run dev`)
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: "Table does not exist"
1. Run database initialization manually
2. See Step 4: Option B or C above

### Issue: Port 3000 already in use
```bash
npm run dev -- -p 3001
# Use port 3001 instead
```

## 📝 Project Structure

```
jobpilot/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Auth pages
│   ├── dashboard/        # Dashboard pages
│   └── page.tsx          # Landing page
├── lib/
│   └── supabase/         # Supabase clients
├── public/               # Static files
├── scripts/
│   └── init-database.sql # Database schema
├── .env.example          # Env template
└── package.json          # Dependencies
```

## 📚 Next Steps

1. Read `GETTING_STARTED.md` for usage guide
2. Read `DATABASE_SETUP.md` for database help
3. Read `STATUS.md` for what was fixed
4. Read `FIX_SUMMARY.md` for technical details

## ✨ Success Indicators

You'll know everything is working when:

✅ App starts without errors
✅ Sign up completes successfully
✅ Login works and redirects to dashboard
✅ Dashboard displays stats (0 CVs, 0 Apps, 0 Matches)
✅ You can upload a CV
✅ Jobs are fetched and shown
✅ You can apply to jobs

## 🎯 Quick Command Reference

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm run start

# Check environment
curl http://localhost:3000/api/health
```

## 💡 Tips

1. **Keep terminal open** - Dev server must be running
2. **Hard refresh** - Use Ctrl+Shift+R to clear cache
3. **Check console** - Press F12 for error messages
4. **Use .env.local** - Don't commit API keys
5. **Test locally first** - Before deploying

## ⚠️ Common Mistakes

❌ Forgetting to create `.env.local`
❌ Wrong API keys or URLs
❌ Not initializing database
❌ Dev server not running
❌ Not hard-refreshing after env changes

## 📞 Getting Help

1. Check the error message carefully
2. Look in browser console (F12)
3. Review relevant documentation file
4. Check Supabase logs
5. Verify environment variables

## 🎉 You're Ready!

Once you complete all steps, you have a fully functional JobPilot app!

- Signup/Login works ✅
- Database initialized ✅
- All features operational ✅
- Ready for testing ✅
- Ready for deployment ✅

**Start using JobPilot:**
1. Go to `http://localhost:3000`
2. Click "Get Started"
3. Sign up
4. Upload your CV
5. Find matching jobs!

Happy job hunting! 🚀
