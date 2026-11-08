import React from 'react'
import PropTypes from 'prop-types'

/** Accessible wrapper for skeleton groups — one polite status message, decorative blocks hidden. */
export default function SkeletonRegion({
  message = 'Loading…',
  children,
  className = '',
  as: Tag = 'div',
}) {
  return (
    <Tag
      className={className}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {children}
      <span className="sr-only">{message}</span>
    </Tag>
  )
}

SkeletonRegion.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
}
