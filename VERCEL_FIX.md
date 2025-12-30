# Fix Account Creation on Vercel

## Critical Steps

### 1. Add Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these (set for **Production**, **Preview**, AND **Development**):

```
DATABASE_URL=postgresql://postgres:Arianlileghor2004@db.yuxvybpyatniuqsgbwpr.supabase.co:5432/postgres

NEXTAUTH_URL=https://your-actual-app-name.vercel.app
(Replace with your actual Vercel URL - check your deployment URL)

NEXTAUTH_SECRET=a7f3b9c2d4e6f8a1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b
```

**IMPORTANT:** Make sure to select all three environments when adding each variable!

### 2. Run Database Migrations

The database tables MUST exist before account creation will work. Run this locally:

```powershell
cd "C:\Users\ethan\Cursor Projects\gift-finder-app"

# Set production database URL
$env:DATABASE_URL="postgresql://postgres:Arianlileghor2004@db.yuxvybpyatniuqsgbwpr.supabase.co:5432/postgres"

# Run migrations against production database
npx prisma migrate deploy
```

This will create all the tables in your Supabase database.

### 3. Redeploy on Vercel

After adding environment variables:
- Go to Vercel Dashboard → Your Project → Deployments
- Click the "..." menu on the latest deployment
- Click "Redeploy"
- Or push a new commit (I just pushed fixes)

### 4. Check Vercel Logs

If it still doesn't work:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Click "View Function Logs" or "View Build Logs"
4. Look for errors related to:
   - "DATABASE_URL not found"
   - "Table does not exist"
   - "Prisma client not generated"

## Common Issues

### Issue: "Table 'users' does not exist"
**Solution:** Run `npx prisma migrate deploy` (Step 2 above)

### Issue: "Environment variable not found: DATABASE_URL"
**Solution:** Add DATABASE_URL in Vercel environment variables (Step 1)

### Issue: "NEXTAUTH_SECRET is missing"
**Solution:** Add NEXTAUTH_SECRET in Vercel environment variables

### Issue: Build fails with Prisma errors
**Solution:** The build script now includes `prisma generate` - this should be automatic

## What I Fixed

1. ✅ Converted middleware.ts to proxy.ts (fixes the deprecation warning)
2. ✅ Added database connection check in signup route
3. ✅ Improved error logging for debugging
4. ✅ Updated build script to generate Prisma client and run migrations

## Next Steps

1. **Run the migration command above** (Step 2) - This is CRITICAL
2. **Add environment variables in Vercel** (Step 1) - Make sure NEXTAUTH_URL matches your actual Vercel URL
3. **Redeploy** (Step 3)
4. **Test account creation**

The most common issue is that the database tables don't exist yet. Running `prisma migrate deploy` will fix that.

