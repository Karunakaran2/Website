import React from 'react'
import PropTypes from 'prop-types'

export default function AssetModuleLayout({ children, className = '' }) {
  return (
    <div className={`w-full space-y-6 ${className}`}>
      {children}
    </div>
  )
}

AssetModuleLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
