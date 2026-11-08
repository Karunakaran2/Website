import { describe, expect, it } from 'vitest'
import { canEditAssetDisposalFromList } from './assetDisposalFormFooterActions'

describe('canEditAssetDisposalFromList', () => {
  it('allows edit for initiated workflow when capability fields are null', () => {
    expect(
      canEditAssetDisposalFromList({
        status: 'N',
        workflowStatus: 'I',
        canForward: null,
        canVerify: null,
        canSubmit: null,
      }),
    ).toBe(true)
  })

  it('allows edit for initiated workflow when canSubmit is true', () => {
    expect(
      canEditAssetDisposalFromList({
        status: 'N',
        workflowStatus: 'I',
        canSubmit: true,
        canForward: false,
        canVerify: false,
      }),
    ).toBe(true)
  })

  it('denies edit for initiated workflow when capabilities are explicitly false', () => {
    expect(
      canEditAssetDisposalFromList({
        status: 'N',
        workflowStatus: 'I',
        canSubmit: false,
        canForward: false,
        canVerify: false,
      }),
    ).toBe(false)
  })

  it('denies edit when finally approved', () => {
    expect(
      canEditAssetDisposalFromList({
        status: 'A',
        workflowStatus: 'A',
        canVerify: true,
      }),
    ).toBe(false)
  })

  it('denies edit when workflow is submitted', () => {
    expect(
      canEditAssetDisposalFromList({
        status: 'N',
        workflowStatus: 'S',
        canForward: true,
        canVerify: false,
      }),
    ).toBe(false)
  })
})
