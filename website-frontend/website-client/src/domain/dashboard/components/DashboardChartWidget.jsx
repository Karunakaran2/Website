import { useMemo } from 'react'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { EyeOff } from 'lucide-react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { GigwIconButton } from '@/shared/components/buttons'
import {
  formProfileSectionHeaderClass,
  formProfileSectionTitleClass,
} from '@/shared/components/forms/formProfileSectionStyles'
import { BodyText } from '@/shared/components/typography'
import { DASHBOARD_WIDGET_SHELL_CLASS } from '../constants/dashboardStyles'
import { buildChartJsConfig } from '../utils/dashboardChartConfig'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
)

export default function DashboardChartWidget({
  chart,
  editMode = false,
  onHide,
  onColorChange,
  dragHandleProps,
}) {
  const config = useMemo(() => buildChartJsConfig(chart), [chart])
  const ChartComponent =
    config.type === 'pie' ? Pie : config.type === 'line' ? Line : Bar
  const accent = chart?.color || '#01458e'

  return (
    <article
      className={`${DASHBOARD_WIDGET_SHELL_CLASS} ${
        editMode ? 'cursor-grab ring-1 ring-[#01458e]/30 active:cursor-grabbing' : ''
      }`}
      data-widget-key={chart?.widgetKey}
      {...(editMode ? dragHandleProps : {})}
    >
      <div className={`${formProfileSectionHeaderClass} justify-between gap-2`}>
        <h3 className={formProfileSectionTitleClass}>
          {chart?.widgetName || chart?.widgetKey}
        </h3>
        {editMode ? (
          <div className="flex shrink-0 items-center gap-1.5 overflow-visible pt-1">
            <GigwIconButton
              type="button"
              icon={EyeOff}
              tone="destructive"
              context="table"
              tooltip="Hide widget"
              aria-label={`Hide ${chart?.widgetName || chart?.widgetKey}`}
              onClick={(event) => {
                event.stopPropagation()
                onHide?.(chart?.widgetKey)
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
                aria-label={`Change color for ${chart?.widgetName || chart?.widgetKey}`}
                value={/^#[0-9A-Fa-f]{6}$/.test(accent) ? accent : '#01458e'}
                onChange={(event) => onColorChange?.(chart?.widgetKey, event.target.value)}
              />
            </label>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 p-4 lg:flex-row">
        <div className="h-[300px] w-full overflow-visible lg:w-[60%]">
          <ChartComponent data={config.data} options={config.options} />
        </div>
        {config.legendItems?.length ? (
          <div className="custom-scrollbar max-h-[300px] w-full overflow-y-auto lg:w-[40%]">
            {config.legendItems.map((item) => (
              <div key={`${item.label}-${item.color}`} className="mb-2 flex items-start gap-2">
                <span
                  className="mt-1 inline-block h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0 flex-1">
                  <BodyText className="!font-semibold text-slate-800">{item.label}</BodyText>
                  <BodyText className="text-slate-600">{item.valueText}</BodyText>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  )
}
