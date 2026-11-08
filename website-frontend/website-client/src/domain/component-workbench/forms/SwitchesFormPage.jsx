import { useState } from 'react'
import { ActionButton } from '@/shared/components/buttons'
import { SwitchControl } from '@/shared/components/forms'
import { showAppToast } from '@/shared/components'

export default function SwitchesFormPage() {
  const [switches, setSwitches] = useState({
    auditClosureLock: true,
    twoFactorAuth: true,
    autoBackup: false,
    debugMode: false,
    emailAlerts: true,
    smsAlerts: false,
    statutoryReminders: true,
  })

  const handleReset = () => {
    setSwitches({
      auditClosureLock: true,
      twoFactorAuth: true,
      autoBackup: false,
      debugMode: false,
      emailAlerts: true,
      smsAlerts: false,
      statutoryReminders: true,
    })
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard Toggle Switches</h2>
          <p className="mt-1 text-xs text-slate-500">
            Shared <code className="font-mono">SwitchControl</code> — WAI-ARIA switch pattern with keyboard toggling and navy active fill (#01458e).
          </p>
        </div>

        <div className="divide-y divide-slate-100 max-w-2xl">
          <SwitchControl
            id="switch-audit"
            label="Year-End Financial Audit Closure Lock"
            description="Prevents further backdated voucher alterations for the closed financial year."
            checked={switches.auditClosureLock}
            onChange={(val) => setSwitches({ ...switches, auditClosureLock: val })}
          />

          <SwitchControl
            id="switch-2fa"
            label="Enforce Two-Factor Authentication (2FA) for DDOs"
            description="Requires biometric or TOTP OTP authorization for disbursement vouchers."
            checked={switches.twoFactorAuth}
            onChange={(val) => setSwitches({ ...switches, twoFactorAuth: val })}
          />

          <SwitchControl
            id="switch-backup"
            label="Automated Nightly Cloud Backup"
            description="Schedules encrypted database snapshots to the State Data Centre repository."
            checked={switches.autoBackup}
            onChange={(val) => setSwitches({ ...switches, autoBackup: val })}
          />

          <SwitchControl
            id="switch-reminders"
            label="Statutory Tax Due Date Reminders"
            description="Dispatches automated reminders 3 days prior to TDS / GST filing cutoff."
            checked={switches.statutoryReminders}
            onChange={(val) => setSwitches({ ...switches, statutoryReminders: val })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Switch Sizing Options</h2>
          <p className="mt-1 text-xs text-slate-500">
            Available in Small (sm), Medium (md - default), and Large (lg) display variants.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
          <SwitchControl
            id="size-sm"
            label="Small Switch"
            size="sm"
            checked={switches.emailAlerts}
            onChange={(val) => setSwitches({ ...switches, emailAlerts: val })}
          />

          <SwitchControl
            id="size-md"
            label="Medium Switch (Default)"
            size="md"
            checked={switches.emailAlerts}
            onChange={(val) => setSwitches({ ...switches, emailAlerts: val })}
          />

          <SwitchControl
            id="size-lg"
            label="Large Switch"
            size="lg"
            checked={switches.emailAlerts}
            onChange={(val) => setSwitches({ ...switches, emailAlerts: val })}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Disabled & Immutable States</h2>
          <p className="mt-1 text-xs text-slate-500">
            Demonstrates active-disabled and inactive-disabled states where user modification is locked.
          </p>
        </div>

        <div className="divide-y divide-slate-100 max-w-2xl">
          <SwitchControl
            id="disabled-active"
            label="System Maintenance Mode (Locked Active)"
            description="Enforced by platform administrator during scheduled data migration."
            checked
            disabled
            onChange={() => {}}
          />

          <SwitchControl
            id="disabled-inactive"
            label="Legacy Tally Integration Port (Locked Inactive)"
            description="Feature decommissioned in compliance with direct treasury API migration."
            checked={false}
            disabled
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ActionButton
          variant="primary"
          onClick={() => showAppToast('Switch configuration saved.', 'success', { action: 'save' })}
        >
          Save Configuration
        </ActionButton>
        <ActionButton variant="reset" onClick={handleReset}>
          Reset Defaults
        </ActionButton>
      </div>
    </div>
  )
}
