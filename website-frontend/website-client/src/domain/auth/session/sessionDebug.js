/**
 * Development-only session trace. Never pass tokens, headers, or passwords.
 * Production builds drop the body because import.meta.env.DEV is false.
 */
// export function sessionDebug(event, details = {}) {
//   if (!import.meta.env.DEV) {
//     return
//   }
//   console.info('[session]', event, details)
// }
export function sessionDebug() {}