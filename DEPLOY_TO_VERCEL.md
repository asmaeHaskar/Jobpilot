# Deploy JobPilot to Vercel

## Prerequisite

- GitHub account
- Vercel account (free)
- Supabase project with credentials

## Step 1: Prepare Code for GitHub

### Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial JobPilot commit"

# Add remote (replace YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/jobpilot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Connect to Vercel

### Option A: Deploy from GitHub (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Click "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"
6. Configure project:
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Option B: Deploy from CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. Go to Project Settings
2. Go to "Environment Variables"
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
```

Get these from:
- Supabase Dashboard → Project Settings → API

### Important:
- `NEXT_PUBLIC_*` variables are public (safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY` is secret (server-only)

## Step 4: Deploy

### Via GitHub:
1. Any push to `main` branch auto-deploys
2. Or click "Deploy" in Vercel dashboard

### Via CLI:
```bash
vercel --prod
```

## Step 5: Test in Production

1. Wait for deployment to complete
2. Click "Visit" link in Vercel
3. Test the application:
   - [ ] Sign up works
   - [ ] Login works
   - [ ] Database initializes
   - [ ] Dashboard loads
   - [ ] All features work

## Step 6: Set Custom Domain (Optional)

1. In Vercel project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records

## Troubleshooting Deployment

### Build Fails
```
Check:
- All dependencies installed
- No TypeScript errors locally
- Environment variables set correctly
- Node.js version compatible
```

### Runtime Errors
```
Check:
- Environment variables in Vercel
- Supabase credentials correct
- Database properly initialized
- Check Vercel logs
```

### Environment Variables Not Working
```bash
# Verify locally first
echo $NEXT_PUBLIC_SUPABASE_URL

# If not set, create .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Test build
npm run build
```

## Monitoring

### Check Logs
1. Go to Vercel project
2. Click "Deployments"
3. Click recent deployment
4. View "Function Logs" for errors

### Monitor Performance
1. Go to Analytics tab
2. Check:
   - Page load times
   - Error rates
   - User count

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` → auto-deploys
- Every push to other branches → preview deployment
- No manual deployment needed

## Rollback Previous Version

1. Go to Vercel Deployments
2. Find previous working version
3. Click "..." menu
4. Select "Promote to Production"

## Database Initialization in Production

The setup page will auto-initialize when first user logs in.

Or manually in production:
```bash
# Visit the setup endpoint
curl https://your-production-url/setup
```

## Performance Optimization

### Cache Optimization
```javascript
// next.config.js already optimized
export const images = {
  formats: ['image/avif', 'image/webp'],
}
```

### Database Indexes
Already created in SQL:
```sql
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_job_matches_user_id ON job_matches(user_id);
```

### Edge Caching
Configure in Vercel:
1. Project Settings → Caching
2. Set cache duration for API routes

## Security in Production

### HTTPS ✅
- Automatic on Vercel
- All traffic encrypted

### Environment Variables ✅
- Securely stored in Vercel
- Never exposed to client
- Only used on server

### Database ✅
- RLS policies enforced
- User data isolated
- Service role protected

### API Routes ✅
- Rate limiting recommended
- CORS configured
- Input validation enabled

## Backup Strategy

### Supabase Backups
1. Supabase auto-backs up daily
2. Manual backup option available
3. Restore points available

### Code Backups
- GitHub stores all versions
- Vercel stores deployment history
- Easy rollback available

## Monitoring & Alerts

### Set Up Monitoring
1. Vercel → Project Settings → Analytics
2. Enable performance monitoring
3. Set up email alerts

### Key Metrics to Monitor
- Error rate
- Response time
- Database queries
- User count

## Support

### For Deployment Issues
1. Check Vercel logs
2. Check Supabase logs
3. Check browser console
4. Read troubleshooting section

### Resources
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Deploy to production
- [ ] Test all features
- [ ] Custom domain configured
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated

## Redeploy Steps

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys
# Check status on vercel.com
```

## Rollback

```bash
# Revert last commit
git revert HEAD

# Push rollback
git push origin main

# Vercel auto-deploys previous version
```

---

**Deployed!** 🚀

Your JobPilot is now live on Vercel!

Visit: `https://your-project.vercel.app`
