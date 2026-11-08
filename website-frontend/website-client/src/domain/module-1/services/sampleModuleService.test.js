import { describe, it, expect, beforeEach } from 'vitest'
import { sampleModuleService } from './sampleModuleService'

describe('sampleModuleService', () => {
  beforeEach(() => {
    sampleModuleService.resetDemoData()
  })

  it('normalizes applicationStatus on records', () => {
    const draft = sampleModuleService.getRecords().find((r) => r.status === 'Draft')
    expect(draft?.applicationStatus).toBe('Draft')
  })

  it('submits draft applications', () => {
    const draftId = 'REC-1006'
    expect(sampleModuleService.submitApplication(draftId).ok).toBe(true)
    const updated = sampleModuleService.getRecords().find((r) => r.id === draftId)
    expect(updated.applicationStatus).toBe('Submitted')
  })
})
