import { describe, it, expect } from 'vitest'
import { handleMockRequest } from './mockRouter'

describe('Standalone Mock Router API Suite', () => {
  it('generates mock captcha', async () => {
    const res = await handleMockRequest('/api/v1/captcha/getCaptcha')
    expect(res.status).toBe(200)
    expect(res.data.captchaId).toBeDefined()
    expect(res.data.imageBase64).toContain('data:image/svg+xml;base64,')
  })

  it('authenticates user and returns session', async () => {
    const res = await handleMockRequest('/api/v1/login/loginUser', {
      method: 'POST',
      body: JSON.stringify({ username: 'admin', password: 'password', captcha: 'test' }),
    })
    expect(res.status).toBe(200)
    expect(res.data.username).toBe('admin')
    expect(res.data.accessToken).toBeDefined()
  })

  it('provides seat allocation list and sets seat', async () => {
    const seatsRes = await handleMockRequest('/api/v1/seat-context/getHierarchySetupByUserId')
    expect(seatsRes.status).toBe(200)
    expect(Array.isArray(seatsRes.data)).toBe(true)
    expect(seatsRes.data.length).toBeGreaterThan(0)

    const setRes = await handleMockRequest('/api/v1/seat-context/updateSeatUserAlloted', {
      method: 'POST',
      body: JSON.stringify({ seatUserAllotedIdMask: 'seat-hq-fin-01' }),
    })
    expect(setRes.status).toBe(200)
    expect(setRes.data.seatSelected).toBe(true)
  })

  it('provides dashboard cards and charts', async () => {
    const cardsRes = await handleMockRequest('/api/v1/dashboard/getDashboardCardList')
    expect(cardsRes.status).toBe(200)
    expect(cardsRes.data.length).toBeGreaterThan(0)

    const chartsRes = await handleMockRequest('/api/v1/dashboard/getDashboardChartList')
    expect(chartsRes.status).toBe(200)
    expect(Array.isArray(chartsRes.data)).toBe(true)
    expect(chartsRes.data[0].labels).toBeDefined()
  })

  it('provides voucher approval workflow list', async () => {
    const approvalRes = await handleMockRequest('/api/v1/journal/workflow/search', {
      method: 'POST',
      body: JSON.stringify({ draw: 1, start: 0, length: 10 }),
    })
    expect(approvalRes.status).toBe(200)
    expect(approvalRes.data.draw).toBe(1)
    expect(Array.isArray(approvalRes.data.data)).toBe(true)
  })

  it('provides budget heads and budget vs actual', async () => {
    const headsRes = await handleMockRequest('/api/v1/heads/search', {
      method: 'POST',
      body: JSON.stringify({ draw: 1, start: 0, length: 10 }),
    })
    expect(headsRes.status).toBe(200)
    expect(Array.isArray(headsRes.data.data)).toBe(true)

    const vsActualRes = await handleMockRequest('/api/v1/budget-vs-actual/getBudgetVsActualList')
    expect(vsActualRes.status).toBe(200)
    expect(Array.isArray(vsActualRes.data)).toBe(true)
  })

  it('provides setup entities (offices, cost centres, HOA, banks, numbering)', async () => {
    const officesRes = await handleMockRequest('/api/v1/office-setup/getOfficeSetupList')
    expect(officesRes.status).toBe(200)
    expect(Array.isArray(officesRes.data)).toBe(true)

    const hoaRes = await handleMockRequest('/api/v1/hoa-setup/getHoaSetupList')
    expect(hoaRes.status).toBe(200)
    expect(Array.isArray(hoaRes.data)).toBe(true)

    const banksRes = await handleMockRequest('/api/v1/bank-setup/getBankSetupList')
    expect(banksRes.status).toBe(200)
    expect(Array.isArray(banksRes.data)).toBe(true)
  })

  it('provides reporting ledgers and books', async () => {
    const dayBookRes = await handleMockRequest('/api/reporting/v1/day-book/getDayBookReportByDateRange')
    expect(dayBookRes.status).toBe(200)
    expect(Array.isArray(dayBookRes.data)).toBe(true)

    const trialBalanceRes = await handleMockRequest('/api/reporting/v1/trial-balance/getTrialBalanceByDateRange')
    expect(trialBalanceRes.status).toBe(200)
    expect(Array.isArray(trialBalanceRes.data)).toBe(true)
  })

  it('handles asset management endpoints', async () => {
    const faGroupRes = await handleMockRequest('/api/v1/fixed-asset-group/getFixedAssetGroupList')
    expect(faGroupRes.status).toBe(200)
    expect(Array.isArray(faGroupRes.data)).toBe(true)
  })
})
