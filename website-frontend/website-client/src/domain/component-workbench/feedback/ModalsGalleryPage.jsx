import { useState } from 'react'
import ConfirmDialog from '@/shared/components/modals/ConfirmDialog'
import FormModal from '@/shared/components/modals/FormModal'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import { OrgDataDisplay } from '@/shared/components/display'
import { InputField } from '@/shared/components/forms'
import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  PortalModalCancelButton,
  PortalModalPrimaryButton,
} from '@/shared/components/modals/PortalModalButtons'
import { getActionConfirmDialogProps } from '@/shared/components/confirm/actionConfirmDefaults'
import { showAppToast } from '@/shared/components/toast/appToast'
import {
  WORKBENCH_PREVIEW_GRID_CLASS,
  WORKBENCH_PREVIEW_ROW_CLASS,
  WORKBENCH_SECTION_CARD_CLASS,
} from '../constants/workbenchPreviewStyles'

const WORKFLOW_ACTIONS = [
  'save',
  'update',
  'delete',
  'submit',
  'verify',
  'approve',
  'reject',
  'export',
  'upload',
  'activate',
  'deactivate',
]

const SHELL_SIZES = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

export default function ModalsGalleryPage() {
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmPhase, setConfirmPhase] = useState('idle')
  const [lastResult, setLastResult] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [shellOpen, setShellOpen] = useState(false)
  const [shellSize, setShellSize] = useState('md')
  const [draftName, setDraftName] = useState('')

  const confirmProps = confirmAction
    ? getActionConfirmDialogProps(confirmAction, { recordLabel: 'Demo record #WB-001' })
    : null

  const openConfirm = (action) => {
    setConfirmAction(action)
    setConfirmPhase('idle')
    setLastResult('')
  }

  const simulateConfirm = () => {
    setConfirmPhase('working')
    window.setTimeout(() => {
      setConfirmPhase('done')
      window.setTimeout(() => {
        setLastResult(`Confirmed "${confirmAction}" (demo only — no API call)`)
        showAppToast('Demo action confirmed.', 'success', { action: confirmAction === 'delete' ? 'delete' : 'save' })
        setConfirmAction(null)
        setConfirmPhase('idle')
      }, 600)
    }, 900)
  }

  const handleCancelConfirm = () => {
    setLastResult('Confirmation cancelled')
    setConfirmAction(null)
    setConfirmPhase('idle')
  }

  return (
    <div className="space-y-6 pb-12 w-full min-w-0">
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h2 className="text-base font-bold text-slate-900">Modals &amp; dialogs</h2>
        <p className="mt-1 text-[13px] text-slate-600 leading-relaxed">
          Interactive previews of production shared components:{' '}
          <strong>ConfirmDialog</strong>, <strong>FormModal</strong>,{' '}
          <strong>PortalModalShell</strong>, and read-only view modals with{' '}
          <strong>OrgDataDisplay</strong>. Press Escape to dismiss when idle; confirmations do not
          call backend APIs.
        </p>
      </div>

      {/* Confirm presets */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-1">ConfirmDialog (action presets)</h3>
        <p className="text-[13px] text-slate-600 mb-4">
          Copy and button tone come from <code className="text-[12px]">getActionConfirmDialogProps</code>{' '}
          — the same helper used by <code className="text-[12px]">confirmBeforeAction</code> in domain screens.
        </p>
        <div className={`${WORKBENCH_PREVIEW_GRID_CLASS} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2`}>
          {WORKFLOW_ACTIONS.map((action) => (
            <GigwButton
              key={action}
              type="button"
              variant={action === 'delete' || action === 'reject' ? 'danger' : 'primary'}
              className="text-[12px] justify-center"
              onClick={() => openConfirm(action)}
            >
              {action}
            </GigwButton>
          ))}
        </div>
        {lastResult ? (
          <p className="mt-4 text-[12px] text-[#01458e] rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2">
            {lastResult}
          </p>
        ) : null}
      </div>

      {/* Form modal */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-1">FormModal (add / edit)</h3>
        <p className="text-[13px] text-slate-600 mb-4">
          Default list CRUD shell: titled header, scrollable body, Cancel + Save footer aligned with GIGW buttons.
        </p>
        <GigwButton type="button" variant="primary" onClick={() => setFormOpen(true)}>
          Open form modal
        </GigwButton>
        <FormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Add demo master"
          size="4xl"
          primaryLabel="Save"
          onPrimaryClick={() => {
            setFormOpen(false)
            showAppToast('Demo save — modal closed.', 'success', { action: 'save' })
          }}
        >
          <form className="flex flex-col gap-4" id="workbench-form-modal-demo" noValidate>
            <InputField
              label="Name"
              name="name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              required
            />
            <p className="text-[12px] text-slate-500">
              Footer actions use PortalModalCancelButton and PortalModalPrimaryButton inside FormModal.
            </p>
          </form>
        </FormModal>
      </div>

      {/* View modal */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-1">View / details modal (read-only)</h3>
        <p className="text-[13px] text-slate-600 mb-4">
          <code className="text-[12px]">FormModal</code> with <code className="text-[12px]">showFooter=&#123;false&#125;</code>{' '}
          and read-only header variant; body uses OrgDataDisplay (three-column grid).
        </p>
        <GigwButton type="button" variant="outlineUtility" onClick={() => setViewOpen(true)}>
          Open view modal
        </GigwButton>
        <FormModal
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          title="Office setup details"
          size="4xl"
          showFooter={false}
        >
          <OrgDataDisplay
            items={[
              { label: 'Office code', value: 'HO-DEL-01' },
              { label: 'Office name', value: 'Head Office — Delhi' },
              { label: 'Status', value: 'Active' },
              { label: 'GSTIN', value: '07AABCU9603R1ZM' },
              { label: 'Effective from', value: '01-04-2026' },
              { label: 'Last updated', value: '02-11-2026' },
            ]}
          />
        </FormModal>
      </div>

      {/* Portal shell sizes */}
      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-1">PortalModalShell sizes</h3>
        <p className="text-[13px] text-slate-600 mb-4">
          Low-level shell for custom content. Width tokens: sm through 5xl (responsive max viewport).
        </p>
        <div className={`${WORKBENCH_PREVIEW_ROW_CLASS} flex-wrap gap-2`}>
          {SHELL_SIZES.map((size) => (
            <GigwButton
              key={size}
              type="button"
              variant="outlineUtility"
              className="text-[12px]"
              onClick={() => {
                setShellSize(size)
                setShellOpen(true)
              }}
            >
              {size}
            </GigwButton>
          ))}
        </div>
        <PortalModalShell
          isOpen={shellOpen}
          onClose={() => setShellOpen(false)}
          title={`Portal shell — size ${shellSize}`}
          size={shellSize}
          footer={
            <>
              <PortalModalCancelButton type="button" onClick={() => setShellOpen(false)}>
                Close
              </PortalModalCancelButton>
              <PortalModalPrimaryButton type="button" onClick={() => setShellOpen(false)}>
                Done
              </PortalModalPrimaryButton>
            </>
          }
        >
          <p className="text-[13px] text-slate-700 leading-relaxed">
            Custom modal body. Focus is trapped while open. Backdrop click and Escape invoke{' '}
            <code className="text-[12px]">onClose</code> when not busy.
          </p>
        </PortalModalShell>
      </div>

      <div className={WORKBENCH_SECTION_CARD_CLASS}>
        <h3 className="text-[14px] font-bold text-slate-900 mb-2">Keyboard &amp; accessibility</h3>
        <ul className="list-disc pl-5 text-[13px] text-slate-600 space-y-1">
          <li>Tab cycles within the open modal; focus returns to the trigger on close.</li>
          <li>Escape dismisses unless <code className="text-[12px]">phase="working"</code> on ConfirmDialog.</li>
          <li>Nested modals use <code className="text-[12px]">stack="nested"</code> on domain screens (not shown here).</li>
          <li>Related: Dialog Playground under Playgrounds for free-form experiments.</li>
        </ul>
      </div>

      {confirmProps ? (
        <ConfirmDialog
          open
          title={confirmProps.title}
          message={confirmProps.message}
          description={confirmProps.description}
          confirmLabel={confirmProps.confirmLabel}
          tone={confirmProps.tone}
          phase={confirmPhase}
          onConfirm={simulateConfirm}
          onCancel={handleCancelConfirm}
        />
      ) : null}
    </div>
  )
}
