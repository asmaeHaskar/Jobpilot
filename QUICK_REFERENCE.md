# JobPilot - Quick Reference Guide

## Get Started (Copy-Paste)

```bash
# 1. Start dev server
npm run dev

# 2. Open browser
open http://localhost:3000

# 3. Or manually visit
http://localhost:3000
```

---

## 3-Step User Setup

### Step 1: Sign Up
```
http://localhost:3000/auth/signup
- Email: your@email.com
- Password: anypassword123
- Name: Your Name
- Click "Sign Up"
```

### Step 2: Setup (Auto)
- Should redirect to `/setup`
- Database auto-initializes
- Wait for "Setup Complete!"

### Step 3: Use App
- Click "Go to Dashboard"
- Upload your CV
- Browse jobs
- Apply!

---

## Quick Routes

| Page | URL | Purpose |
|------|-----|---------|
| Landing | `/` | Home page |
| Sign Up | `/auth/signup` | Create account |
| Login | `/auth/login` | Sign in |
| Setup | `/setup` | Initialize DB |
| Dashboard | `/dashboard` | Main app |
| CVs | `/dashboard/cvs` | Manage CVs |
| Jobs | `/dashboard/jobs` | Browse jobs |
| Applications | `/dashboard/applications` | Track apps |

---

## Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check code quality
npm run lint
```

---

## Troubleshooting

### App won't start
```bash
# Clear cache and restart
Ctrl+C
npm run dev
```

### Env vars not loaded
```bash
# Check .env.local exists with:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Tables not found
```
Visit: http://localhost:3000/setup
Page will auto-create tables
```

### Login/Signup fails
```bash
# Restart dev server
Ctrl+C
npm run dev

# Then try again
```

---

## Key Features

✅ User authentication
✅ CV upload and processing
✅ Job matching algorithm
✅ Application tracking
✅ AI-generated messages
✅ Responsive design

---

## Documentation Files

- `START_HERE.md` - Detailed setup guide
- `PROJECT_COMPLETE.md` - Status and features
- `CHANGES_MADE.md` - Technical changes
- `QUICK_REFERENCE.md` - This file

---

## API Endpoints

```
POST /api/auth/signup - Sign up
POST /api/auth/login - Sign in
POST /api/setup/init-db - Initialize database
GET /api/health - System status
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Get from: Supabase Dashboard → Project Settings → API

---

## Status: ✅ COMPLETE

All errors fixed. Ready to use.
No configuration needed. Just run `npm run dev`.

---

**Happy job hunting!** 🚀
