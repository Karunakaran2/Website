CREATE TABLE admin_role (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code            VARCHAR(64) NOT NULL,
    name            VARCHAR(128) NOT NULL,
    description     VARCHAR(512),
    built_in        BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_admin_role_code UNIQUE (code)
);

CREATE TABLE admin_privilege (
    code            VARCHAR(96) PRIMARY KEY,
    name            VARCHAR(160) NOT NULL,
    module_key      VARCHAR(64) NOT NULL,
    action          VARCHAR(32) NOT NULL
);

CREATE TABLE admin_role_privilege (
    role_id         UUID NOT NULL REFERENCES admin_role (id) ON DELETE CASCADE,
    privilege_code  VARCHAR(96) NOT NULL REFERENCES admin_privilege (code) ON DELETE CASCADE,
    PRIMARY KEY (role_id, privilege_code)
);

CREATE TABLE admin_user_privilege (
    admin_user_id   UUID NOT NULL REFERENCES admin_user (id) ON DELETE CASCADE,
    privilege_code  VARCHAR(96) NOT NULL REFERENCES admin_privilege (code) ON DELETE CASCADE,
    PRIMARY KEY (admin_user_id, privilege_code)
);

ALTER TABLE admin_user
    ADD COLUMN role_id UUID REFERENCES admin_role (id),
    ADD COLUMN system_admin BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN use_custom_privileges BOOLEAN NOT NULL DEFAULT false;

INSERT INTO admin_role (code, name, description, built_in) VALUES
    ('SYSTEM_ADMIN', 'System administrator', 'Full CMS access including user and role setup', true),
    ('CONTENT_CREATOR', 'Content creator', 'Create and edit website content', true),
    ('CONTENT_VIEWER', 'Content viewer', 'View and download content only', true),
    ('HR_MANAGER', 'HR manager', 'Careers and job applications', true);

INSERT INTO admin_privilege (code, name, module_key, action) VALUES
    ('CMS_ADMIN_USERS_VIEW', 'View admin users', 'admin_users', 'VIEW'),
    ('CMS_ADMIN_USERS_MANAGE', 'Manage admin users', 'admin_users', 'MANAGE'),
    ('CMS_ADMIN_ROLES_VIEW', 'View roles', 'admin_roles', 'VIEW'),
    ('CMS_ADMIN_ROLES_MANAGE', 'Manage roles and privileges', 'admin_roles', 'MANAGE'),
    ('CMS_CONTENT_NEWS_VIEW', 'View news', 'content_news', 'VIEW'),
    ('CMS_CONTENT_NEWS_CREATE', 'Create news', 'content_news', 'CREATE'),
    ('CMS_CONTENT_NEWS_EDIT', 'Edit news', 'content_news', 'EDIT'),
    ('CMS_CONTENT_NEWS_DELETE', 'Delete news', 'content_news', 'DELETE'),
    ('CMS_CONTENT_NEWS_DOWNLOAD', 'Download news files', 'content_news', 'DOWNLOAD'),
    ('CMS_CONTENT_BANNER_VIEW', 'View banners', 'content_banner', 'VIEW'),
    ('CMS_CONTENT_BANNER_CREATE', 'Create banners', 'content_banner', 'CREATE'),
    ('CMS_CONTENT_BANNER_EDIT', 'Edit banners', 'content_banner', 'EDIT'),
    ('CMS_CONTENT_BANNER_DELETE', 'Delete banners', 'content_banner', 'DELETE'),
    ('CMS_CONTENT_DATASHEET_VIEW', 'View data sheets', 'content_datasheet', 'VIEW'),
    ('CMS_CONTENT_DATASHEET_EDIT', 'Edit data sheets', 'content_datasheet', 'EDIT'),
    ('CMS_CONTENT_TIMELINE_VIEW', 'View timeline', 'content_timeline', 'VIEW'),
    ('CMS_CONTENT_TIMELINE_EDIT', 'Edit timeline', 'content_timeline', 'EDIT'),
    ('CMS_CATALOG_VIEW', 'View catalog', 'catalog', 'VIEW'),
    ('CMS_CATALOG_EDIT', 'Edit catalog', 'catalog', 'EDIT'),
    ('CMS_MEDIA_VIEW', 'View media gallery', 'media', 'VIEW'),
    ('CMS_MEDIA_EDIT', 'Edit media gallery', 'media', 'EDIT'),
    ('CMS_CAREERS_VIEW', 'View careers', 'careers', 'VIEW'),
    ('CMS_CAREERS_EDIT', 'Edit careers', 'careers', 'EDIT'),
    ('CMS_ENGAGEMENT_VIEW', 'View enquiries', 'engagement', 'VIEW'),
    ('CMS_NOTIFICATION_VIEW', 'View mail setup', 'notification', 'VIEW'),
    ('CMS_NOTIFICATION_EDIT', 'Edit mail setup', 'notification', 'EDIT');

INSERT INTO admin_role_privilege (role_id, privilege_code)
SELECT r.id, p.code
FROM admin_role r
CROSS JOIN admin_privilege p
WHERE r.code = 'SYSTEM_ADMIN';

INSERT INTO admin_role_privilege (role_id, privilege_code)
SELECT r.id, p.code
FROM admin_role r
JOIN admin_privilege p ON p.code IN (
    'CMS_CONTENT_NEWS_VIEW', 'CMS_CONTENT_NEWS_CREATE', 'CMS_CONTENT_NEWS_EDIT',
    'CMS_CONTENT_BANNER_VIEW', 'CMS_CONTENT_BANNER_CREATE', 'CMS_CONTENT_BANNER_EDIT',
    'CMS_CONTENT_DATASHEET_VIEW', 'CMS_CONTENT_DATASHEET_EDIT',
    'CMS_CONTENT_TIMELINE_VIEW', 'CMS_CONTENT_TIMELINE_EDIT'
)
WHERE r.code = 'CONTENT_CREATOR';

INSERT INTO admin_role_privilege (role_id, privilege_code)
SELECT r.id, p.code
FROM admin_role r
JOIN admin_privilege p ON p.code IN (
    'CMS_CONTENT_NEWS_VIEW', 'CMS_CONTENT_NEWS_DOWNLOAD',
    'CMS_CONTENT_BANNER_VIEW',
    'CMS_CONTENT_DATASHEET_VIEW',
    'CMS_CONTENT_TIMELINE_VIEW'
)
WHERE r.code = 'CONTENT_VIEWER';

INSERT INTO admin_role_privilege (role_id, privilege_code)
SELECT r.id, p.code
FROM admin_role r
JOIN admin_privilege p ON p.module_key IN ('careers', 'engagement')
WHERE r.code = 'HR_MANAGER';

UPDATE admin_user SET system_admin = true WHERE role_id IS NULL;