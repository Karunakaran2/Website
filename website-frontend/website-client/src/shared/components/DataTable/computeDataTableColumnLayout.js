import { DATATABLE_EXPAND_COLUMN_ID } from './dataTableColumnConfig'

/**
 * Priority-based column packing for responsive DataTable (no horizontal scroll).
 */

function sumMinWidth(columns) {
  return columns.reduce((sum, col) => sum + col.minWidth, 0)
}

function sumAssignedWidths(widths) {
  return Object.values(widths).reduce((sum, w) => sum + w, 0)
}

/**
 * Assign widths: fixed mins first, then distribute leftover up to each column's maxWidth.
 */
export function assignMainColumnWidths({
  orderedMainColumns = [],
  containerWidth = 0,
  expandColumnWidth = 44,
  showExpandColumn = false,
}) {
  const widths = {}
  if (!orderedMainColumns.length || containerWidth <= 0) {
    return widths
  }

  const expandReserve = showExpandColumn ? expandColumnWidth : 0
  if (showExpandColumn) {
    widths[DATATABLE_EXPAND_COLUMN_ID] = expandColumnWidth
  }

  orderedMainColumns.forEach((col) => {
    if (col.isExpandColumn) return
    widths[col.columnId] = col.minWidth
  })

  const flexible = orderedMainColumns.filter(
    (col) => !col.pinned && !col.isExpandColumn,
  )

  let remaining =
    containerWidth - expandReserve - sumAssignedWidths(widths)

  if (remaining <= 0 || flexible.length === 0) {
    return widths
  }

  const slots = flexible.map((col) => ({
    columnId: col.columnId,
    maxWidth: col.maxWidth ?? col.minWidth,
    growScore: Math.max(0, col.growScore ?? 0),
    room: Math.max(0, (col.maxWidth ?? col.minWidth) - col.minWidth),
  }))

  let guard = 0
  while (remaining > 0 && guard < 48) {
    guard += 1
    const active = slots.filter((slot) => slot.room > 0)
    if (active.length === 0) break

    const weightTotal = active.reduce(
      (sum, slot) => sum + slot.room * (slot.growScore + 1),
      0,
    )
    let distributed = 0

    active.forEach((slot) => {
      const weight = slot.room * (slot.growScore + 1)
      const share =
        weightTotal > 0
          ? Math.min(slot.room, Math.floor((remaining * weight) / weightTotal))
          : 0
      if (share <= 0) return
      widths[slot.columnId] += share
      slot.room -= share
      distributed += share
    })

    if (distributed === 0) {
      const slot = active.sort((a, b) => b.growScore - a.growScore)[0]
      const add = Math.min(slot.room, remaining)
      widths[slot.columnId] += add
      slot.room -= add
      distributed = add
    }

    remaining -= distributed
  }

  let slack = containerWidth - sumAssignedWidths(widths)
  if (slack > 0) {
    const growable = slots
      .filter((slot) => widths[slot.columnId] < slot.maxWidth)
      .sort((a, b) => b.growScore - a.growScore)
    growable.forEach((slot) => {
      if (slack <= 0) return
      const room = slot.maxWidth - widths[slot.columnId]
      const add = Math.min(room, slack)
      widths[slot.columnId] += add
      slack -= add
    })
  }

  const assigned = sumAssignedWidths(widths)
  if (assigned > 0 && assigned !== containerWidth) {
    const ids = Object.keys(widths)
    const scale = containerWidth / assigned
    let roundedTotal = 0
    ids.forEach((id, index) => {
      const scaled =
        index === ids.length - 1
          ? containerWidth - roundedTotal
          : Math.round(widths[id] * scale)
      widths[id] = scaled
      roundedTotal += scaled
    })
  }

  return widths
}

export function computeDataTableColumnLayout({
  columns = [],
  containerWidth = 0,
  expandColumnWidth = 44,
}) {
  const enabled = columns.filter((col) => col.manuallyVisible !== false)
  const pinned = enabled.filter((col) => col.pinned)
  const flexible = enabled
    .filter((col) => !col.pinned)
    .sort((a, b) => a.priority - b.priority || a.columnId.localeCompare(b.columnId))

  const effectiveWidth = containerWidth > 0 ? containerWidth : 1200
  const pinnedWidth = sumMinWidth(pinned)

  const pack = (reserveExpand) => {
    const expandReserve = reserveExpand ? expandColumnWidth : 0
    let budget = effectiveWidth - pinnedWidth - expandReserve
    const mainFlexible = []
    const overflow = []
    for (const col of flexible) {
      if (budget >= col.minWidth) {
        mainFlexible.push(col)
        budget -= col.minWidth
      } else {
        overflow.push(col)
      }
    }
    return { mainFlexible, overflow, expandReserve }
  }

  let { mainFlexible, overflow } = pack(false)
  if (overflow.length > 0) {
    ;({ mainFlexible, overflow } = pack(true))
  }

  const tighten = () => {
    let flex = [...mainFlexible]
    let over = [...overflow]
    const reserve = over.length > 0 ? expandColumnWidth : 0
    while (
      flex.length > 0
      && pinnedWidth + sumMinWidth(flex) + reserve > effectiveWidth
    ) {
      over.unshift(flex.pop())
    }
    return { mainFlexible: flex, overflow: over }
  }

  if (effectiveWidth > 0) {
    ;({ mainFlexible, overflow } = tighten())
  }

  const showExpandColumn = overflow.length > 0
  const mainIds = new Set([...pinned, ...mainFlexible].map((col) => col.columnId))
  const overflowIds = overflow.map((col) => col.columnId)
  const mainColumnIds = enabled
    .map((col) => col.columnId)
    .filter((id) => mainIds.has(id))
  const overflowColumnIds = enabled
    .map((col) => col.columnId)
    .filter((id) => overflowIds.includes(id))

  const orderedMainMetas = mainColumnIds
    .map((id) => {
      const col = enabled.find((c) => c.columnId === id)
      return col
        ? {
            columnId: id,
            minWidth: col.minWidth,
            maxWidth: col.maxWidth ?? col.minWidth,
            pinned: col.pinned,
            growScore: col.growScore ?? 0,
          }
        : null
    })
    .filter(Boolean)

  const columnWidths =
    effectiveWidth > 0
      ? assignMainColumnWidths({
          orderedMainColumns: orderedMainMetas,
          containerWidth: effectiveWidth,
          expandColumnWidth,
          showExpandColumn,
        })
      : {}

  return {
    mainColumnIds,
    overflowColumnIds,
    showExpandColumn,
    columnWidths,
  }
}
