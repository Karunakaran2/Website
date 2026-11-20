-- Run in pgAdmin on database `website_db` after auth-service has started at least once.
-- Flyway creates auth.admin_user but does NOT insert login rows — the first admin comes from
-- auth-service startup env (see documentation/RUN_WORKSPACE.md).

SET search_path TO auth;

SELECT id,
       username,
       display_name,
       is_active,
       last_login_at,
       created_at
FROM admin_user
ORDER BY created_at;