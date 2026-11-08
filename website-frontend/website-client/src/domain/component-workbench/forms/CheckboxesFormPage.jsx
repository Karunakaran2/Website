import { useState, useRef, useEffect } from 'react'
import { ActionButton } from '@/shared/components/buttons'
import { formCheckboxControlClass } from '@/shared/components/typography/typographyStyles'

export default function CheckboxesFormPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    inApp: true,
  })

  const [permissions, setPermissions] = useState({
    viewLedger: true,
    editVoucher: true,
    approvePayment: false,
    exportReports: false,
  })

  const [termsAccepted, setTermsAccepted] = useState(false)
  const selectAllRef = useRef(null)

  const permKeys = Object.keys(permissions)
  const allSelected = permKeys.every((k) => permissions[k])
  const noneSelected = permKeys.every((k) => !permissions[k])
  const isIndeterminate = !allSelected && !noneSelected

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate
    }
  }, [isIndeterminate])

  const handleSelectAll = (checked) => {
    const next = {}
    permKeys.forEach((k) => {
      next[k] = checked
    })
    setPermissions(next)
  }

  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleReset = () => {
    setNotifications({ email: true, sms: false, inApp: true })
    setPermissions({ viewLedger: true, editVoucher: false, approvePayment: false, exportReports: false })
    setTermsAccepted(false)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard Checkboxes</h2>
          <p className="mt-1 text-xs text-slate-500">
            Conforms to GIGW accessibility standards: 20×20px minimum bounding dimension, high contrast Navy Blue accent (#01458e), and clear focus indicators.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              className={formCheckboxControlClass}
            />
            <div>
              <span className="text-[13px] font-semibold text-slate-800 group-hover:text-slate-900">
                Email Dispatch Notifications
              </span>
              <p className="text-[11px] text-slate-500">
                Transmit instant dispatch receipts to the designated nodal officer.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={notifications.sms}
              onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
              className={formCheckboxControlClass}
            />
            <div>
              <span className="text-[13px] font-semibold text-slate-800 group-hover:text-slate-900">
                SMS Transaction Alerts
              </span>
              <p className="text-[11px] text-slate-500">
                Receive high-priority OTP and voucher authorization alerts via mobile SMS.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={notifications.inApp}
              onChange={(e) => setNotifications({ ...notifications, inApp: e.target.checked })}
              className={formCheckboxControlClass}
            />
            <div>
              <span className="text-[13px] font-semibold text-slate-800 group-hover:text-slate-900">
                In-App Dashboard Toast Banners
              </span>
              <p className="text-[11px] text-slate-500">
                Render non-blocking interactive snackbars for successful data updates.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Select All & Indeterminate State</h2>
          <p className="mt-1 text-xs text-slate-500">
            Supports tri-state checkbox behavior (checked, unchecked, and indeterminate) for bulk item selection.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className={formCheckboxControlClass}
                aria-checked={isIndeterminate ? 'mixed' : allSelected}
              />
              <span className="text-[13px] font-bold text-slate-900">
                Select All System Privileges ({permKeys.filter((k) => permissions[k]).length}/{permKeys.length})
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.viewLedger}
                onChange={() => togglePermission('viewLedger')}
                className={formCheckboxControlClass}
              />
              <span className="text-[13px] text-slate-700">View General Ledger</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.editVoucher}
                onChange={() => togglePermission('editVoucher')}
                className={formCheckboxControlClass}
              />
              <span className="text-[13px] text-slate-700">Create & Edit Vouchers</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.approvePayment}
                onChange={() => togglePermission('approvePayment')}
                className={formCheckboxControlClass}
              />
              <span className="text-[13px] text-slate-700">Authorize Statutory Payments</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permissions.exportReports}
                onChange={() => togglePermission('exportReports')}
                className={formCheckboxControlClass}
              />
              <span className="text-[13px] text-slate-700">Export Audit Reports (Excel/PDF)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Mandatory Certification & Disabled States</h2>
          <p className="mt-1 text-xs text-slate-500">
            Terms confirmation with required mark and disabled states.
          </p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className={formCheckboxControlClass}
            />
            <div>
              <span className="text-[13px] font-semibold text-slate-800">
                I certify that all ledger information entered is verified against primary audit vouchers{' '}
                <span className="text-rose-600 font-bold">*</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Statutory audit compliance requirement under Kerala Financial Code.
              </p>
            </div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
              <input
                type="checkbox"
                disabled
                checked
                className={formCheckboxControlClass}
              />
              <span className="text-[13px] text-slate-600">Locked System Role (Checked & Disabled)</span>
            </label>

            <label className="flex items-center gap-3 cursor-not-allowed opacity-60">
              <input
                type="checkbox"
                disabled
                checked={false}
                className={formCheckboxControlClass}
              />
              <span className="text-[13px] text-slate-600">Restricted Feature (Unchecked & Disabled)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ActionButton variant="primary" onClick={() => alert('Checkbox states saved!')}>
          Save Preferences
        </ActionButton>
        <ActionButton variant="reset" onClick={handleReset}>
          Reset Checkboxes
        </ActionButton>
      </div>
    </div>
  )
}
