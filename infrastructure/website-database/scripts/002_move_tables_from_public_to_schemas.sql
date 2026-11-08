-- Run connected to website_db as postgres.
-- Moves KRAN SRS tables from public → schema-per-service (dev model).
-- Skip any line that errors "does not exist" or "already exists in schema".

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS careers;
CREATE SCHEMA IF NOT EXISTS engagement;
CREATE SCHEMA IF NOT EXISTS notification;

-- If you already have copies in auth AND public, drop the empty/wrong copy first, e.g.:
-- DROP TABLE IF EXISTS auth.admin_user CASCADE;  -- only if public has the real data

-- auth (parent tables first)
ALTER TABLE IF EXISTS public.admin_user SET SCHEMA auth;
ALTER TABLE IF EXISTS public.admin_login_audit SET SCHEMA auth;
ALTER TABLE IF EXISTS public.refresh_token SET SCHEMA auth;

-- content
ALTER TABLE IF EXISTS public.news SET SCHEMA content;
ALTER TABLE IF EXISTS public.banner SET SCHEMA content;
ALTER TABLE IF EXISTS public.blog SET SCHEMA content;
ALTER TABLE IF EXISTS public.kran_timeline SET SCHEMA content;

-- catalog
ALTER TABLE IF EXISTS public.category SET SCHEMA catalog;
ALTER TABLE IF EXISTS public.casestudy SET SCHEMA catalog;
ALTER TABLE IF EXISTS public.project_product SET SCHEMA catalog;
ALTER TABLE IF EXISTS public.kran_projects SET SCHEMA catalog;
ALTER TABLE IF EXISTS public.kran_solutions SET SCHEMA catalog;
ALTER TABLE IF EXISTS public.kran_faces SET SCHEMA catalog;
ALTER TABLE IF EXISTS public.kran_seniors SET SCHEMA catalog;

-- media (gallgroup before gallery)
ALTER TABLE IF EXISTS public.gallgroup SET SCHEMA media;
ALTER TABLE IF EXISTS public.gallery SET SCHEMA media;

-- careers
ALTER TABLE IF EXISTS public.careers SET SCHEMA careers;
ALTER TABLE IF EXISTS public.application_request SET SCHEMA careers;
ALTER TABLE IF EXISTS public.submitted_resumes SET SCHEMA careers;

-- engagement
ALTER TABLE IF EXISTS public.contacts SET SCHEMA engagement;
ALTER TABLE IF EXISTS public.comments SET SCHEMA engagement;

-- notification
ALTER TABLE IF EXISTS public.mail_setup SET SCHEMA notification;
ALTER TABLE IF EXISTS public.outbound_email_log SET SCHEMA notification;

-- Flyway history (if services already ran against public)
ALTER TABLE IF EXISTS public.flyway_schema_history SET SCHEMA auth;

-- Optional: verify
-- SELECT table_schema, table_name FROM information_schema.tables
-- WHERE table_schema IN ('auth','content','catalog','media','careers','engagement','notification')
--   AND table_type = 'BASE TABLE' ORDER BY 1, 2;
