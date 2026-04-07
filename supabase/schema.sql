-- NeoHuman Database Schema Reference
-- These tables already exist in the shared Supabase project.
-- This file is for documentation only — DO NOT run this.

-- ─── Existing Tables Used by NeoHuman ───

-- users (shared with main platform)
-- Columns: id (int), clerk_id, email, name, role, avatar_url, created_at, updated_at, ...

-- organizations
-- Columns: id (uuid), name, slug, logo_url, industry, location, size, website, description, created_at, updated_at

-- user_organizations
-- Columns: id (uuid), user_id (int → users.id), organization_id (uuid → organizations.id), role, created_at

-- hiring_roles
-- Columns: id (uuid), organization_id (uuid), title, department, salary_range, job_description, status, created_by, created_at, updated_at

-- hiring_candidates
-- Columns: id (uuid), organization_id (uuid), challenge_id (int), role_id (uuid), email, name, user_id (int),
--           invite_token, invited_by, invited_at, status, submission_id, evaluation_id, submitted_at,
--           hired (bool), notes, created_at, updated_at, submission_url, report_url, expires_at

-- challenges (used as assessments)
-- Columns: id (int), host_id (int → users.id), title, status, created_at, source_position, primary_deliverable, ...

-- ─── Data Flow ───
-- Clerk user.id → users.clerk_id → users.id → user_organizations.user_id → organization_id
-- organization_id → hiring_roles.organization_id, hiring_candidates.organization_id
-- users.id → challenges.host_id (for assessments)
