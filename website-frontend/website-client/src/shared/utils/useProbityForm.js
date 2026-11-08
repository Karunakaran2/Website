import { useForm } from 'react-hook-form'
import { useRevalidateErroredFields } from './useRevalidateErroredFields'

/**
 * React Hook Form with Probity defaults: validate on submit, re-validate errored fields on change.
 */
export function useProbityForm(options = {}) {
  const { mode = 'onSubmit', reValidateMode = 'onChange', ...rest } = options
  const form = useForm({ mode, reValidateMode, ...rest })

  useRevalidateErroredFields({
    control: form.control,
    trigger: form.trigger,
    formState: form.formState,
  })

  return form
}
