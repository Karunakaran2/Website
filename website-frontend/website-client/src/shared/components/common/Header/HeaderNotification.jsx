import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, CheckCheck, Clock, ExternalLink, X } from 'lucide-react'
import { getModuleRoute } from '@/shared/constants'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Capital Sanction Approved',
    message: 'Sanction proposal #SAN-2026-0042 for IT Infrastructure has been approved by Finance Secretary.',
    timestamp: '10 mins ago',
    unread: true,
    targetPath: getModuleRoute('data-display', 'tables'),
  },
  {
    id: 'notif-2',
    title: 'Audit Verification Pending',
    message: 'Annual fixed asset physical verification report requires your supervisory review.',
    timestamp: '1 hour ago',
    unread: true,
    targetPath: getModuleRoute('sample-dashboard', 'overview'),
  },
  {
    id: 'notif-3',
    title: 'Component Library Update',
    message: 'GIGW 3.0 / WCAG 2.2 AA compliant status chips and data tables published to Component Workbench.',
    timestamp: '3 hours ago',
    unread: true,
    targetPath: getModuleRoute('actions', 'buttons'),
  },
  {
    id: 'notif-4',
    title: 'Leave Request Approved',
    message: 'Casual leave application for 24-Oct-2026 was sanctioned by the Reporting Officer.',
    timestamp: 'Yesterday',
    unread: false,
    targetPath: getModuleRoute('hrms-directory', 'overview'),
  },
]

/** Notification control with dynamic badge and accessible dropdown panel */
export default function HeaderNotification({ theme = 'dark' }) {
  const navigate = useNavigate()
  const isLight = theme === 'light'
  const iconColor = isLight ? 'text-gray-600 dark:text-gray-400' : 'text-white'
  const hoverBg = isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
  const borderClass = isLight ? 'border-gray-200' : 'border-white/20'
  const roundIconBtn = `relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border ${borderClass} ${hoverBg} transition-colors focus:outline-none focus:ring-2 focus:ring-[#f5c518]`

  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter((n) => n.unread).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })))
  }

  const handleItemClick = (item) => {
    markAsRead(item.id)
    setOpen(false)
    if (item.targetPath) {
      navigate(item.targetPath)
    }
  }

  const badgeLabel = unreadCount > 99 ? '99+' : String(unreadCount)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${roundIconBtn} ${iconColor}`}
        title="Notifications"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg
          className={`h-8 w-8 p-1 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 z-10 inline-flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full border-2 border-white bg-[#e11d48] px-1 text-[10px] font-bold leading-none text-white shadow-[0_0_0_2px_rgba(225,29,72,0.25)] animate-pulse"
            aria-hidden="true"
          >
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {/* Accessible Notifications Popover Panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Notifications panel"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden animate-fadeIn text-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Notifications</span>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-[#01458e] px-2 py-0.5 text-[11px] font-semibold text-white">
                  {unreadCount} unread
                </span>
              ) : null}
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[11px] font-medium text-[#01458e] hover:underline cursor-pointer"
              >
                <CheckCheck size={13} />
                <span>Mark all as read</span>
              </button>
            ) : null}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Bell size={32} className="mb-2 stroke-1 opacity-50" />
                <p className="text-xs font-medium">No notifications</p>
                <p className="text-[11px] text-slate-400 mt-0.5">You are completely caught up!</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`group relative flex cursor-pointer items-start gap-3 p-3.5 transition-colors ${
                    item.unread
                      ? 'bg-blue-50/40 hover:bg-blue-50/70'
                      : 'hover:bg-slate-50'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleItemClick(item)
                    }
                  }}
                >
                  {/* Unread indicator */}
                  <div className="mt-1 flex shrink-0 items-center justify-center">
                    {item.unread ? (
                      <span className="h-2 w-2 rounded-full bg-[#01458e] ring-2 ring-blue-100" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs truncate ${
                          item.unread
                            ? 'font-bold text-slate-900'
                            : 'font-semibold text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="flex items-center gap-1 shrink-0 text-[10px] text-slate-400">
                        <Clock size={10} />
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>

                    {item.targetPath ? (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#01458e] opacity-80 group-hover:opacity-100">
                        <span>View Details</span>
                        <ExternalLink size={10} />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Probity System Notifications</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
