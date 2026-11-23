/**
 * Website-backend mock (opt-in via VITE_MOCK_API=true).
 * Only routes implemented in website-backend are mocked; everything else returns 501.
 */
import { generateMockCaptcha, getCurrentCaptcha } from './data/authMockData'

function parseJsonSafe(body) {
  if (!body) return {}
  if (typeof body === 'object') return body
  try {
    return JSON.parse(body)
  } catch {
    return {}
  }
}

function normalizeUrl(url) {
  if (!url) return ''
  const trimmed = String(url).trim()
  try {
    const parsed = new URL(trimmed, 'http://localhost')
    return { pathname: parsed.pathname }
  } catch {
    const [pathPart] = trimmed.split('?')
    return { pathname: pathPart }
  }
}

function apiOk(data) {
  return { status: 200, data: { success: true, message: null, data } }
}

const MOCK_ALL_PRIVILEGES = [
  'CMS_ADMIN_USERS_MANAGE',
  'CMS_ADMIN_ROLES_MANAGE',
  'CMS_ADMIN_AUDIT_VIEW',
  'CMS_CONTENT_NEWS_VIEW',
  'CMS_CONTENT_NEWS_CREATE',
  'CMS_CONTENT_NEWS_EDIT',
  'CMS_CONTENT_NEWS_DELETE',
  'CMS_CONTENT_BANNER_VIEW',
  'CMS_CONTENT_BANNER_EDIT',
  'CMS_CATALOG_VIEW',
  'CMS_CATALOG_EDIT',
  'CMS_CAREERS_VIEW',
  'CMS_CAREERS_EDIT',
]

let activeSession = {
  username: 'cms-user',
  displayName: 'CMS User',
  role: 'SYSTEM_ADMIN',
  roleName: 'System administrator',
  systemAdmin: true,
  privilegeCodes: MOCK_ALL_PRIVILEGES,
}

export async function handleMockRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const { pathname } = normalizeUrl(url)
  const body = parseJsonSafe(options.body)

  if (pathname.includes('/api/v1/captcha/getCaptcha')) {
    return { status: 200, data: generateMockCaptcha() }
  }

  if (pathname.includes('/api/v1/auth/login') && method === 'POST') {
    const current = getCurrentCaptcha()
    const answer = String(body.captcha || '').trim().toUpperCase()
    if (body.captchaId !== current.id || !answer || answer !== String(current.code).toUpperCase()) {
      return { status: 400, data: { success: false, message: 'Invalid or expired CAPTCHA' } }
    }
    if (!body.username || !body.password) {
      return { status: 401, data: { success: false, message: 'Invalid username or password' } }
    }
    activeSession = {
      ...activeSession,
      username: String(body.username).trim(),
      displayName: String(body.username).trim(),
    }
    return {
      status: 200,
      data: {
        accessToken: `mock-token-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`,
        tokenType: 'Bearer',
        username: activeSession.username,
        displayName: activeSession.displayName,
        expiresInSeconds: 900,
        role: activeSession.role,
        roleName: activeSession.roleName,
        privilegeCodes: activeSession.privilegeCodes,
        systemAdmin: activeSession.systemAdmin,
      },
    }
  }

  if (pathname.includes('/api/v1/auth/me')) {
    return {
      status: 200,
      data: {
        username: activeSession.username,
        displayName: activeSession.displayName,
        role: activeSession.role,
        roleName: activeSession.roleName,
        privilegeCodes: activeSession.privilegeCodes,
        systemAdmin: activeSession.systemAdmin,
      },
    }
  }

  if (pathname.includes('/api/v1/admin/users')) {
    if (method === 'GET') {
      return apiOk([
        {
          id: 'mock-user-1',
          username: activeSession.username,
          displayName: activeSession.displayName,
          active: true,
          systemAdmin: true,
          useCustomPrivileges: false,
          roleCode: 'SYSTEM_ADMIN',
          roleName: 'System administrator',
          privilegeCodes: MOCK_ALL_PRIVILEGES,
          effectivePrivilegeCodes: MOCK_ALL_PRIVILEGES,
        },
      ])
    }
    if (method === 'POST' || method === 'PUT') {
      return apiOk({
        id: 'mock-user-2',
        username: body.username || 'new-user',
        displayName: body.displayName || 'New user',
        active: true,
        systemAdmin: false,
        useCustomPrivileges: Boolean(body.useCustomPrivileges),
        privilegeCodes: body.privilegeCodes || [],
        effectivePrivilegeCodes: body.privilegeCodes || [],
      })
    }
    if (method === 'DELETE') {
      return { status: 204, data: null }
    }
  }

  if (pathname.includes('/api/v1/admin/audit-events') && method === 'GET') {
    const now = Date.now()
    return apiOk({
      content: [
        {
          id: 1,
          occurredAt: new Date(now - 3600000).toISOString(),
          actorUsername: activeSession.username,
          action: 'LOGIN',
          moduleKey: 'auth',
          summary: 'Successful login',
          ipAddress: '127.0.0.1',
        },
        {
          id: 2,
          occurredAt: new Date(now - 1200000).toISOString(),
          actorUsername: activeSession.username,
          action: 'UPDATE',
          moduleKey: 'admin_users',
          summary: 'Updated user karunakaran',
          ipAddress: '127.0.0.1',
        },
        {
          id: 3,
          occurredAt: new Date(now - 600000).toISOString(),
          actorUsername: activeSession.username,
          action: 'UPDATE',
          moduleKey: 'content_news',
          summary: 'PATCH /api/v1/admin/news/mock-item-1',
          ipAddress: '127.0.0.1',
        },
      ],
      totalElements: 2,
      totalPages: 1,
      number: 0,
      size: 25,
    })
  }

  if (pathname.includes('/api/v1/admin/roles')) {
    if (method === 'GET') {
      return apiOk([
        {
          id: 'mock-role-1',
          code: 'CONTENT_CREATOR',
          name: 'Content creator',
          builtIn: true,
          privilegeCodes: ['CMS_CONTENT_NEWS_VIEW', 'CMS_CONTENT_NEWS_CREATE', 'CMS_CONTENT_NEWS_EDIT'],
        },
        {
          id: 'mock-role-2',
          code: 'CONTENT_VIEWER',
          name: 'Content viewer',
          builtIn: true,
          privilegeCodes: ['CMS_CONTENT_NEWS_VIEW', 'CMS_CONTENT_NEWS_DOWNLOAD'],
        },
      ])
    }
    if (method === 'POST' || method === 'PUT') {
      return apiOk({
        id: 'mock-role-new',
        code: body.code || 'CUSTOM_ROLE',
        name: body.name || 'Custom role',
        builtIn: false,
        privilegeCodes: body.privilegeCodes || [],
      })
    }
  }

  if (pathname.includes('/api/v1/admin/privileges')) {
    return apiOk(
      MOCK_ALL_PRIVILEGES.map((code) => ({
        code,
        name: code.replace(/_/g, ' '),
        moduleKey: code.split('_')[1]?.toLowerCase() || 'cms',
        action: code.split('_').pop(),
      })),
    )
  }

  if (pathname.includes('/api/v1/auth/refresh') && method === 'POST') {
    return {
      status: 200,
      data: {
        accessToken: `mock-token-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`,
        tokenType: 'Bearer',
        username: activeSession.username,
        displayName: activeSession.displayName,
        expiresInSeconds: 900,
      },
    }
  }

  if (pathname.includes('/api/v1/auth/logout')) {
    return { status: 200, data: null }
  }

  if (pathname.includes('/api/v1/auth/change-password') && method === 'POST') {
    if (!body.currentPassword || !body.newPassword) {
      return { status: 400, data: { success: false, message: 'Current and new password are required' } }
    }
    return { status: 200, data: null }
  }

  if (pathname.includes('/api/v1/content/news')) {
    return apiOk([])
  }

  if (pathname.includes('/api/v1/media/upload') && method === 'POST') {
    return apiOk({
      url: `/api/v1/media/files/images/mock-${Date.now()}.png`,
      originalFileName: 'upload.png',
      contentType: 'image/png',
      sizeBytes: 1024,
    })
  }

  if (pathname.includes('/api/v1/content/banners')) {
    return apiOk([
      {
        id: 1,
        heading: 'KRAN Consulting',
        title: 'Simple IT Solutions for Overall Transformation',
        imagePath: '/kran/about/about-us-4.jpg',
        activeStatus: 'Y',
      },
    ])
  }

  if (pathname.includes('/api/v1/admin/news')) {
    if (method === 'GET') {
      return apiOk([])
    }
    if (method === 'POST' || method === 'PUT') {
      return apiOk({ id: 1, title: body.title || 'Mock news', activeStatus: 'Y' })
    }
    if (method === 'DELETE') {
      return { status: 204, data: null }
    }
  }

  if (pathname.includes('/api/v1/admin/banners')) {
    if (method === 'GET') {
      return apiOk([])
    }
    if (method === 'POST' || method === 'PUT') {
      return apiOk({
        id: 1,
        title: body.title || 'Mock banner',
        activeStatus: 'Y',
      })
    }
    if (method === 'DELETE') {
      return { status: 204, data: null }
    }
  }

  if (pathname.includes('/api/v1/admin/contacts') && method === 'GET') {
    return apiOk([])
  }

  if (pathname.includes('/api/v1/engagement') && method === 'GET') {
    return apiOk({ service: 'engagement-service', contactPath: '/api/v1/contact' })
  }

  if (pathname.includes('/api/v1/catalog/products')) {
    return apiOk([])
  }

  if (pathname.includes('/api/v1/services')) {
    return apiOk([])
  }

  if (pathname.includes('/api/v1/solutions')) {
    return apiOk([])
  }

  if (pathname.includes('/api/v1/jobs') || pathname.includes('/api/v1/careers')) {
    return apiOk([])
  }

  if (pathname.includes('/api/v1/contact') && method === 'POST') {
    return apiOk({ id: 1 })
  }

  return {
    status: 501,
    data: {
      success: false,
      message: `No website-backend mock for ${method} ${pathname}`,
    },
  }
}