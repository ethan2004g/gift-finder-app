# Vercel Deployment Guide

## Required Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

### Required
```env
DATABASE_URL="postgresql://postgres:Arianlileghor2004@db.yuxvybpyatniuqsgbwpr.supabase.co:5432/postgres"
NEXTAUTH_URL="https://your-app.vercel.app"  # Replace with your actual Vercel URL
NEXTAUTH_SECRET="a7f3b9c2d4e6f8a1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b"
```

### Optional (for full functionality)
```env
OPENAI_API_KEY="sk-..."
RAPIDAPI_KEY="your-rapidapi-key"
AMAZON_ACCESS_KEY="your-access-key"
AMAZON_SECRET_KEY="your-secret-key"
AMAZON_PARTNER_TAG="your-tag"
```

## Database Setup on Vercel

### Option 1: Run Migrations in Build (Recommended)

Add a build script that runs migrations:

1. Go to Vercel Dashboard → Your Project → Settings → Build & Development Settings
2. Add a build command:
   ```bash
   npm run db:generate && npm run build
   ```

### Option 2: Run Migrations Manually

After deploying, run migrations manually:

```bash
# Set DATABASE_URL in your local environment
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

### Option 3: Use Vercel Post-Deploy Hook

Create a `vercel.json` to run migrations after deployment.

## Steps to Fix Account Creation on Vercel

1. **Add Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all required variables (especially `DATABASE_URL` and `NEXTAUTH_SECRET`)
   - Make sure to set them for **Production**, **Preview**, and **Development**

2. **Run Database Migrations:**
   - The database tables need to exist before the app can create users
   - Run: `npx prisma migrate deploy` (this uses your production DATABASE_URL)

3. **Redeploy:**
   - After adding environment variables, trigger a new deployment
   - Or push a new commit to trigger automatic deployment

4. **Check Logs:**
   - Go to Vercel Dashboard → Your Project → Deployments → Click on latest deployment → View Function Logs
   - Look for any database connection errors

## Common Issues

### Issue: "Environment variable not found: DATABASE_URL"
**Solution:** Add `DATABASE_URL` to Vercel environment variables

### Issue: "Table does not exist"
**Solution:** Run `npx prisma migrate deploy` against your production database

### Issue: "NEXTAUTH_SECRET is missing"
**Solution:** Add `NEXTAUTH_SECRET` to Vercel environment variables

### Issue: Database connection timeout
**Solution:** Check if your Supabase database allows connections from Vercel IPs (should work by default)

## Quick Fix Commands

```bash
# 1. Set production DATABASE_URL locally
$env:DATABASE_URL="postgresql://postgres:Arianlileghor2004@db.yuxvybpyatniuqsgbwpr.supabase.co:5432/postgres"

# 2. Run migrations against production database
npx prisma migrate deploy

# 3. Verify tables exist
npx prisma studio
```

