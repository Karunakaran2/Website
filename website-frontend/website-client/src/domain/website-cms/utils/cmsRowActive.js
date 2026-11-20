import { NEWS_ACTIVE_STATUS } from '@/domain/website-content/constants/newsRequest'

/** @param {Record<string, unknown>} row */
export function isCmsRowActive(row) {
  if (typeof row?.active === 'boolean') {
    return row.active
  }
  const status = row?.activeStatus
  if (status === NEWS_ACTIVE_STATUS.NO || status === 'N' || status === 'NO') {
    return false
  }
  if (status === NEWS_ACTIVE_STATUS.YES || status === 'Y' || status === 'YES') {
    return true
  }
  return true
}

/** @param {Record<string, unknown>} row */
export function nextCmsActiveStatus(row) {
  return isCmsRowActive(row) ? NEWS_ACTIVE_STATUS.NO : NEWS_ACTIVE_STATUS.YES
}