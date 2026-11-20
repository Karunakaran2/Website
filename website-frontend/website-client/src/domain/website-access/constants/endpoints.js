/** auth-service admin APIs */
export const ACCESS_ENDPOINTS = {
  adminUsers: '/api/v1/admin/users',
  adminUserById: (id) => `/api/v1/admin/users/${encodeURIComponent(id)}`,
  adminRoles: '/api/v1/admin/roles',
  adminRoleById: (id) => `/api/v1/admin/roles/${encodeURIComponent(id)}`,
  privilegeCatalog: '/api/v1/admin/privileges',
}