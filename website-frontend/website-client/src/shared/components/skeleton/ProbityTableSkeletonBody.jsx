import React from 'react'
import { PROBITY_TABLE_ROW_CLASS, PROBITY_TABLE_TD_CLASS } from '../listing/listingTableStyles'
import { tableAlignClassName } from '../listing/tableColumnAlign'
import SkeletonBlock from './SkeletonBlock'

const WIDTHS = ['w-full', 'w-4/5', 'w-3/5', 'w-2/3', 'w-1/2', 'w-3/4']

function SkeletonCell({ type, rowIdx, colIdx }) {
  if (type === 'index') {
    return <SkeletonBlock className="mx-auto h-4 w-4" />
  }
  if (type === 'chip') {
    return <SkeletonBlock className="h-6 w-20 rounded-full" />
  }
  if (type === 'button') {
    return <SkeletonBlock className="mx-auto h-7 w-16 rounded-md" />
  }
  if (type === 'mono') {
    return <SkeletonBlock className="h-4 w-28 max-w-full" />
  }

  return (
    <SkeletonBlock className={`h-4 ${WIDTHS[(rowIdx + colIdx) % WIDTHS.length]}`} />
  )
}

/** Skeleton tbody rows — matches ProbityDataTable listing tables */
export default function ProbityTableSkeletonBody({
  rows = 6,
  columns = 5,
  columnTypes = [],
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <tr key={`sk-row-${rowIdx}`} className={PROBITY_TABLE_ROW_CLASS}>
          {Array.from({ length: columns }).map((_, colIdx) => {
            const type = columnTypes[colIdx] || 'text'
            const align =
              type === 'index' || type === 'button' ? 'center' : type === 'mono' ? 'right' : 'left'

            return (
              <td
                key={`sk-col-${rowIdx}-${colIdx}`}
                className={`${PROBITY_TABLE_TD_CLASS} ${tableAlignClassName(align)}`.trim()}
              >
                <SkeletonCell type={type} rowIdx={rowIdx} colIdx={colIdx} />
              </td>
            )
          })}
        </tr>
      ))}
    </>
  )
}
