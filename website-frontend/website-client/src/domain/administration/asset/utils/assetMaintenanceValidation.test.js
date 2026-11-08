import { describe, expect, it } from 'vitest'
import { validateAssetMaintenanceForm } from './assetMaintenanceValidation'

describe('validateAssetMaintenanceForm', () => {
  it('requires purchase invoice and maintenance description', () => {
    const errors = validateAssetMaintenanceForm({
      assetInformationIdMask: 'a1',
      maintenanceDateStr: '2026-01-01',
      vendorIdMask: 'v1',
      cost: '100',
    })
    expect(errors.purchaseInvoiceIdMask).toBeTruthy()
    expect(errors.maintenanceDescription).toBeTruthy()
  })
})
