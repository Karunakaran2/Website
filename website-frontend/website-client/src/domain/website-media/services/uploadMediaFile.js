import { requestFormData } from '@/shared/api/client'
import { normalizeWebsiteJson } from '@/shared/api/websiteApiResponse'
import { MEDIA_ENDPOINTS } from '../constants/endpoints'

/**
 * @param {File} file
 * @param {{ kind?: 'image' | 'document' | 'file' }} [options]
 */
export async function uploadMediaFile(file, options = {}) {
  const formData = new FormData()
  formData.append('file', file)
  if (options.kind) {
    formData.append('kind', options.kind)
  }
  return normalizeWebsiteJson(
    await requestFormData(MEDIA_ENDPOINTS.upload, formData),
    'Upload failed',
  )
}

export function resolveMediaPublicUrl(pathOrUrl) {
  if (!pathOrUrl) {
    return ''
  }
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }
  if (pathOrUrl.startsWith('/')) {
    return pathOrUrl
  }
  return `/${pathOrUrl}`
}