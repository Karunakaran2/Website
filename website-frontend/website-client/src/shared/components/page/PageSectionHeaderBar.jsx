import PageSectionHeader from './PageSectionHeader'
import { PAGE_SECTION_HEADER_SHELL_CLASS } from './pageHeaderStyles'

export default function PageSectionHeaderBar({ className = '', ...headerProps }) {
  return (
    <div className={`${PAGE_SECTION_HEADER_SHELL_CLASS} ${className}`.trim()}>
      <PageSectionHeader {...headerProps} className="w-full" />
    </div>
  )
}
