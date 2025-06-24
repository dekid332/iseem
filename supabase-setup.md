# Supabase Setup for Public Deployment

## Overview
This game can use either a local PostgreSQL database (for development) or Supabase (for public deployment on platforms like Netlify).

## Setting up Supabase

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for the project to be ready

### 2. Create the Leaderboard Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create leaderboard table
CREATE TABLE leaderboard (
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
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- Enable Row Level Security (optional, for public access)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON leaderboard
  FOR SELECT USING (true);

-- Create policy to allow public insert access
CREATE POLICY "Allow public insert access" ON leaderboard
  FOR INSERT WITH CHECK (true);
```

### 3. Get Your Supabase Credentials
1. Go to your project settings
2. Navigate to "API" section
3. Copy your:
   - Project URL
   - `anon` `public` API key

### 4. Configure Environment Variables

#### For Netlify Deployment:
1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add these variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

#### For Local Development with Supabase:
1. Create a `.env.local` file in your project root
2. Add the variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## How It Works

The application automatically detects which database to use:

- **If Supabase environment variables are present**: Uses Supabase for leaderboard
- **If no Supabase variables**: Falls back to local PostgreSQL database

This allows you to:
- Develop locally with PostgreSQL
- Deploy publicly with Supabase
- Switch between them without code changes

## Deployment Steps for Netlify

1. Set up your Supabase project and table (steps above)
2. Push your code to GitHub
3. Connect your GitHub repo to Netlify
4. Add the Supabase environment variables in Netlify
5. Deploy!

The game will automatically use Supabase for the public deployment while keeping local development simple.