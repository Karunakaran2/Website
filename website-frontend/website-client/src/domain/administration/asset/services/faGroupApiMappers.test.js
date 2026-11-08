import { describe, expect, it } from 'vitest'
import {
  faGroupPayloadToFixedAssetGroupRequest,
  fixedAssetGroupDtoToListRow,
  numberingSetupOptionDtoToOption,
  pageArrayToFaGroupSearchResult,
  toFaGroupPagingRequest,
} from './faGroupApiMappers'

describe('toFaGroupPagingRequest', () => {
  it('maps list args to DataTables paging body', () => {
    const body = toFaGroupPagingRequest({
      search: 'build',
      page: 2,
      pageSize: 10,
      sortBy: 'assetClassLabel',
      sortDir: 'desc',
    })
    expect(body.start).toBe(10)
    expect(body.length).toBe(10)
    expect(body.search.value).toBe('build')
    expect(body.columns[0].data).toBe('assetClassSetupIt.description')
    expect(body.order[0].dir).toBe('desc')
  })
})

describe('fixedAssetGroupDtoToListRow', () => {
  it('maps backend DTO to UI row', () => {
    const row = fixedAssetGroupDtoToListRow({
      idMask: 'mask-1',
      assetType: 'BUILD',
      assetClassItId: 4,
      assetClassDescription: 'Building',
      numberingGroupId: 20,
      numberingGroupName: 'BLD-NUM-01',
      depreciable: 'Y',
      depreciationRateIt: 10,
      depreciationMethod: 'W',
      depreciationMethodLabel: 'WDV',
      assetAccountName: 'Asset GL',
      depreciationAccountName: 'Dep GL',
      accumDepreciationAccountName: 'Cum GL',
      cwipAccountName: 'CWIP GL',
    })
    expect(row.assetClassLabel).toBe('Building')
    expect(row.assetNumber).toBe('20')
    expect(row.numberingGroupName).toBe('BLD-NUM-01')
    expect(row.assetAccount).toBe('Asset GL')
    expect(row.isActive).toBe(true)
  })
})

describe('faGroupPayloadToFixedAssetGroupRequest', () => {
  it('clears depreciation when not depreciable', () => {
    const body = faGroupPayloadToFixedAssetGroupRequest({
      assetType: 'LAND',
      assetClassItId: '5',
      assetNumber: '12',
      depreciable: 'N',
      depreciationRateIt: '15',
      depreciationMethod: 'W',
    })
    expect(body.depreciable).toBe('N')
    expect(body.depreciationRateIt).toBe(0)
    expect(body.depreciationMethod).toBe('')
    expect(body.numberingGroupId).toBe(12)
  })
})

describe('numberingSetupOptionDtoToOption', () => {
  it('uses numeric id as option value for save payload', () => {
    const opt = numberingSetupOptionDtoToOption({ id: 12, setupName: 'BLD-GRP-01' })
    expect(opt.value).toBe('12')
    expect(opt.label).toBe('BLD-GRP-01')
  })
})

describe('pageArrayToFaGroupSearchResult', () => {
  it('maps PageArray to list query shape', () => {
    const result = pageArrayToFaGroupSearchResult(
      {
        data: [{ idMask: 'm1', assetType: 'A', assetClassDescription: 'B' }],
        recordsFiltered: 1,
      },
      1,
      10,
    )
    expect(result.total).toBe(1)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0].assetType).toBe('A')
  })
})
