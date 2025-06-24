# Netlify Deployment Guide

## Quick Deploy Steps

### 1. Set up Supabase Database
Run this SQL in your Supabase SQL Editor at https://supabase.com/dashboard/project/mqrpjnwotddnfihkwyyl/sql:

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

### 2. Deploy to Netlify

#### Option A: Drag & Drop (Easiest)
1. Run `npm run build` in your project
2. Go to https://app.netlify.com/drop
3. Drag the `dist/public` folder to the deploy area
4. Your site will be live immediately!

#### Option B: Git Deployment (Recommended)
1. Push your code to GitHub/GitLab
2. Go to https://app.netlify.com/
3. Click "Add new site" → "Import from Git"
4. Connect your repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
6. Add environment variables:
   - `VITE_SUPABASE_URL`: `https://mqrpjnwotddnfihkwyyl.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xcnBqbndvdGRkbmZpaGt3eXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Njc1NzgsImV4cCI6MjA2NjM0MzU3OH0.Z43otQwtAzDrjJyA6HscdDSRmAXBXMvr5sUyWbfUwNo`
7. Click "Deploy site"

### 3. Verify Deployment
- Game loads and plays correctly
- Leaderboard shows after game over
- Scores can be submitted with username and wallet address
- Leaderboard displays top 10 scores

## Project Structure
- `dist/public/` - Static files for deployment
- `netlify.toml` - Netlify configuration
- Supabase handles the leaderboard database

## Troubleshooting
- If leaderboard doesn't work, check Supabase console for errors
- Ensure environment variables are set correctly in Netlify
- Check browser console for any JavaScript errors