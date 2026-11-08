import { EyeOff } from 'lucide-react'
import { GigwIconButton } from '@/shared/components/buttons'
import { DASHBOARD_WIDGET_SHELL_CLASS } from '../constants/dashboardStyles'
import { formLabelClass } from '@/shared/components/typography'

export default function DashboardMetricCard({
  card,
  editMode = false,
  onHide,
  onColorChange,
  dragHandleProps,
}) {
  const accent = card?.color || '#01458e'

  return (
    <article
      className={`${DASHBOARD_WIDGET_SHELL_CLASS} relative min-h-[132px] ${
        editMode
          ? 'cursor-grab ring-1 ring-[#01458e]/30 active:cursor-grabbing'
          : ''
      }`}
      data-widget-key={card?.widgetKey}
      {...(editMode ? dragHandleProps : {})}
    >
      <div
        className="absolute inset-y-0 left-0 w-1 bg-[#01458e]"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="flex h-full min-h-[132px] flex-col p-4 pl-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <h3 className={`${formLabelClass} !mb-0 uppercase tracking-[0.04em] text-slate-700`}>
            {card?.widgetName || card?.widgetKey}
          </h3>
          {editMode ? (
            <div className="flex shrink-0 items-center gap-1.5 overflow-visible pt-1">
              <GigwIconButton
                type="button"
                icon={EyeOff}
                tone="destructive"
                context="table"
                tooltip="Hide widget"
                aria-label={`Hide ${card?.widgetName || card?.widgetKey}`}
                onClick={(event) => {
                  event.stopPropagation()
                  onHide?.(card?.widgetKey)
                }}
              />
              <label
                className="relative inline-flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-[6px] border border-[#d1d5db] bg-white"
                title="Change color"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <span
                  className="h-4 w-4 rounded-full border border-slate-300"
                  style={{ backgroundColor: accent }}
                />
                <input
                  type="color"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={`Change color for ${card?.widgetName || card?.widgetKey}`}
                  value={/^#[0-9A-Fa-f]{6}$/.test(accent) ? accent : '#01458e'}
                  onChange={(event) => onColorChange?.(card?.widgetKey, event.target.value)}
                />
              </label>
            </div>
          ) : null}
        </div>
        <p className="m-0 text-[20px] font-bold leading-tight text-[#01458e]">
          {card?.displayValue ?? '₹ 0.00'}
        </p>
      </div>
    </article>
  )
}
