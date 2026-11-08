import { describe, expect, it } from 'vitest'
import { canEditAssetMaintenanceFromList } from './assetMaintenanceFormFooterActions'

describe('canEditAssetMaintenanceFromList', () => {
  it('allows edit for initiated draft when capability fields are null', () => {
    expect(
      canEditAssetMaintenanceFromList({
        approve: 'N',
        workflowStatus: 'I',
        canForward: null,
        canVerify: null,
        canSubmit: null,
      }),
    ).toBe(true)
  })

  it('allows edit for initiated draft when canSubmit is true', () => {
    expect(
      canEditAssetMaintenanceFromList({
        approve: 'N',
        workflowStatus: 'I',
        canSubmit: true,
        canForward: false,
        canVerify: false,
      }),
    ).toBe(true)
  })

  it('denies edit for initiated draft when capabilities are explicitly false', () => {
    expect(
      canEditAssetMaintenanceFromList({
        approve: 'N',
        workflowStatus: 'I',
        canSubmit: false,
        canForward: false,
        canVerify: false,
      }),
    ).toBe(false)
  })

  it('denies edit when finally approved', () => {
    expect(
      canEditAssetMaintenanceFromList({
        approve: 'A',
        workflowStatus: 'A',
        canVerify: true,
      }),
    ).toBe(false)
  })

  it('allows edit on submitted when forward or verify is allowed', () => {
    expect(
      canEditAssetMaintenanceFromList({
        approve: 'N',
        workflowStatus: 'S',
        canForward: true,
        canVerify: false,
      }),
    ).toBe(true)
  })
})
