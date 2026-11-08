import React from "react";
import {
  PAGE_SECTION_BODY_CLASS,
  PAGE_SECTION_HEADER_SHELL_CLASS,
  PAGE_SECTION_SHELL_CLASS,
} from "../page/pageHeaderStyles";
import SkeletonBlock from "./SkeletonBlock";
import ProbityTableSkeletonBody from "./ProbityTableSkeletonBody";
import {
  PROBITY_TABLE_CLASS,
  PROBITY_TABLE_HEAD_CLASS,
  PROBITY_TABLE_HEAD_ROW_CLASS,
  PROBITY_TABLE_TH_CLASS,
} from "../listing/listingTableStyles";
import { tableAlignClassName } from "../listing/tableColumnAlign";

function FilterBarSkeleton({ layout }) {
  if (!layout || layout === "none") {
    return null;
  }

  if (layout === "search-type-status") {
    return (
      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700 dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 sm:col-span-2">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-1">
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-1">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (layout === "search-type") {
    return (
      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700 dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 sm:col-span-2">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-1 lg:col-span-2">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (layout === "type-only") {
    return (
      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700 dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1 sm:col-span-2 lg:col-span-2">
          <SkeletonBlock className="h-3 w-32" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (layout === "search-only") {
    return (
      <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700 dark:bg-slate-900/40 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <SkeletonBlock className="h-3 w-12" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (layout === "tabs-toolbar") {
    return (
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
          <SkeletonBlock className="h-9 w-28 rounded-lg" />
          <SkeletonBlock className="h-9 w-32 rounded-lg" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SkeletonBlock className="h-10 w-56 max-w-full rounded-md" />
          <SkeletonBlock className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700 dark:bg-slate-900/40 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`inbox-filter-sk-${index}`} className="space-y-1">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

/**
 * Listing page skeleton — card header, filter bar, record count, ProbityDataTable body.
 */
export default function ProbityTablePageSkeleton({
  filterLayout = "inbox",
  rows = 8,
  columns = 7,
  showRowNumbers = true,
  columnTypes = [],
  className = "",
  message = "Loading list…",
}) {
  const displayColumns = showRowNumbers ? columns : Math.max(columns - 1, columns);
  const bodyColumnTypes = showRowNumbers
    ? columnTypes
    : columnTypes.filter((type) => type !== "index");

  return (
    <div
      className={`${PAGE_SECTION_SHELL_CLASS} flex min-h-0 w-full flex-col font-sans text-left ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`${PAGE_SECTION_HEADER_SHELL_CLASS} flex items-center gap-2`}>
        <SkeletonBlock className="h-3.5 w-3.5 shrink-0 rounded" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-24 sm:w-32" />
          <SkeletonBlock className="h-3 w-52 sm:w-64 max-w-full" />
        </div>
      </div>

      <div className={`${PAGE_SECTION_BODY_CLASS} min-h-0 flex-1`}>
        <FilterBarSkeleton layout={filterLayout} />

        <div className="mb-2 flex items-center gap-1">
          <SkeletonBlock className="h-3 w-16" />
          <SkeletonBlock className="h-3 w-6" />
          <SkeletonBlock className="h-3 w-8" />
          <SkeletonBlock className="h-3 w-14" />
        </div>

        <div className="overflow-auto">
          <table className={PROBITY_TABLE_CLASS}>
            <thead className={PROBITY_TABLE_HEAD_CLASS}>
              <tr className={PROBITY_TABLE_HEAD_ROW_CLASS}>
                {Array.from({ length: displayColumns }).map((_, index) => {
                  const headAlign =
                    index === 0 && showRowNumbers
                      ? "center"
                      : index === displayColumns - 1
                        ? "center"
                        : "left";
                  return (
                  <th
                    key={`table-page-sk-head-${index}`}
                    className={`${PROBITY_TABLE_TH_CLASS} ${tableAlignClassName(headAlign)}`}
                  >
                    <SkeletonBlock
                      className={`h-3 ${index === 0 && showRowNumbers ? "w-4" : index === displayColumns - 1 ? "mx-auto w-12" : "w-20"}`}
                    />
                  </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <ProbityTableSkeletonBody
                rows={rows}
                columns={displayColumns}
                columnTypes={bodyColumnTypes}
              />
            </tbody>
          </table>
        </div>
      </div>

      <span className="sr-only">{message}</span>
    </div>
  );
}
