# Quick Vercel Setup Guide

## Step 1: Add Environment Variables

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add:

### Required Variables:

```env
DATABASE_URL=postgresql://postgres:Arianlileghor2004@db.yuxvybpyatniuqsgbwpr.supabase.co:5432/postgres
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=a7f3b9c2d4e6f8a1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b
```

**Important:**
- Replace `your-app-name.vercel.app` with your actual Vercel URL
- Set these for **Production**, **Preview**, and **Development** environments

## Step 2: Run Database Migrations

The database tables need to exist before the app can work. Run this locally:

```powershell
# Set the production database URL
$env:DATABASE_URL="postgresql://postgres:Arianlileghor2004@db.yuxvybpyatniuqsgbwpr.supabase.co:5432/postgres"

# Run migrations against production database
npx prisma migrate deploy
```

This will create all the necessary tables in your Supabase database.

## Step 3: Redeploy

After adding environment variables:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Step 4: Verify

1. Go to your Vercel app URL
2. Try creating an account
3. Check Vercel Function Logs if there are errors

## Troubleshooting

### "Table does not exist" error
**Solution:** Run `npx prisma migrate deploy` (Step 2 above)

### "Environment variable not found"
**Solution:** Make sure you added the variables in Vercel and selected all environments (Production, Preview, Development)

### "Database connection failed"
**Solution:** 
- Verify your Supabase database is running
- Check that the DATABASE_URL is correct
- Make sure your Supabase project allows external connections

## Check Logs

If account creation still fails:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click "View Function Logs"
4. Look for error messages related to database or authentication

