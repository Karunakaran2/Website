import React from 'react'
import PropTypes from 'prop-types'
import { CheckCircle2, Info } from 'lucide-react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'

export default function TaskLayout({
  actions,
  notification,
  children,
}) {
  return (
    <div className="space-y-5">
      {/* Action buttons passed to dashboard card header actions slot */}
      {actions ? (
        <DashboardPageHeaderActions>
          {actions}
        </DashboardPageHeaderActions>
      ) : null}

      {/* Floating Notification */}
      {notification && (
        <div
          role="status"
          className={`flex items-center gap-2 p-3.5 rounded-lg border text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'info'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {notification.type === 'info' ? (
            <Info className="w-4 h-4 shrink-0 text-blue-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  )
}

TaskLayout.propTypes = {
  actions: PropTypes.node,
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
}
