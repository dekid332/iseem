# Netlify Deployment Guide for The Prooper Shooter

## Current Status
✅ Project successfully migrated to Replit environment
✅ Supabase integration configured with public leaderboard
✅ Build configuration optimized for static deployment
✅ Environment variables configured

## Pre-configured Settings

### Supabase Configuration
- **URL**: https://mqrpjnwotddnfihkwyyl.supabase.co
- **Anon Key**: Already configured in netlify.toml
- **Database**: Leaderboard table ready for public access

### Build Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist/public`
- **Node Version**: 20

## Deployment Steps

### 1. Push to GitHub
If you haven't already, push this code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit - The Prooper Shooter game"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/sign in
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository
5. Netlify will automatically detect the build settings from `netlify.toml`
6. Click "Deploy site"

### 3. Environment Variables (Already Configured)
The following environment variables are already set in `netlify.toml`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## What Works After Deployment
- ✅ Full game functionality
- ✅ Public leaderboard with Supabase backend
- ✅ Score submission and retrieval
- ✅ Cross-platform compatibility (mobile/desktop)
- ✅ Audio and visual effects
- ✅ Character integration with provided assets

## Database Setup Required
Make sure your Supabase database has the leaderboard table. Run this SQL in your Supabase SQL Editor:

```sql
-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  wallet_address TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  enemies_killed INTEGER NOT NULL DEFAULT 0,
  game_time INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY IF NOT EXISTS "Allow public insert access" ON leaderboard
  FOR INSERT WITH CHECK (true);
```

## Post-Deployment Testing
1. Visit your deployed site URL
2. Play the game and submit a score
3. Check the leaderboard to confirm database connectivity
4. Test on mobile devices for responsiveness

Your game is ready for public deployment with a fully functional leaderboard system!