import { ModuleSectionSubtitle, ModuleSectionTitle } from '@/shared/components/typography'
import { PAGE_SECTION_BADGE_CLASS } from './pageHeaderStyles'
import {
  PAGE_SECTION_HEADER_ACTIONS_CLASS,
  PAGE_SECTION_HEADER_GRID_CLASS,
  PAGE_SECTION_HEADER_SUBTITLE_CLASS,
  PAGE_SECTION_HEADER_TITLE_COLUMN_CLASS,
  PAGE_SECTION_HEADER_TITLE_TEXT_CLASS,
} from './pageHeaderLayoutStyles'

export default function PageSectionHeader({
  title,
  subtitle,
  count,
  countLabel = 'Records',
  badge,
  badgeClassName = PAGE_SECTION_BADGE_CLASS,
  actions,
  trailing,
  className = '',
}) {
  const countBadge =
    typeof count === 'number' ? (
      <span className={badgeClassName}>
        {count} {count === 1 ? countLabel.replace(/s$/, '') : countLabel}
      </span>
    ) : null

  const trailingNode = trailing ?? badge ?? countBadge
  const hasTrailing = trailingNode != null || actions != null

  return (
    <div className={`${PAGE_SECTION_HEADER_GRID_CLASS} ${className}`.trim()}>
      <div className={PAGE_SECTION_HEADER_TITLE_COLUMN_CLASS}>
        <div className="min-w-0 max-w-full">
          <ModuleSectionTitle className={PAGE_SECTION_HEADER_TITLE_TEXT_CLASS}>
            {title}
          </ModuleSectionTitle>
          {subtitle ? (
            <ModuleSectionSubtitle className={PAGE_SECTION_HEADER_SUBTITLE_CLASS}>
              {subtitle}
            </ModuleSectionSubtitle>
          ) : null}
        </div>
      </div>

      {hasTrailing ? (
        <div className={PAGE_SECTION_HEADER_ACTIONS_CLASS}>
          {trailingNode}
          {actions}
        </div>
      ) : null}
    </div>
  )
}
