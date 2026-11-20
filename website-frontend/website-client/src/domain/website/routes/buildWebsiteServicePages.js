import { buildKranAdminPages } from '@/domain/website-cms/routes/buildKranAdminPages'

/** Dashboard page registry — legacy KRAN Admin menu structure. */
export function buildWebsiteServicePages() {
  return buildKranAdminPages()
}