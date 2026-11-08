/**
 * Shared layout for live previews and variant grids in the Component Workbench.
 * Import these in demo/doc tab files — do not hand-roll one-off flex rows on each page.
 */
export const WORKBENCH_PREVIEW_ROW_CLASS =
  'flex min-w-0 flex-wrap items-center gap-3'

export const WORKBENCH_PREVIEW_GRID_CLASS =
  'grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'

/** @deprecated Prefer WorkbenchDemoSection (FormProfileSection) for titled demo blocks. */
export const WORKBENCH_SECTION_CARD_CLASS =
  'rounded-xl border border-slate-200 bg-white p-6 shadow-xs'
