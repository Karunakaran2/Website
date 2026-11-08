import { useEffect, useMemo, useRef } from 'react'
import { useWatch } from 'react-hook-form'
import { collectErrorPaths } from './formValidationFocus'

/**
 * While the form has field errors, re-validate those paths whenever values change
 * (user input, setValue, field-array replace) so inline messages hide when fixed.
 *
 * Works with both handleSubmit (submitCount) and manual trigger() validation (Purchase, Payment, …).
 * Depends on a values snapshot only — not on `errors` — so trigger() cannot loop.
 */
export function useRevalidateErroredFields({ control, trigger, formState }) {
  const watchedValues = useWatch({ control })
  const errorsRef = useRef(formState.errors)
  errorsRef.current = formState.errors

  const valuesSnapshot = useMemo(() => {
    try {
      return JSON.stringify(watchedValues)
    } catch {
      return ''
    }
  }, [watchedValues])

  const lastRevalidatedSnapshotRef = useRef('')

  useEffect(() => {
    const paths = collectErrorPaths(errorsRef.current)
    if (!paths.length) {
      lastRevalidatedSnapshotRef.current = ''
      return
    }
    if (valuesSnapshot === lastRevalidatedSnapshotRef.current) {
      return
    }
    lastRevalidatedSnapshotRef.current = valuesSnapshot
    void trigger(paths, { shouldFocus: false })
  }, [valuesSnapshot, trigger])
}
