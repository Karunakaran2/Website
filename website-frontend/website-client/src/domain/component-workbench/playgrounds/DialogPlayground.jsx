import { useState } from 'react'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import {
  PortalModalPrimaryButton,
  PortalModalCancelButton,
} from '@/shared/components/modals/PortalModalButtons'
import ConfirmDialog from '@/shared/components/modals/ConfirmDialog'
import { ActionButton } from '@/shared/components/buttons'
import { InputField } from '@/shared/components/forms'
import { appToast } from '@/shared/components/toast/appToast'
import { AlertTriangle, Info, FileText, CheckCircle2 } from 'lucide-react'

export default function DialogPlayground() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmTone, setConfirmTone] = useState('delete')
  const [portalModalOpen, setPortalModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState('md')
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [tokenName, setTokenName] = useState('')
  const [lastAction, setLastAction] = useState('None yet')

  const handleConfirmAction = () => {
    setConfirmOpen(false)
    setLastAction(`Confirmed ${confirmTone} action`)
    appToast.success(`Confirmed action (${confirmTone}) executed.`)
  }

  const handleSaveToken = () => {
    if (!tokenName.trim()) return
    setFormModalOpen(false)
    setLastAction(`Saved token "${tokenName}"`)
    appToast.success(`Token "${tokenName}" added successfully.`)
    setTokenName('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 rounded-xl bg-white p-5 border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Dialog Trigger Controls (Shared Components)
          </h3>
          <p className="text-xs text-slate-500">
            Launch accessible modals to test focus trapping, keyboard dismissal via Escape, backdrop blur, and ARIA attributes.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">1. ConfirmDialog:</span>
              <div className="flex gap-2">
                <ActionButton
                  variant="delete"
                  className="w-full text-xs"
                  onClick={() => {
                    setConfirmTone('delete')
                    setConfirmOpen(true)
                  }}
                >
                  Destructive Tone
                </ActionButton>
                <ActionButton
                  variant="primary"
                  className="w-full text-xs"
                  onClick={() => {
                    setConfirmTone('submit')
                    setConfirmOpen(true)
                  }}
                >
                  Submit Tone
                </ActionButton>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block mb-1">2. PortalModalShell (Sizes):</span>
              <div className="grid grid-cols-3 gap-2">
                {['sm', 'md', 'lg'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setModalSize(sz)
                      setPortalModalOpen(true)
                    }}
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Size: {sz.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block mb-1">3. Form Entry Modal:</span>
              <ActionButton
                variant="add"
                className="w-full text-xs"
                onClick={() => setFormModalOpen(true)}
              >
                Open Form Modal
              </ActionButton>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">Last Action Outcome:</span>
            <div className="mt-1 rounded bg-slate-100 px-3 py-1.5 text-xs font-mono font-medium text-slate-800">
              {lastAction}
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-7 rounded-xl bg-white p-6 border border-slate-200 shadow-xs text-xs text-slate-600 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Accessibility & Component Architecture
          </h3>
          <ul className="space-y-2 list-disc pl-4 leading-relaxed">
            <li>
              <strong>PortalModalShell:</strong> Always rendered into document <code>#portal-root</code> or body via React Portal, avoiding container overflow and z-index clipping.
            </li>
            <li>
              <strong>Focus Return:</strong> When a dialog closes (via Escape, cancel button, or backdrop click), keyboard focus automatically returns to the triggering button.
            </li>
            <li>
              <strong>Accessible Tones:</strong> <code>ConfirmDialog</code> supports semantic tones: <code>delete</code> (destructive rose accent), <code>submit</code> (primary navy accent), and <code>primary</code>.
            </li>
            <li>
              <strong>Escape Key Dismissal:</strong> Enabled by default across all shared modal components.
            </li>
          </ul>
        </div>
      </div>

      {/* 1. Real ConfirmDialog */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmTone === 'delete' ? 'Delete Record?' : 'Confirm Submission'}
        message={
          confirmTone === 'delete'
            ? 'Are you sure you want to permanently delete this entry?'
            : 'Transmit proposal for financial scrutiny?'
        }
        description="This action will be logged in the audit trail."
        confirmLabel={confirmTone === 'delete' ? 'Yes, Delete' : 'Yes, Submit'}
        cancelLabel="Cancel"
        tone={confirmTone}
        onConfirm={handleConfirmAction}
        onCancel={() => {
          setConfirmOpen(false)
          setLastAction('Cancelled confirm dialog')
        }}
      />

      {/* 2. Real PortalModalShell */}
      {portalModalOpen && (
        <PortalModalShell
          isOpen={portalModalOpen}
          onClose={() => {
            setPortalModalOpen(false)
            setLastAction('Closed info modal')
          }}
          title={`KRAN Design Guidelines (${modalSize.toUpperCase()} View)`}
          icon={<Info className="h-4 w-4 text-[#01458e]" />}
          size={modalSize}
          footer={
            <>
              <PortalModalPrimaryButton
                onClick={() => {
                  setPortalModalOpen(false)
                  setLastAction('Acknowledged info modal')
                }}
              >
                Understood
              </PortalModalPrimaryButton>
              <PortalModalCancelButton
                onClick={() => {
                  setPortalModalOpen(false)
                  setLastAction('Cancelled info modal')
                }}
              >
                Close
              </PortalModalCancelButton>
            </>
          }
        >
          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <p>
              This modal is rendered with <code>PortalModalShell</code> using <code>size=&quot;{modalSize}&quot;</code>.
            </p>
            <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-200">
              <strong className="text-blue-900 block mb-1">Standard Modal Sizing:</strong>
              <p className="text-blue-800 text-[11px]">
                <code>sm</code>: 384px (small alerts), <code>md</code>: 512px (standard forms), <code>lg</code>: 768px (multi-column review drawers), <code>xl</code>: 1024px (complex vouchers).
              </p>
            </div>
            <p>
              Press <kbd className="rounded border border-slate-300 bg-slate-100 px-1 py-0.5 font-mono">Escape</kbd> or click the backdrop to dismiss.
            </p>
          </div>
        </PortalModalShell>
      )}

      {/* 3. Form Modal */}
      {formModalOpen && (
        <PortalModalShell
          isOpen={formModalOpen}
          onClose={() => {
            setFormModalOpen(false)
            setLastAction('Cancelled form modal')
          }}
          title="Add Component Token"
          icon={<FileText className="h-4 w-4 text-[#01458e]" />}
          size="md"
          footer={
            <>
              <PortalModalPrimaryButton
                disabled={!tokenName.trim()}
                onClick={handleSaveToken}
              >
                Save Token
              </PortalModalPrimaryButton>
              <PortalModalCancelButton
                onClick={() => {
                  setFormModalOpen(false)
                  setLastAction('Cancelled form modal')
                }}
              >
                Cancel
              </PortalModalCancelButton>
            </>
          }
        >
          <div className="space-y-3">
            <InputField
              id="pg-token-input"
              name="tokenName"
              label="Token Name"
              required
              placeholder="e.g. --kran-primary-navy"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              hint="Enter standard CSS custom property name."
            />
          </div>
        </PortalModalShell>
      )}
    </div>
  )
}
