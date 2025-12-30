# GitHub & Vercel Setup Guide

## ✅ Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `gift-finder-app` (or your preferred name)
   - **Description**: "AI-powered gift finder application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

## ✅ Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these in your terminal:

```bash
# Navigate to your project
cd "C:\Users\ethan\Cursor Projects\gift-finder-app"

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gift-finder-app.git

# Rename branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

**Note**: You'll be prompted for your GitHub username and password (or personal access token).

## ✅ Step 3: Connect to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your `gift-finder-app` repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

## 🔑 If You Need a Personal Access Token

If GitHub asks for authentication:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name (e.g., "Vercel Deployment")
4. Select scopes: `repo` (full control of private repositories)
5. Click **"Generate token"**
6. Copy the token and use it as your password when pushing

## 📝 Quick Commands Reference

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# View remotes
git remote -v
```

## 🚨 Troubleshooting

**"Repository not found" error?**
- Check that the repository name matches exactly
- Ensure you have access to the repository

**"Authentication failed" error?**
- Use a Personal Access Token instead of password
- Make sure the token has `repo` scope

**"Branch not found" error?**
- Make sure you've pushed at least one commit
- Check that you're on the `main` branch: `git branch`

