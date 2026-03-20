# 🆘 JobPilot Help & Navigation Guide

## 🗺️ Where to Go - Quick Reference

### ⚡ "I need to get running NOW!" (5 min)
```
1. Read: INSTALL.md
2. Run: npm install && npm run dev
3. Go to: http://localhost:3000/auth/signup
4. Done!
```

### 🔍 "What went wrong?" (10 min)
```
1. Check: FIX_SUMMARY.md or FIXES_APPLIED.md
2. See: What was broken and how it was fixed
3. Or go to: STATUS.md for current state
```

### 🗄️ "Database isn't working" (5 min)
```
1. Check: DATABASE_SETUP.md
2. Follow: Manual setup instructions
3. Or try: Retry the automatic setup
```

### 📖 "How do I use this app?" (15 min)
```
1. Read: GETTING_STARTED.md
2. See: All features explained
3. Tips: Best practices for job hunting
```

### 🚀 "How do I deploy?" (20 min)
```
1. Read: DEPLOY.md
2. Choose: Your deployment platform
3. Follow: Step-by-step instructions
```

### ⚙️ "I need technical details" (30 min)
```
1. Read: SETUP.md
2. See: Architecture overview
3. Learn: Database schema and APIs
```

---

## 📚 All Documentation Files

| File | Purpose | Read Time | For Whom |
|------|---------|-----------|----------|
| **README_FIRST.md** | Start here! | 5 min | Everyone |
| **INSTALL.md** | Installation & setup | 10 min | Developers |
| **GETTING_STARTED.md** | Using the app | 15 min | Users |
| **DATABASE_SETUP.md** | Database issues | 5 min | Troubleshooting |
| **FIX_SUMMARY.md** | Technical summary | 10 min | Developers |
| **FIXES_APPLIED.md** | What was fixed | 10 min | Technical |
| **STATUS.md** | Current state | 5 min | Quick check |
| **SETUP.md** | Full technical | 30 min | Advanced |
| **DEPLOY.md** | Deployment guide | 20 min | Production |
| **LISEZMOI.md** | French version | 10 min | French speakers |
| **FIX_SUMMARY.md** | Tech details | 10 min | Developers |
| **.env.example** | Env template | 2 min | Setup |

---

## 🚨 Common Problems & Solutions

### Problem: "App won't start"
```
1. Check environment variables:
   - ls .env.local (should exist)
   - Check: NEXT_PUBLIC_SUPABASE_URL is set
   - Check: NEXT_PUBLIC_SUPABASE_ANON_KEY is set

2. Try:
   - npm install (re-install dependencies)
   - npm run dev (restart server)
   - Hard refresh browser (Ctrl+Shift+R)

3. Read: INSTALL.md Step 2: Configure Environment

4. Still broken?
   - Check browser console: F12
   - Look for red error messages
   - Copy error text and read TROUBLESHOOTING section below
```

### Problem: "Signup fails"
```
1. Check: Database is initialized
   - Go to: /dashboard/init
   - Click: "Retry"

2. If that fails:
   - Read: DATABASE_SETUP.md
   - Follow: Manual setup instructions

3. Still broken?
   - Check browser console: F12
   - See: HELP.md Troubleshooting section
```

### Problem: "Can't login"
```
1. Check: Email and password are correct
   - Try: Reset password link
   - Or: Sign up again

2. Check: Database is initialized
   - Go to: /dashboard/init
   - Click: "Retry"

3. Check: Email confirmation is disabled
   - Go to: Supabase Dashboard
   - Navigate: Auth → Providers → Email
   - Toggle: "Confirm email" OFF

4. Still broken?
   - Check browser console: F12
   - Read: HELP.md Troubleshooting section
```

### Problem: "Can't upload CV"
```
1. Check: File format
   - Supported: PDF, DOCX, TXT
   - Max size: 10MB

2. Check: File doesn't exceed size limit
   - Use: Smaller file or compress

3. Check: Browser allows uploads
   - Try: Different browser
   - Check: Pop-up blocker isn't blocking uploads

4. Still broken?
   - Check browser console: F12
   - Read: Database is initialized
```

### Problem: "No job matches appear"
```
1. Check: You uploaded a CV
   - Go to: /dashboard/cvs
   - Verify: CV is there

2. Check: CV has clear skills
   - Good: "Python, JavaScript, React"
   - Bad: "I can code"

3. Check: Jobs are loaded
   - Go to: /dashboard/jobs
   - Should show: List of jobs

4. Reload: Page and try again
   - F5 or Ctrl+R

5. Still broken?
   - Check browser console: F12
   - Check: Jobs table exists in Supabase
```

---

## 🔧 Troubleshooting by Error Message

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
# Solution:
npm install
npm run dev
```

### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"
```
1. Create .env.local file
2. Add all required variables (see .env.example)
3. Restart server: npm run dev
4. Hard refresh browser: Ctrl+Shift+R
```

### Error: "Table 'profiles' does not exist"
```
1. Go to: /dashboard/init
2. Click: "Retry"
3. Wait: For database to initialize (~5-10 seconds)
4. If fails: See DATABASE_SETUP.md for manual setup
```

### Error: "Email not confirmed"
```
1. Go to: Supabase Dashboard
2. Navigate: Authentication → Providers → Email
3. Toggle: "Confirm email" to OFF
4. Try login again
```

### Error: "401 Unauthorized"
```
1. Check: API keys are correct
2. Go to: Supabase Settings → API
3. Copy: Correct keys to .env.local
4. Restart: npm run dev
```

### Error: "Network request failed"
```
1. Check: Internet connection
2. Check: Supabase status (app.supabase.com)
3. Check: Firewall isn't blocking Supabase
4. Try: Different network (mobile hotspot)
```

### Error: "CORS error"
```
1. Check: API endpoints are correct
2. Verify: Supabase CORS settings are configured
3. Try: Direct URL without localhost
4. Check: Browser console for details
```

---

## ✅ Verification Steps

### Is the app working?
```bash
# 1. Check server is running
# Should see: "started server on 0.0.0.0:3000"

# 2. Check API is responding
curl http://localhost:3000/api/health
# Should return: {"status":"ok",...}

# 3. Check Supabase connection
# Open app in browser
# Check console (F12) for errors
```

### Is the database ready?
```
1. Go to: Supabase Dashboard
2. Click: Table Editor
3. Should see: profiles, cvs, jobs, applications, job_matches
4. Click: Each table should show data structure
```

### Can users sign up?
```
1. Go to: http://localhost:3000/auth/signup
2. Enter: Valid email, password, name
3. Click: Sign Up button
4. Should: Redirect to setup or dashboard
5. Check: No red error messages
```

### Can users login?
```
1. Go to: http://localhost:3000/auth/login
2. Enter: Email and password
3. Click: Sign In button
4. Should: Redirect to dashboard
5. Check: See welcome message
```

### Can users upload CV?
```
1. Login to dashboard
2. Click: "Upload Your CV"
3. Select: PDF, DOCX, or TXT file
4. Should: Upload and extract skills
5. Should: Show extracted information
```

### Can users see jobs?
```
1. Make sure: CV is uploaded
2. Go to: /dashboard/jobs
3. Should: See list of jobs
4. Should: See match percentage for each
5. Click: Any job to see details
```

---

## 🎯 Quick Fixes (Copy & Paste)

### Fix 1: Reinstall everything
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Fix 2: Clear browser cache
```
Press: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
This: Hard refreshes the page
```

### Fix 3: Reset environment
```bash
rm .env.local
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

### Fix 4: Check database
```
1. Open: https://app.supabase.com
2. Select: Your project
3. Click: SQL Editor
4. Run: SELECT * FROM profiles LIMIT 1;
```

---

## 📞 Getting Help

### Step 1: Check Documentation
- Which problem are you facing?
- Read the corresponding section above
- See if the solution is listed

### Step 2: Check Browser Console
- Press: F12
- Go to: Console tab
- Look for: Red error messages
- Copy: Full error text

### Step 3: Check Error Code
- Look for: "Error: [error message]"
- Search: This section for that error
- Follow: The solution steps

### Step 4: Check Supabase
- Go to: Supabase Dashboard
- Navigate: To relevant section
- Check: Settings match the guide
- Look for: Error logs

### Step 5: Try Fixes
- Follow: "Quick Fixes" section above
- Or: Specific solution for your error
- Test: After each change

---

## 🎓 Learning Resources

### Understanding JobPilot
- Read: `GETTING_STARTED.md` - How to use the app
- Read: `FIX_SUMMARY.md` - What was fixed
- Watch: Your browser console - Error messages

### Understanding Supabase
- Visit: https://supabase.com/docs
- Learn: Authentication, Databases, Storage
- Read: Official tutorials

### Understanding Next.js
- Visit: https://nextjs.org/docs
- Learn: Pages, API routes, Deployment
- Read: Official documentation

### Understanding React
- Visit: https://react.dev
- Learn: Components, Hooks, State
- Read: Official documentation

---

## 🔐 Security Notes

⚠️ **Important:**
- Never commit `.env.local` to Git
- Never share your API keys
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret
- Always use HTTPS in production
- Enable RLS on all tables

✅ **Good Practices:**
- Use environment variables
- Store secrets securely
- Validate all user input
- Use Row Level Security
- Monitor logs regularly

---

## 📈 Performance Tips

### Speed Up Database
```sql
-- Create indexes on frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_jobs_source ON jobs(source);
```

### Optimize Images
- Use: Next.js Image component
- Size: Appropriately for display
- Format: WebP when possible

### Enable Caching
- Use: Browser caching headers
- Set: ISR (Incremental Static Regeneration)
- Cache: API responses with SWR

### Monitor Performance
- Check: Vercel Analytics
- Monitor: Database queries
- Track: User experience metrics

---

## 🎯 Success Criteria

You're done when:

✅ App starts without errors
✅ Can sign up successfully
✅ Can login successfully
✅ Can see dashboard
✅ Can upload CV
✅ Can see job matches
✅ Can apply to jobs
✅ Data persists after refresh
✅ No console errors
✅ Works on mobile devices

---

## 🚀 Next Steps

1. **If setup is broken:** → `INSTALL.md`
2. **If database is broken:** → `DATABASE_SETUP.md`
3. **If feature is broken:** → `FIX_SUMMARY.md`
4. **If ready to deploy:** → `DEPLOY.md`
5. **If ready to use app:** → `GETTING_STARTED.md`

---

## 💬 Feedback

If this guide didn't help:

1. **Check all documentation files**
2. **Try all troubleshooting steps**
3. **Check browser console (F12)**
4. **Verify environment variables**
5. **Restart dev server**

---

**Last Resort:** Start fresh with:
```bash
rm -rf node_modules .next .env.local
npm install
cp .env.example .env.local
# Edit .env.local
npm run dev
```

---

**You got this!** 💪 Good luck! 🚀
