import { MODULE_PAGE_CONTENT_CLASS } from '@/shared/constants/moduleLayoutStyles'

/** Standard inner layout for module card body (SPFO voucher form spacing). */
export default function ModulePageContent({ children, className = '' }) {
  return (
    <div className={`${MODULE_PAGE_CONTENT_CLASS} ${className}`.trim()}>{children}</div>
  )
}
