import {
  GIGW_ICON_BOX_CLASS,
  GIGW_ICON_BTN_BASE,
  GIGW_ICON_SIZE,
  GIGW_ICON_TONE_CLASS,
  GIGW_TABLE_ICON_BTN_CLASS,
} from './gigwButtonStyles'
import ActionIconTooltip from './ActionIconTooltip'

/**
 * GIGW action icon button (.seepz-icon-btn) — 36×36, bordered, tone hover.
 * Pass `tooltip` or `title` for a styled hover label (native title is not used).
 */
export default function GigwIconButton({
  icon: Icon,
  tone = 'info',
  iconSize = GIGW_ICON_SIZE,
  type = 'button',
  className = '',
  disabled = false,
  tooltip,
  title,
  /** @type {'default' | 'table'} */
  context = 'default',
  /** Convenience alias — applied as native `aria-label` (not `ariaLabel`). */
  ariaLabel,
  'aria-label': ariaLabelKebab,
  ...rest
}) {
  if (!Icon) {
    return null
  }

  const tooltipLabel = tooltip ?? title
  const toneClass = GIGW_ICON_TONE_CLASS[tone] ?? GIGW_ICON_TONE_CLASS.info
  const accessibleName = ariaLabel ?? ariaLabelKebab ?? tooltipLabel

  const button = (
    <button
      type={type}
      disabled={disabled}
      className={`${GIGW_ICON_BTN_BASE} ${toneClass} ${
        context === 'table' ? GIGW_TABLE_ICON_BTN_CLASS : ''
      } ${className}`.trim()}
      aria-label={accessibleName}
      {...rest}
    >
      <span
        className={GIGW_ICON_BOX_CLASS}
        style={{ width: iconSize, height: iconSize }}
      >
        <Icon size={iconSize} strokeWidth={2} aria-hidden />
      </span>
    </button>
  )

  if (!tooltipLabel) {
    return button
  }

  return (
    <ActionIconTooltip label={tooltipLabel}>
      <span className="inline-flex">{button}</span>
    </ActionIconTooltip>
  )
}
