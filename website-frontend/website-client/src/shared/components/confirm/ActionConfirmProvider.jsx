import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '@/shared/components/modals/ConfirmDialog'
import { showAppToast } from '@/shared/components/toast/appToast'
import { getActionConfirmDialogProps } from './actionConfirmDefaults'
import { getActionLoadingLabel } from './actionLoadingLabel'
import { getActionSuccessToastMessage } from './actionSuccessToast'
import { interpretActionResult } from './interpretActionResult'

const CONFIRM_SUCCESS_HOLD_MS = 450

const ActionConfirmContext = createContext(null)

/**
 * Centralized confirmation UI for **meaningful mutations** (save, delete, approve, upload, …).
 *
 * Mount once at app root (`AppProviders.jsx`). Feature code calls `useActionConfirm()` /
 * `useDeleteConfirm()` only at the moment the user commits an irreversible or persisted change.
 *
 * **Do not confirm:** route changes, opening pages or modals, tab switches, search/filter/sort/
 * pagination, selecting rows, or other exploratory navigation — those must stay immediate.
 *
 * **Do confirm:** actions that write, delete, submit for workflow, or otherwise change backend
 * or authoritative local state after the user explicitly chooses Save / Delete / Submit / etc.
 */
export function ActionConfirmProvider({ children, getDialogProps = getActionConfirmDialogProps }) {
  const [pending, setPending] = useState(null)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    if (pending) {
      setPhase('idle')
    }
  }, [pending])

  const requestConfirm = useCallback((runAction, options = {}) => {
    const {
      action = 'delete',
      recordLabel,
      submitLabel,
      stack = 'base',
      successMessage,
      showSuccessToast,
      tone: toneOverride,
      confirmLabel: confirmLabelOverride,
      title: titleOverride,
      message: messageOverride,
      description: descriptionOverride,
      cancelLabel: cancelLabelOverride,
      ...rest
    } = options
    const preset = getDialogProps(action, { recordLabel, submitLabel })
    setPending({
      runAction,
      action,
      stack,
      successMessage,
      showSuccessToast,
      ...rest,
      title: titleOverride ?? preset.title,
      message: messageOverride ?? preset.message,
      description: descriptionOverride ?? preset.description,
      confirmLabel: confirmLabelOverride ?? preset.confirmLabel,
      cancelLabel: cancelLabelOverride ?? preset.cancelLabel,
      tone: toneOverride ?? preset.tone,
    })
  }, [getDialogProps])

  const requestDeleteConfirm = useCallback(
    (runDelete, options = {}) => {
      requestConfirm(runDelete, { action: 'delete', ...options })
    },
    [requestConfirm],
  )

  const close = useCallback(() => {
    if (!loading && phase === 'idle') {
      setPending(null)
    }
  }, [loading, phase])

  const confirm = useCallback(async () => {
    if (!pending?.runAction) {
      return
    }
    setLoading(true)
    setPhase('working')
    try {
      const result = await pending.runAction()
      const outcome = interpretActionResult(result)
      if (!outcome.success) {
        setPhase('idle')
        setPending(null)
        if (outcome.errorMessage && pending.showErrorToast !== false) {
          showAppToast(outcome.errorMessage, 'error')
        }
        return
      }

      setPhase('done')
      await new Promise((resolve) => {
        setTimeout(resolve, CONFIRM_SUCCESS_HOLD_MS)
      })

      const shouldToast = pending.showSuccessToast !== false
      if (shouldToast) {
        const message =
          pending.successMessage ?? getActionSuccessToastMessage(pending.action)
        if (message) {
          showAppToast(message, 'success', { action: pending.action })
        }
      }

      setPending(null)
      setPhase('idle')
    } catch {
      setPhase('idle')
      setPending(null)
      if (pending?.showErrorToast !== false) {
        showAppToast('Something went wrong. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [pending])

  const value = useMemo(
    () => ({
      requestConfirm,
      requestDeleteConfirm,
    }),
    [requestConfirm, requestDeleteConfirm],
  )

  return (
    <ActionConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        key={pending ? `${pending.action}-${pending.confirmLabel}-${pending.tone}` : 'idle'}
        open={Boolean(pending)}
        title={pending?.title ?? 'Confirm'}
        message={pending?.message}
        description={pending?.description}
        confirmLabel={pending?.confirmLabel ?? 'Yes'}
        cancelLabel={pending?.cancelLabel ?? 'Cancel'}
        tone={pending?.tone ?? 'primary'}
        stack={pending?.stack ?? 'base'}
        onConfirm={confirm}
        onCancel={close}
        loading={loading}
        phase={phase}
        loadingLabel={pending ? getActionLoadingLabel(pending.action) : 'Please wait…'}
      />
    </ActionConfirmContext.Provider>
  )
}

export function useActionConfirm() {
  const ctx = useContext(ActionConfirmContext)
  return ctx?.requestConfirm ?? null
}

export function useDeleteConfirm() {
  const ctx = useContext(ActionConfirmContext)
  return ctx?.requestDeleteConfirm ?? null
}
