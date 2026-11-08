import { lazy, Suspense } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'
import { BodyText } from '@/shared/components/typography'
import { DASHBOARD_CHART_GRID_CLASS } from '../constants/dashboardStyles'
const DashboardChartWidget = lazy(() => import('./DashboardChartWidget'))

function ChartWidgetSkeleton() {
  return (
    <div className={`${PAGE_SECTION_SHELL_CLASS} flex min-h-[360px] flex-col gap-4 p-4`}>
      <SkeletonBlock className="h-5 w-48 max-w-[60%]" />
      <SkeletonBlock className="min-h-[280px] flex-1 w-full rounded-md" />
    </div>
  )
}

function SortableChartItem({ chart, editMode, onHide, onColorChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: chart.widgetKey, disabled: !editMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={editMode ? 'overflow-visible' : undefined}>
      <Suspense fallback={<ChartWidgetSkeleton />}>
        <DashboardChartWidget
          chart={chart}
          editMode={editMode}
          onHide={onHide}
          onColorChange={onColorChange}
          dragHandleProps={editMode ? { ...attributes, ...listeners } : undefined}
        />
      </Suspense>
    </div>
  )
}

export default function DashboardChartGrid({
  charts = [],
  isLoading = false,
  editMode = false,
  onHide,
  onColorChange,
  onReorder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  if (isLoading) {
    return (
      <div className={DASHBOARD_CHART_GRID_CLASS} aria-busy="true" aria-label="Loading charts">
        {Array.from({ length: 2 }).map((_, index) => (
          <ChartWidgetSkeleton key={`dashboard-chart-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  if (!charts.length) {
    return (
      <div className={`${PAGE_SECTION_SHELL_CLASS} px-4 py-8 text-center`}>
        <BodyText className="text-slate-600">No data available in table</BodyText>
      </div>
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }
    onReorder?.(String(active.id), String(over.id))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={charts.map((chart) => chart.widgetKey)}
        strategy={rectSortingStrategy}
      >
        <div className={DASHBOARD_CHART_GRID_CLASS}>
          {charts.map((chart) => (
            <SortableChartItem
              key={chart.widgetKey || chart.widgetName}
              chart={chart}
              editMode={editMode}
              onHide={onHide}
              onColorChange={onColorChange}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
