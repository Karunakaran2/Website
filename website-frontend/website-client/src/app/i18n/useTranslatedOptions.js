import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function useTranslatedOptions(options = []) {
  const { t } = useTranslation()

  return useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: t(`form.option.${String(option.value || 'empty')}`, {
          defaultValue: option.label,
        }),
      })),
    [options, t],
  )
}
