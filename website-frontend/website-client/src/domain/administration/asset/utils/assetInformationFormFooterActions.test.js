import { describe, expect, it } from 'vitest'
import {
  canEditAssetInformationFromList,
  resolveAssetInformationFormFooterActions,
} from './assetInformationFormFooterActions'

describe('asset information footer actions', () => {
  it('enables approve only after verified', () => {
    expect(resolveAssetInformationFormFooterActions({ status: 'I', hasId: true }).showApprove).toBe(
      false,
    )
    expect(resolveAssetInformationFormFooterActions({ status: 'S', hasId: true }).showApprove).toBe(
      false,
    )
    expect(resolveAssetInformationFormFooterActions({ status: 'V', hasId: true }).showApprove).toBe(
      true,
    )
    expect(resolveAssetInformationFormFooterActions({ status: 'A', hasId: true }).showApprove).toBe(
      false,
    )
  })

  it('stops update, submit, and forward after verify or approve', () => {
    const verified = resolveAssetInformationFormFooterActions({ status: 'V', hasId: true })
    const approved = resolveAssetInformationFormFooterActions({ status: 'A', hasId: true })

    for (const actions of [verified, approved]) {
      expect(actions.showUpdate).toBe(false)
      expect(actions.showSubmit).toBe(false)
      expect(actions.showForward).toBe(false)
    }

    const submitted = resolveAssetInformationFormFooterActions({ status: 'S', hasId: true })
    expect(submitted.showUpdate).toBe(true)
    expect(submitted.showForward).toBe(true)
    expect(submitted.showVerify).toBe(true)
    expect(submitted.showSubmit).toBe(false)
  })

  it('shows verify and update on saved draft when capabilities absent', () => {
    const draft = resolveAssetInformationFormFooterActions({ status: 'I', hasId: true })
    expect(draft.showSubmit).toBe(false)
    expect(draft.showUpdate).toBe(true)
    expect(draft.showVerify).toBe(true)
    expect(draft.showForward).toBe(true)
  })

  it('shows verify on initiated draft when forward allowed but verify flag false', () => {
    const draft = resolveAssetInformationFormFooterActions({
      status: 'I',
      hasId: true,
      canForward: true,
      canVerify: false,
      canSubmit: true,
    })
    expect(draft.showVerify).toBe(true)
    expect(draft.showSubmit).toBe(true)
    expect(draft.showForward).toBe(true)
  })

  it('shows verify not submit on self-service draft from server', () => {
    const draft = resolveAssetInformationFormFooterActions({
      status: 'I',
      hasId: true,
      canVerify: true,
      canSubmit: false,
      canForward: true,
    })
    expect(draft.showVerify).toBe(true)
    expect(draft.showSubmit).toBe(false)
    expect(draft.showForward).toBe(true)
    expect(draft.showUpdate).toBe(true)
  })

  it('list edit for I, S, and V (approve step)', () => {
    expect(canEditAssetInformationFromList('I')).toBe(true)
    expect(canEditAssetInformationFromList('S')).toBe(true)
    expect(canEditAssetInformationFromList('V')).toBe(true)
    expect(canEditAssetInformationFromList('A')).toBe(false)
  })

  it('list edit for I uses server capabilities when present', () => {
    expect(
      canEditAssetInformationFromList({ status: 'I', canForward: false, canVerify: false }),
    ).toBe(false)
    expect(
      canEditAssetInformationFromList({ status: 'I', canForward: true, canVerify: false }),
    ).toBe(true)
    expect(canEditAssetInformationFromList({ status: 'I', canVerify: true })).toBe(true)
  })

  it('list edit uses capabilities when present', () => {
    expect(
      canEditAssetInformationFromList({ status: 'S', canForward: false, canVerify: false }),
    ).toBe(false)
    expect(
      canEditAssetInformationFromList({ status: 'S', canForward: true, canVerify: false }),
    ).toBe(true)
    expect(canEditAssetInformationFromList({ status: 'V', canApprove: true })).toBe(true)
    expect(canEditAssetInformationFromList({ status: 'V', canApprove: false })).toBe(false)
  })

  it('hides update and workflow when submitted and forwarded out', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'S',
      hasId: true,
      canForward: false,
      canVerify: false,
    })
    expect(actions.showUpdate).toBe(false)
    expect(actions.showForward).toBe(false)
    expect(actions.showVerify).toBe(false)
  })

  it('hides forward when capability not explicitly true', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'S',
      hasId: true,
      canForward: false,
      canVerify: false,
    })
    expect(actions.showForward).toBe(false)
  })

  it('shows approve on verified edit modal when server allows', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'V',
      hasId: true,
      canApprove: true,
    })
    expect(actions.showApprove).toBe(true)
    expect(actions.showUpdate).toBe(false)
    expect(actions.readOnlyForm).toBe(true)
  })

  it('hides approve when server denies capability on verified', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'V',
      hasId: true,
      canApprove: false,
    })
    expect(actions.showApprove).toBe(false)
  })

  it('shows verify for submitter self-service without forward', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'S',
      hasId: true,
      canVerify: true,
      canForward: true,
    })
    expect(actions.showVerify).toBe(true)
    expect(actions.showForward).toBe(true)
    expect(actions.showUpdate).toBe(true)
  })

  it('hides verify when server denies verify on submitted row', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'S',
      hasId: true,
      canForward: true,
      canVerify: false,
    })
    expect(actions.showVerify).toBe(false)
    expect(actions.showForward).toBe(true)
  })

  it('shows approve on verified when server allows', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'V',
      hasId: true,
      canApprove: true,
    })
    expect(actions.showApprove).toBe(true)
    expect(actions.showVerify).toBe(false)
    expect(actions.showUpdate).toBe(false)
  })

  it('hides workflow on submitted when server denies both forward and verify', () => {
    const actions = resolveAssetInformationFormFooterActions({
      status: 'S',
      hasId: true,
      canForward: false,
      canVerify: false,
    })
    expect(actions.showVerify).toBe(false)
    expect(actions.showForward).toBe(false)
    expect(actions.showUpdate).toBe(false)
  })
})
