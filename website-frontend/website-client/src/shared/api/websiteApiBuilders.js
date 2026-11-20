import { requestJson } from '@/shared/api/client'
import { normalizeWebsiteJson } from '@/shared/api/websiteApiResponse'

/** GET with `ApiResponse` envelope unwrap. */
export async function websiteGet(path, fallbackMessage) {
  return normalizeWebsiteJson(await requestJson(path), fallbackMessage)
}

/** JSON mutating request with envelope unwrap. */
export async function websiteMutate(path, method, body, fallbackMessage) {
  return normalizeWebsiteJson(
    await requestJson(path, {
      method,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
    fallbackMessage,
  )
}

/** Raw JSON (auth login, refresh, me). */
export async function websiteRaw(path, options) {
  return requestJson(path, options)
}