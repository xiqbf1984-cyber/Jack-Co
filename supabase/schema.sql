-- NeoHuman Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- ─── Users (synced from Clerk) ───
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Companies ───
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Your Company',
  logo TEXT DEFAULT 'C',
  industry TEXT DEFAULT 'Technology',
  location TEXT DEFAULT '',
  size TEXT DEFAULT '50-200',
  website TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Roles ───
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  dept TEXT DEFAULT 'Engineering',
  status TEXT DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  salary TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT false,
  jd TEXT DEFAULT '',
  sharable_link TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Candidates ───
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'active', 'completed')),
  timezone TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Assessments ───
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  role_title TEXT DEFAULT '',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'published', 'completed', 'expired')),
  skill TEXT DEFAULT '',
  task TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Assessment Results ───
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  grade TEXT DEFAULT '',
  feedback TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Notifications ───
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Row Level Security ───
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Company policies
CREATE POLICY "Users can CRUD own companies" ON companies FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'));

-- Role policies
CREATE POLICY "Users can CRUD own roles" ON roles FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'));

-- Candidate policies
CREATE POLICY "Users can CRUD own candidates" ON candidates FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'));

-- Assessment policies
CREATE POLICY "Users can CRUD own assessments" ON assessments FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'));

-- Assessment result policies
CREATE POLICY "Users can CRUD own assessment results" ON assessment_results FOR ALL USING (assessment_id IN (SELECT id FROM assessments WHERE user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub')));

-- Notification policies
CREATE POLICY "Users can CRUD own notifications" ON notifications FOR ALL USING (user_id IN (SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims')::json->>'sub'));

-- ─── Indexes ───
CREATE INDEX IF NOT EXISTS idx_roles_user_id ON roles(user_id);
CREATE INDEX IF NOT EXISTS idx_roles_status ON roles(status);
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
