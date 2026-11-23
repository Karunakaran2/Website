export const CMS_ADMIN = {
  USERS_MANAGE: 'CMS_ADMIN_USERS_MANAGE',
  ROLES_MANAGE: 'CMS_ADMIN_ROLES_MANAGE',
  AUDIT_VIEW: 'CMS_ADMIN_AUDIT_VIEW',
}

/** Resource registry key → privilege codes per action */
export const CMS_RESOURCE_PRIVILEGES = {
  'website-news': {
    view: 'CMS_CONTENT_NEWS_VIEW',
    create: 'CMS_CONTENT_NEWS_CREATE',
    edit: 'CMS_CONTENT_NEWS_EDIT',
    delete: 'CMS_CONTENT_NEWS_DELETE',
    download: 'CMS_CONTENT_NEWS_DOWNLOAD',
  },
  'website-banner': {
    view: 'CMS_CONTENT_BANNER_VIEW',
    create: 'CMS_CONTENT_BANNER_CREATE',
    edit: 'CMS_CONTENT_BANNER_EDIT',
    delete: 'CMS_CONTENT_BANNER_DELETE',
  },
  'website-data-sheets': {
    view: 'CMS_CONTENT_DATASHEET_VIEW',
    edit: 'CMS_CONTENT_DATASHEET_EDIT',
  },
  'website-timeline': {
    view: 'CMS_CONTENT_TIMELINE_VIEW',
    edit: 'CMS_CONTENT_TIMELINE_EDIT',
  },
  'website-gallery': {
    view: 'CMS_MEDIA_VIEW',
    edit: 'CMS_MEDIA_EDIT',
  },
  'website-mail-setup': {
    view: 'CMS_NOTIFICATION_VIEW',
    edit: 'CMS_NOTIFICATION_EDIT',
  },
}

const DEFAULT_ACTIONS = {
  view: 'CMS_CATALOG_VIEW',
  edit: 'CMS_CATALOG_EDIT',
}

export function cmsPrivilegesForResource(resourceKey) {
  if (!resourceKey) {
    return DEFAULT_ACTIONS
  }
  if (resourceKey.startsWith('website-careers') || resourceKey.includes('career')) {
    return { view: 'CMS_CAREERS_VIEW', edit: 'CMS_CAREERS_EDIT' }
  }
  return CMS_RESOURCE_PRIVILEGES[resourceKey] ?? DEFAULT_ACTIONS
}