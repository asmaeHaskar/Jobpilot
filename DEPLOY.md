# JobPilot Deployment Guide

## 📦 Before Deploying

Make sure you have completed:

- [ ] Local development is working
- [ ] All tests pass
- [ ] Database is initialized
- [ ] Environment variables are configured
- [ ] Code is pushed to GitHub

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy a Next.js app.

### Step 1: Push to GitHub

```bash
git add .
git commit -m "JobPilot ready for deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com
2. Click **"Import Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Configure Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (2-5 minutes)
3. Get your live URL
4. Test all features

## 🔧 Alternative Deployments

### Deploy to Heroku

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create jobpilot

# Set environment variables
heroku config:set NEXT_PUBLIC_SUPABASE_URL=...
heroku config:set NEXT_PUBLIC_SUPABASE_ANON_KEY=...
heroku config:set SUPABASE_SERVICE_ROLE_KEY=...

# Deploy
git push heroku main
```

### Deploy to Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "GitHub Repo"
4. Authorize and select your repo
5. Add environment variables
6. Deploy

### Deploy to AWS/Google Cloud

For production-grade deployments, see the respective documentation:
- AWS: https://aws.amazon.com/getting-started/hands-on/deploy-nextjs/
- Google Cloud: https://cloud.google.com/nodejs/docs/tutorials/run-nextjs-on-cloud-run

## ✅ Post-Deployment Checklist

After deployment:

- [ ] App loads without errors
- [ ] Signup page works
- [ ] Login page works
- [ ] Database operations work
- [ ] File uploads work
- [ ] API endpoints respond correctly
- [ ] Error messages are helpful
- [ ] No sensitive data in logs

## 🔐 Security Checklist

Before going to production:

- [ ] API keys are in environment variables (not in code)
- [ ] RLS policies are enabled in Supabase
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] HTTPS is enforced
- [ ] Only service role key used server-side
- [ ] Anon key used client-side

## 📊 Monitoring

After deployment, monitor:

1. **Vercel Analytics**
   - Go to Vercel Dashboard
   - Check deployment status
   - Monitor logs for errors

2. **Supabase Logs**
   - Go to Supabase Dashboard
   - Check database logs
   - Monitor API usage

3. **Error Tracking**
   - Set up Sentry or similar
   - Monitor for runtime errors

## 🚨 Common Deployment Issues

### Issue: Build Failed

**Check:**
- [ ] All dependencies installed (`npm install`)
- [ ] No TypeScript errors
- [ ] All environment variables present
- [ ] No hardcoded API keys

### Issue: App Crashes After Deploy

**Check:**
- [ ] Environment variables are set
- [ ] Database is accessible
- [ ] All APIs are working
- [ ] Check Vercel logs for errors

### Issue: Database Connection Fails

**Check:**
- [ ] SUPABASE_SERVICE_ROLE_KEY is set
- [ ] Supabase project is active
- [ ] Network access is allowed
- [ ] JWT token is valid

### Issue: File Uploads Fail

**Check:**
- [ ] Supabase Storage is enabled
- [ ] Bucket permissions are correct
- [ ] Max file size is appropriate
- [ ] Content-Type headers are set

## 🔄 Continuous Deployment

Set up automatic deployments:

### With Vercel

1. Enable GitHub integration in Vercel
2. Set branch (main) to auto-deploy
3. Every push to main deploys automatically

### Manual Updates

```bash
# Make changes
git add .
git commit -m "Update: feature X"
git push origin main

# Vercel automatically deploys
# Check: https://vercel.com/dashboard
```

## 📈 Performance Optimization

After deployment:

1. **Enable Compression**
   - Vercel does this automatically

2. **Optimize Images**
   - Use `<Image>` from Next.js
   - Set `priority` for above-fold images

3. **Code Splitting**
   - Dynamic imports for large components
   - Already configured in Next.js

4. **Caching**
   - Set Cache-Control headers
   - Use ISR (Incremental Static Regeneration)

## 📞 Support URLs

After deployment, share these URLs:

- **Landing Page**: `https://your-domain.vercel.app`
- **Sign Up**: `https://your-domain.vercel.app/auth/signup`
- **Sign In**: `https://your-domain.vercel.app/auth/login`

## 🎯 Going Live Checklist

Before telling users:

- [ ] Domain name configured
- [ ] SSL certificate enabled (automatic with Vercel)
- [ ] All features tested on live domain
- [ ] Error messages are appropriate
- [ ] Help documentation is available
- [ ] Contact information is displayed
- [ ] Privacy policy is available
- [ ] Terms of service are available

## 🔔 Notifications Setup

Consider setting up:

1. **Error Alerts**
   - Use Sentry, Rollbar, or similar
   - Get notified of production errors

2. **Performance Alerts**
   - Monitor response times
   - Alert on slowdowns

3. **Uptime Monitoring**
   - Use UptimeRobot or similar
   - Get notified if site goes down

## 💰 Cost Estimation

### Vercel (Recommended)

- **Free Tier**: $0/month
  - Perfect for learning and testing
  - 100GB bandwidth/month
  - Serverless functions included

- **Pro**: $20/month
  - For production apps
  - 1TB bandwidth/month
  - Priority support

### Supabase

- **Free Tier**: $0/month
  - Perfect for development
  - 500MB database
  - 1GB file storage

- **Pro**: $25/month
  - For production
  - 8GB database
  - 100GB file storage

**Total for Production**: ~$45/month

## 🚀 Launch Day

When going live:

1. ✅ All tests pass locally
2. ✅ Deployed to Vercel
3. ✅ Domain is active
4. ✅ SSL certificate works
5. ✅ All features tested on live domain
6. ✅ Monitoring is configured
7. ✅ Documentation is ready
8. ✅ Support system is in place

## 📱 Mobile Testing

Before launch, test on mobile:

1. Responsive design
2. Touch interactions
3. File uploads
4. Loading states
5. Error handling

## ✨ Post-Launch

After going live:

1. Monitor errors and performance
2. Gather user feedback
3. Fix bugs quickly
4. Improve based on usage patterns
5. Scale infrastructure as needed

---

## Success!

You've successfully deployed JobPilot to production! 🎉

**What's next:**
- Monitor for errors
- Gather user feedback
- Plan new features
- Scale infrastructure
- Celebrate your launch! 🚀
