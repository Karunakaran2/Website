import React from 'react'
import PropTypes from 'prop-types'

/**
 * SampleModuleLayout
 * Clean content container for Sample Module pages.
 * Renders directly inside the existing application content area without
 * duplicate tab navigation or artificial width constraints, matching Probity standards.
 */
export default function SampleModuleLayout({ children, className = '' }) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {children}
    </div>
  )
}

SampleModuleLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  activeTab: PropTypes.string,
}

