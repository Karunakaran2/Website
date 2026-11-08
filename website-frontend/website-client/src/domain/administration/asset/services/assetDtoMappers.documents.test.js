import { describe, expect, it } from 'vitest'
import {
  assetInformationDocumentsFromRow,
  assetInformationDtoToRow,
} from './assetDtoMappers'

describe('assetInformationDocumentsFromRow', () => {
  it('maps documentInfoList from get-by-id DTO row', () => {
    const row = assetInformationDtoToRow({
      idMask: '4',
      documentInfoList: [
        {
          id: 2,
          documentType: 'I',
          documentNumber: '3',
          documentAmount: 100,
          openAmount: 50,
          capitalizationAmount: 50,
        },
      ],
    })
    const lines = assetInformationDocumentsFromRow(row)
    expect(lines).toHaveLength(1)
    expect(lines[0].documentNumber).toBe('3')
    expect(lines[0].documentAmount).toBe('100')
  })

  it('returns empty for search list row without documents', () => {
    const listRow = assetInformationDtoToRow({
      idMask: '4',
      documentInfoList: null,
    })
    expect(assetInformationDocumentsFromRow(listRow)).toHaveLength(0)
  })
})
