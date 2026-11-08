import { X } from 'lucide-react'
import { GIGW_ADD_ICON, GigwButton, GigwIconButton } from '@/shared/components/buttons'
import { FormProfileSection } from '@/shared/components/forms'
import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'
import { BodyText, formLabelClass } from '@/shared/components/typography'

function HiddenWidgetCard({ widget, onRestore }) {
  const accent = widget.color || '#01458e'

  return (
    <div className={`${PAGE_SECTION_SHELL_CLASS} relative`}>
      <div
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 p-4 pl-5">
        <div className="min-w-0">
          <h4 className={`${formLabelClass} !mb-0 uppercase tracking-[0.04em] text-slate-700`}>
            {widget.widgetName || widget.widgetKey}
          </h4>
          <BodyText className="mt-1 text-slate-600">
            {widget.type === 'card' ? 'Hidden card' : 'Hidden chart'}
          </BodyText>
        </div>
        <GigwButton
          type="button"
          variant="secondary"
          size="sm"
          icon={GIGW_ADD_ICON}
          onClick={() => onRestore?.(widget.widgetKey)}
        >
          Add
        </GigwButton>
      </div>
    </div>
  )
}

export default function DashboardHiddenWidgetsPanel({
  widgets = [],
  isLoading = false,
  onRestore,
  onClose,
}) {
  const cards = widgets.filter((widget) => widget.type === 'card')
  const charts = widgets.filter((widget) => widget.type !== 'card')

  return (
    <FormProfileSection
      title="Add Widgets"
      className="!overflow-visible"
      headerTrailing={
        <GigwIconButton
          type="button"
          icon={X}
          tone="system"
          context="table"
          tooltip="Close"
          aria-label="Close add widgets"
          onClick={onClose}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={`hidden-widget-sk-${index}`} className="h-24 w-full rounded-lg" />
            ))}
            <span className="sr-only">Loading hidden widgets…</span>
          </div>
        ) : null}

        {!isLoading && widgets.length === 0 ? (
          <BodyText className="text-slate-600">No hidden widgets to add.</BodyText>
        ) : null}

        {cards.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((widget) => (
              <HiddenWidgetCard key={widget.widgetKey} widget={widget} onRestore={onRestore} />
            ))}
          </div>
        ) : null}

        {charts.length ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {charts.map((widget) => (
              <HiddenWidgetCard key={widget.widgetKey} widget={widget} onRestore={onRestore} />
            ))}
          </div>
        ) : null}
      </div>
    </FormProfileSection>
  )
}
