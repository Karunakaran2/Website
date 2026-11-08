import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertCircle, ChevronDown, User } from 'lucide-react'
import {
  activateFromKeyboard,
  isEscapeKey,
  moveListboxIndex,
} from '@/shared/utils/keyboardUtils'
import { PUBLIC_LOGIN_ACCOUNT_TYPES } from '@/domain/auth/constants/publicLoginAccountTypes'
import LoginPasswordForm from '@/domain/auth/components/login/LoginPasswordForm'
import LoginOtpForm from '@/domain/auth/components/login/LoginOtpForm'
import { ROUTES } from '@/shared/constants'
import { loginFooterLinkClass } from '@/domain/auth/constants/loginFormStyles'

export default function LoginPublicUserFlow({
  login,
  loginMethod,
  setLoginMethod,
  onOpenForgotPassword,
}) {
  const { t } = useTranslation()
  const [selectedType, setSelectedType] = useState('portal')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [accountValidationError, setAccountValidationError] = useState(false)
  const comboboxRef = useRef(null)
  const listboxRef = useRef(null)
  const listboxId = useId()

  const accountTypes = PUBLIC_LOGIN_ACCOUNT_TYPES
  const activeAccount = accountTypes.find((acc) => acc.id === selectedType)
  const selectedIndex = Math.max(
    0,
    accountTypes.findIndex((acc) => acc.id === selectedType),
  )

  useEffect(() => {
    if (!isDropdownOpen) {
      return undefined
    }
    const handlePointerDown = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isDropdownOpen])

  const selectAccountType = (acc) => {
    setSelectedType(acc.id)
    setIsDropdownOpen(false)
    setAccountValidationError(false)
    setHighlightedIndex(accountTypes.findIndex((item) => item.id === acc.id))
  }

  const openDropdown = () => {
    setIsDropdownOpen(true)
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }

  const handleComboboxKeyDown = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault()
      setIsDropdownOpen(false)
      return
    }

    if (!isDropdownOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      openDropdown()
      return
    }

    if (!isDropdownOpen) {
      activateFromKeyboard(event, openDropdown)
      return
    }

    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Home' ||
      event.key === 'End'
    ) {
      event.preventDefault()
      const nextIndex = moveListboxIndex(event.key, highlightedIndex, accountTypes.length)
      setHighlightedIndex(nextIndex)
      listboxRef.current
        ?.querySelector(`[data-option-index="${nextIndex}"]`)
        ?.scrollIntoView?.({ block: 'nearest' })
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const option = accountTypes[highlightedIndex]
      if (option) {
        selectAccountType(option)
      }
    }
  }

  const handleRequireAccountSelection = () => {
    setAccountValidationError(true)
    setIsDropdownOpen(true)
  }

  const identifierLabel =
    activeAccount?.identifierLabel ?? 'INDoS/ CDC Number/ Mobile Number'
  const identifierPlaceholder =
    activeAccount?.identifierPlaceholder ?? 'Enter the INDoS/ CDC Number/ Mobile Number'

  return (
    <div className="w-full space-y-5">
      <div className="relative z-30" ref={comboboxRef}>
        <span id={`${listboxId}-label`} className="sr-only">
          {t('login.chooseAccount', 'Choose an Account')}
        </span>
        <button
          type="button"
          role="combobox"
          aria-labelledby={`${listboxId}-label`}
          aria-controls={listboxId}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
          onClick={() => (isDropdownOpen ? setIsDropdownOpen(false) : openDropdown())}
          onKeyDown={handleComboboxKeyDown}
          className={`flex min-h-11 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5 text-left transition sm:min-h-[52px] sm:gap-3 sm:px-4 sm:py-3 ${
            accountValidationError ? 'border-red-400 ring-1 ring-red-200' : 'border-[#0D2EAB]'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#263AB5]">
              {selectedType && activeAccount ? (
                <img src={activeAccount.icon} alt="" className="h-5 w-5 object-contain" />
              ) : (
                <User className="h-4 w-4" aria-hidden />
              )}
            </span>
            <div className="min-w-0">
              <span className="block truncate font-noto text-sm font-semibold text-slate-900">
                {selectedType && activeAccount
                  ? t(activeAccount.title)
                  : t('login.chooseAccount', 'Choose an Account')}
              </span>
              <span className="block truncate text-[11px] text-slate-500">
                {selectedType && activeAccount
                  ? t(activeAccount.description)
                  : t(
                      'login.chooseAccountHint',
                      'Select the account type you want to continue with',
                    )}
              </span>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-[#263AB5] transition ${isDropdownOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>

        {accountValidationError && !selectedType ? (
          <div className="mt-2 flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            <AlertCircle size={14} className="shrink-0" aria-hidden />
            {t(
              'login.selectAccountFirst',
              'Please select an account type first to proceed.',
            )}
          </div>
        ) : null}

        {isDropdownOpen ? (
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={`${listboxId}-label`}
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
          >
            {accountTypes.map((acc, idx) => (
              <button
                key={acc.id}
                type="button"
                role="option"
                data-option-index={idx}
                aria-selected={selectedType === acc.id}
                onClick={() => selectAccountType(acc)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-3 py-3 text-left hover:bg-sky-50/80 ${
                  idx !== 0 ? 'border-t border-slate-100' : ''
                } ${highlightedIndex === idx ? 'bg-sky-50/80' : ''}`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <img src={acc.icon} alt="" className="h-5 w-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">
                    {t(acc.title)}
                  </span>
                  <span className="block text-[11px] text-slate-500">{t(acc.description)}</span>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative z-10">
        {loginMethod === 'password' ? (
          <LoginPasswordForm
            login={login}
            identifierLabel={identifierLabel}
            identifierPlaceholder={identifierPlaceholder}
            showOtpOption
            onSwitchToOtp={() => setLoginMethod('otp')}
            onOpenForgotPassword={() => {
              setIsDropdownOpen(false)
              onOpenForgotPassword?.()
            }}
            showNewUserFooter={false}
            onFieldInteraction={() => {
              if (!selectedType) {
                handleRequireAccountSelection()
              }
            }}
          />
        ) : (
          <LoginOtpForm
            identifierLabel={identifierLabel}
            identifierPlaceholder={identifierPlaceholder}
            identifierName={identifierLabel}
            onSwitchToPassword={() => setLoginMethod('password')}
            selectedType={selectedType}
            onRequireAccountSelection={handleRequireAccountSelection}
          />
        )}
      </div>

      <p className="mb-0 pt-2 text-center font-noto text-sm text-[#263AB5]">
        {t('login.newUserQuestion', 'New User?')}{' '}
        <Link to={ROUTES.ONE_TIME_REGISTRATION} className={loginFooterLinkClass}>
          {t('login.oneTimeRegistrationShort', 'One Time Registration')}
        </Link>
      </p>
    </div>
  )
}
