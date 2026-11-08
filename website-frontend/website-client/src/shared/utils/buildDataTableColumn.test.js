/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { dataTableActionColumn, dataTableColumn } from './buildDataTableColumn'

describe('buildDataTableColumn', () => {
  it('derives accessor from id when cell is not provided', () => {
    expect(dataTableColumn({ id: 'employee' })).toEqual({
      id: 'employee',
      accessor: 'employee',
    })
  })

  it('keeps explicit header and accessor', () => {
    expect(
      dataTableColumn({ id: 'id', header: 'Request ID', accessor: 'id', minWidth: 90 }),
    ).toMatchObject({ header: 'Request ID', accessor: 'id' })
  })

  it('builds action column with hideable false', () => {
    const col = dataTableActionColumn({ cell: () => null })
    expect(col.id).toBe('action')
    expect(col.hideable).toBe(false)
    expect(col.headerClassName).toBeTruthy()
  })
})
