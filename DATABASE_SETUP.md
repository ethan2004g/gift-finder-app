# Database Setup Guide

## Option 1: Use Docker (Recommended)

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop

2. Start the database:
   ```bash
   docker-compose up -d
   ```

3. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/giftfinder"
   ```

## Option 2: Use a Free Cloud Database (Easiest)

### Supabase (Free Tier)
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Copy the connection string from Settings > Database
5. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

### Neon (Free Tier)
1. Go to https://neon.tech
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Add to `.env.local`

## Option 3: Local PostgreSQL

1. Install PostgreSQL: https://www.postgresql.org/download/windows/

2. Create database:
   ```sql
   CREATE DATABASE giftfinder;
   ```

3. Add to `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/giftfinder"
   ```

## After Setting Up DATABASE_URL

1. Run migrations:
   ```bash
   npm run db:migrate
   ```

2. (Optional) Seed the database:
   ```bash
   npm run db:seed
   ```

3. Restart your dev server

