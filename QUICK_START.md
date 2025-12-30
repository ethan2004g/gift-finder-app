# Quick Start Guide

## Running the Development Server

### Step 1: Navigate to the project directory
```bash
cd gift-finder-app
```

### Step 2: Install dependencies (if not already done)
```bash
npm install
```

### Step 3: Start the development server
```bash
npm run dev
```

### Step 4: Open your browser
Visit: **http://localhost:3000**

---

## Available Scripts

- `npm run dev` - Start development server (with hot reload)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## What You'll See

1. **Landing Page** (`/`) - Welcome page with "Get Started" button
2. **Search Page** (`/search`) - Gift search form
3. **Dashboard** (`/`) - Main dashboard (when logged in)
4. **Login** (`/login`) - Sign in page
5. **Signup** (`/signup`) - Create account page

---

## Navigation

- Use the sidebar to navigate between pages
- All pages are functional UI (backend integration coming in Phase 1)
- The app supports dark mode automatically

---

## Troubleshooting

**Port 3000 already in use?**
- The dev server will automatically use the next available port (3001, 3002, etc.)
- Or stop the existing process and restart

**Changes not showing?**
- The dev server has hot reload - changes should appear automatically
- Try hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

