import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isSetupAreaPathname } from '@/shared/constants/moduleRoutes'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildProfileNavigationState } from '@/domain/auth/hooks/useProfileBackNavigation'
import { getSetupNavTo } from '@/app/shell/utils/dashboardNavPaths'
import {
  isHeaderSetupNavAvailable,
  navigateHeaderHome,
  saveSetupReturnRoute,
} from '@/app/shell/utils/setupReturnNav'
import {
  MdOutlineLogout,
  MdOutlinePerson,
  MdOutlineSettings,
  MdSwapHoriz,
} from 'react-icons/md'
import SwitchAccountModal from '@/domain/auth/components/SwitchAccountModal'
import { getSeatSelected } from '@/domain/auth/utils/session'
import HeaderActionDivider from '@/shared/components/common/Header/HeaderActionDivider'
import HeaderNotification from '@/shared/components/common/Header/HeaderNotification'
import { useAuthUser } from '@/domain/auth/hooks/useAuthUser'
import { useLogout } from '@/domain/auth/hooks/useLogout'
import { ROUTES } from '@/shared/constants'

function headerAvatarInitial(user, displayName) {
  const fromInitials = user?.initials?.trim?.()
  if (fromInitials) {
    return fromInitials.charAt(0).toUpperCase()
  }
  const trimmed = displayName.trim()
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?'
}

/**
 * spfo_frontend ModuleUserDropdown — Tailwind classes copied verbatim (module header).
 */
export default function ModuleUserDropdown({
  userName: userNameOverride,
  userRole: userRoleOverride,
  theme = 'dark',
  showHome = true,
}) {
  const isLight = theme === 'light'
  const iconColor = isLight ? 'text-gray-600 dark:text-gray-400' : 'text-white'
  const hoverBg = isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'
  const borderClass = isLight ? 'border-gray-200' : 'border-white/20'

  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false)
  const containerRef = useRef(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const performLogout = useLogout()
  const authUser = useAuthUser()

  const displayName =
    userNameOverride ?? authUser.name ?? authUser.username ?? ''
  const displayRole =
    userRoleOverride ??
    authUser.designation ??
    authUser.postingName ??
    authUser.role ??
    ''
  const avatarInitial = headerAvatarInitial(authUser, displayName)
  const canSwitchAccount = Boolean(authUser?.seatSelected) || getSeatSelected()

  const showSetupNav = useMemo(
    () => isHeaderSetupNavAvailable(location.pathname),
    [location.pathname],
  )

  const handleOpenSetup = useCallback(() => {
    if (!showSetupNav) return
    saveSetupReturnRoute(location)
    navigate(getSetupNavTo())
  }, [location, navigate, showSetupNav])

  const handleNavigateHome = useCallback(() => {
    navigateHeaderHome(navigate, location)
  }, [location, navigate])

  const handleOpenProfile = useCallback(() => {
    const state = buildProfileNavigationState(location)
    navigate(ROUTES.MY_PROFILE, state ? { state } : undefined)
  }, [location, navigate])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setOpen(false)
    void performLogout()
  }

  const menuItems = useMemo(() => {
    const items = [
      {
        id: 'profile',
        icon: <MdOutlinePerson size={16} className="text-blue-500" />,
        labelKey: 'My Profile',
        onClick: () => {
          setOpen(false)
          handleOpenProfile()
        },
      },
    ]
    if (canSwitchAccount) {
      items.push({
        id: 'switch-account',
        icon: <MdSwapHoriz size={16} className="text-[#01458e]" />,
        labelKey: 'Switch Account',
        onClick: () => {
          setOpen(false)
          setSwitchAccountOpen(true)
        },
      })
    }
    if (showSetupNav) {
      items.push({
        id: 'settings',
        icon: <MdOutlineSettings size={16} className="text-purple-500" />,
        labelKey: 'Account Settings',
        onClick: () => {
          setOpen(false)
          handleOpenSetup()
        },
      })
    }
    return items
  }, [canSwitchAccount, handleOpenProfile, handleOpenSetup, showSetupNav])

  const menuItemClass =
    'flex min-h-11 w-full items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left text-[0.875rem] font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer'

  const roundIconBtn = `flex h-10 w-10 items-center justify-center rounded-full border ${borderClass} ${hoverBg} transition-colors`

  const isSetupActive = useMemo(
    () => isSetupAreaPathname(location.pathname),
    [location.pathname],
  )

  const setupButtonClass = isSetupActive
    ? isLight
      ? `${roundIconBtn} border-gray-300 bg-gray-100`
      : `${roundIconBtn} border-white/35 bg-white/15`
    : roundIconBtn

  return (
    <div className="relative flex select-none items-center gap-3">
      {showHome ? (
        <>
          <button
            type="button"
            className={roundIconBtn}
            onClick={handleNavigateHome}
            title={t('Home')}
            aria-label={t('Home')}
          >
            <svg
              className={`h-8 w-8 p-1 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <HeaderActionDivider theme={theme} />
        </>
      ) : null}

      <HeaderNotification theme={theme} />

      {showSetupNav ? (
        <>
          <HeaderActionDivider theme={theme} />

          <button
            type="button"
            className={setupButtonClass}
            onClick={handleOpenSetup}
            title={t('modules.masterSetup')}
            aria-label={t('modules.masterSetup')}
            aria-pressed={isSetupActive}
          >
            <svg
              className={`h-8 w-8 p-1 ${iconColor}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </>
      ) : null}

      <HeaderActionDivider theme={theme} />

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-none bg-transparent text-left transition-colors ${hoverBg}`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Open account menu"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm ${isLight ? 'border-gray-200 bg-gray-100' : 'border-white/20 bg-white dark:bg-slate-800/20'} ${iconColor}`}
          >
            <MdOutlinePerson size={20} />
          </div>

          <div className="hidden min-w-0 flex-col sm:flex">
            <span
              className={`truncate text-[0.75rem] font-semibold leading-tight ${isLight ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}
            >
              {displayName}
            </span>
            <span
              className={`truncate text-[0.625rem] capitalize leading-tight ${isLight ? 'text-gray-500 dark:text-gray-400' : 'text-white/70'}`}
            >
              {displayRole}
            </span>
          </div>

          <div
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isLight ? 'border-gray-300' : 'border-white/25'} transition-colors`}
          >
            <svg
              className={`h-2.5 w-2.5 transition-transform duration-200 ${isLight ? 'text-gray-500 dark:text-gray-400' : 'text-white'} ${open ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {open ? (
          <div
            ref={menuRef}
            role="menu"
            className="probity-header-user-menu absolute right-0 z-[9999] mt-2 w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl animate-fadeIn dark:border-gray-700 dark:bg-slate-800"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-[#0b3d91] to-[#1a6bb5] px-4 py-3 text-white">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[0.875rem] font-bold">
                {avatarInitial}
              </div>
              <div className="min-w-0">
                <p className="m-0 truncate text-[0.875rem] font-semibold leading-tight">{displayName}</p>
                <p className="m-0 truncate text-[0.6875rem] capitalize text-blue-200">{displayRole}</p>
              </div>
            </div>

            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={item.onClick}
                  className={menuItemClass}
                >
                  {item.icon}
                  {t(item.labelKey)}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700" />

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex min-h-11 w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left text-[0.875rem] font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <MdOutlineLogout size={16} className="text-red-500" />
              {t('Logout')}
            </button>
          </div>
        ) : null}
      </div>

      <SwitchAccountModal
        open={switchAccountOpen}
        onClose={() => setSwitchAccountOpen(false)}
      />
    </div>
  )
}
