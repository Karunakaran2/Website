import { statusChipClass } from './statusChipStyles'
import { formatStatusLabel } from './statusLabels'

export default function StatusChip({ label, status, className = '' }) {
  const text = formatStatusLabel(label ?? status)
  if (text === '—') {
    return <span className="text-slate-400">—</span>
  }

  return (
    <span className={statusChipClass(text, className)} role="status">
      {text}
    </span>
  )
}
