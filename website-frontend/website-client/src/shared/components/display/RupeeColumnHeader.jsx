/**
 * Table column title with Indian Rupee mark (GIGW listing).
 * Inline flow keeps ₹ and label in one header cell (no flex bleed into adjacent columns).
 */
export default function RupeeColumnHeader({ label, className = '' }) {
  return (
    <span
      className={`inline whitespace-normal break-normal [overflow-wrap:normal] [word-break:normal] leading-snug ${className}`.trim()}
    >
      <span className="font-normal text-slate-600 dark:text-slate-400" aria-hidden>
        ₹{' '}
      </span>
      <span>{label}</span>
    </span>
  )
}
