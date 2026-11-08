import React from 'react'
import PropTypes from 'prop-types'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'

export default function HrmsLayout({ actions, children }) {
  return (
    <div className="space-y-5">
      {actions ? <DashboardPageHeaderActions>{actions}</DashboardPageHeaderActions> : null}
      {children}
    </div>
  )
}

HrmsLayout.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
}
