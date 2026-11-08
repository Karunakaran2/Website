import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'

/** Dashboard widget shells — allow GIGW tooltips above icon actions (PAGE_SECTION uses overflow-hidden). */
export const DASHBOARD_WIDGET_SHELL_CLASS = `${PAGE_SECTION_SHELL_CLASS} !overflow-visible`

/** Equal spacing between all dashboard widgets (cards, charts, rows). */
export const DASHBOARD_WIDGET_GAP_CLASS = 'gap-4'

export const DASHBOARD_WIDGET_STACK_CLASS = `flex min-w-0 flex-col ${DASHBOARD_WIDGET_GAP_CLASS}`

export const DASHBOARD_METRIC_GRID_CLASS = `grid grid-cols-1 ${DASHBOARD_WIDGET_GAP_CLASS} sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`

export const DASHBOARD_CHART_GRID_CLASS = `grid grid-cols-1 ${DASHBOARD_WIDGET_GAP_CLASS} lg:grid-cols-2 3xl:grid-cols-3`
