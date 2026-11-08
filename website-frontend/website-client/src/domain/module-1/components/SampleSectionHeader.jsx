import PropTypes from 'prop-types'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'

/**
 * In-page section — Probity FormProfileSection chrome (e.g. “Sales voucher information”).
 * Wrap section content as children; optional description renders below the band.
 */
export default function SampleSectionHeader({
  title,
  icon = null,
  description = null,
  action = null,
  children,
  className = '',
  bodyClassName = '',
  sectionId,
}) {
  return (
    <ModuleInnerCard
      title={title}
      icon={icon}
      headerTrailing={action}
      sectionId={sectionId}
      className={className}
      bodyClassName={bodyClassName}
    >
      {description ? (
        <p className="mb-4 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      ) : null}
      {children}
    </ModuleInnerCard>
  )
}

SampleSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  description: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  sectionId: PropTypes.string,
}
