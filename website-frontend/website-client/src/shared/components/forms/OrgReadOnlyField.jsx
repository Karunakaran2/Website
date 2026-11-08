import { ReadOnlyField } from '@/shared/components/forms'
import { useWatch } from 'react-hook-form'

export default function OrgReadOnlyField({
  control,
  name,
  label,
  placeholder = '',
  showLock = false,
  wrapperClassName = 'min-w-0',
}) {
  const value = useWatch({ control, name })
  const display = value || placeholder || '—'

  return (
    <div className="min-w-0">
      <ReadOnlyField
        label={label}
        value={display}
        showLock={showLock}
        wrapperClassName={wrapperClassName}
      />
    </div>
  )
}
