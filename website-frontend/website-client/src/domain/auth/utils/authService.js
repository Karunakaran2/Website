export function validateLoginCredentials({ username, password }) {
  return Boolean(username.trim() && password.trim())
}
