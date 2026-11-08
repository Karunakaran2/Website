-- Website development database (single DB, schema-per-service).
-- Run as a PostgreSQL superuser. Does not modify other databases.
-- Example: psql -U postgres -f 001_create_website_db.sql

CREATE DATABASE website_db
    WITH ENCODING = 'UTF8'
         TEMPLATE = template0;

\c website_db

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS careers;
CREATE SCHEMA IF NOT EXISTS engagement;
CREATE SCHEMA IF NOT EXISTS notification;

-- Optional: least-privilege app role (local dev uses postgres/pass like Probity — skip this block)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'website_app') THEN
--     CREATE ROLE website_app LOGIN PASSWORD 'change_me';
--   END IF;
-- END
-- $$;
-- GRANT CONNECT ON DATABASE website_db TO website_app;
-- GRANT USAGE, CREATE ON SCHEMA auth, content, catalog, media, careers, engagement, notification TO website_app;
