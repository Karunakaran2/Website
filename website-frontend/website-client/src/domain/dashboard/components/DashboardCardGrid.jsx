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
import { DASHBOARD_METRIC_GRID_CLASS } from '../constants/dashboardStyles'
import DashboardMetricCard from './DashboardMetricCard'

function MetricCardSkeleton() {
  return (
    <div className={`${PAGE_SECTION_SHELL_CLASS} relative min-h-[132px] overflow-hidden`}>
      <SkeletonBlock className="absolute inset-y-0 left-0 w-1 rounded-none" />
      <div className="flex h-full min-h-[132px] flex-col gap-3 p-4 pl-5">
        <SkeletonBlock className="h-4 w-2/3 max-w-[180px]" />
        <SkeletonBlock className="h-8 w-1/2 max-w-[120px]" />
        <SkeletonBlock className="mt-auto h-3 w-1/3 max-w-[96px]" />
      </div>
    </div>
  )
}

function SortableCardItem({ card, editMode, onHide, onColorChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.widgetKey, disabled: !editMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={editMode ? 'overflow-visible' : undefined}>
      <DashboardMetricCard
        card={card}
        editMode={editMode}
        onHide={onHide}
        onColorChange={onColorChange}
        dragHandleProps={editMode ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  )
}

export default function DashboardCardGrid({
  cards = [],
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
      <div className={DASHBOARD_METRIC_GRID_CLASS} aria-busy="true" aria-label="Loading metrics">
        {Array.from({ length: 5 }).map((_, index) => (
          <MetricCardSkeleton key={`dashboard-card-skeleton-${index}`} />
        ))}
      </div>
    )
  }

  if (!cards.length) {
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
      <SortableContext items={cards.map((card) => card.widgetKey)} strategy={rectSortingStrategy}>
        <div className={DASHBOARD_METRIC_GRID_CLASS}>
          {cards.map((card) => (
            <SortableCardItem
              key={card.widgetKey || card.widgetName}
              card={card}
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
