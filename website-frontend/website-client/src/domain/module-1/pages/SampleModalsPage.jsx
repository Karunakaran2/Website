import { useState } from 'react'
import {
  FileCheck,
  RefreshCw,
  Trash2,
  Eye,
  ArrowRight,
  ShieldAlert,
  Coins,
  MessageSquare,
} from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import {
  PortalModalPrimaryButton,
  PortalModalCancelButton,
} from '@/shared/components/modals/PortalModalButtons'
import ConfirmDialog from '@/shared/components/modals/ConfirmDialog'
import { GigwButton } from '@/shared/components/buttons/gigw'
import StatusChip from '@/shared/components/status/StatusChip'
import { InputField, SelectField, IndianAmountField, TextAreaField } from '@/shared/components/forms'
import { showAppToast } from '@/shared/components'

export default function SampleModalsPage() {
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reappropriationOpen, setReappropriationOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [queryModalOpen, setQueryModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewRemarks, setReviewRemarks] = useState(
    'Recommended for technical endorsement based on validated site inspection and verified bill of quantities.'
  )

  const [reappropriationForm, setReappropriationForm] = useState({
    fromHead: '4059-80-051-99 (General IT Infrastructure)',
    toHead: '4059-80-052-98 (State Cyber Command Center)',
    transferAmount: '2500000',
    reason: 'Urgent security incident monitoring expansion requiring immediate capital reallocation.',
  })

  const handleEndorse = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setReviewModalOpen(false)
      showAppToast('Sanction proposal endorsed successfully.', 'success', { action: 'approve' })
    }, 1000)
  }

  const handleReappropriate = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setReappropriationOpen(false)
      showAppToast('Budget reappropriation order issued.', 'success', { action: 'save' })
    }, 1000)
  }

  const handleDelete = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setDeleteConfirmOpen(false)
      showAppToast('Project cancelled and removed.', 'success', { action: 'delete' })
    }, 1000)
  }

  return (
    <SampleModuleLayout activeTab="modals">
      <div className="space-y-6 w-full">
        {/* Workflow Dialog Triggers */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Enterprise Modal Workflows</h2>
            <p className="mt-1 text-xs text-slate-500">
              Review, reappropriation, query, and destructive confirmations using portal modals and confirm dialogs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Review & Endorsement Modal */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#01458e] font-bold text-xs mb-1">
                  <FileCheck size={16} />
                  <span>Sanction Review Modal</span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Supervisory review drawer displaying line-item bill of quantities and endorsement remarks.
                </p>
              </div>
              <GigwButton
                type="button"
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => setReviewModalOpen(true)}
              >
                Open Review Modal
              </GigwButton>
            </div>

            {/* 2. Budget Reappropriation Modal */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                  <Coins size={16} />
                  <span>Reappropriation Modal</span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Inter-head fund transfer dialogue with balance validation and authorization input.
                </p>
              </div>
              <GigwButton
                type="button"
                variant="success"
                size="sm"
                className="w-full text-xs"
                onClick={() => setReappropriationOpen(true)}
              >
                Open Reappropriation
              </GigwButton>
            </div>

            {/* 3. Statutory Audit Query Modal */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                  <MessageSquare size={16} />
                  <span>Audit Query Response</span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Dialogue to respond to Accountant General observations and submit clarifications.
                </p>
              </div>
              <GigwButton
                type="button"
                variant="outlineUtility"
                size="sm"
                className="w-full text-xs"
                onClick={() => setQueryModalOpen(true)}
              >
                Open Query Response
              </GigwButton>
            </div>

            {/* 4. Irreversible Cancellation Dialog */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
                  <Trash2 size={16} />
                  <span>Project Cancellation</span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  High-friction deletion dialog ensuring accidental clicks do not purge sanction tokens.
                </p>
              </div>
              <GigwButton
                type="button"
                variant="danger"
                size="sm"
                className="w-full text-xs"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Open Cancel Dialog
              </GigwButton>
            </div>
          </div>
        </div>

        {/* Modal Guidelines */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Modal Composition Guidelines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-1">Always Use PortalModalShell</h4>
              <p>Ensures correct DOM hierarchy via React Portal, backdrop blur, Escape key dismissal, and standard 44px Probity modal buttons.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-1">Standard Modal Sizes</h4>
              <p>Supported standard widths: <code className="font-mono text-[11px]">sm</code> (384px), <code className="font-mono text-[11px]">md</code> (512px), <code className="font-mono text-[11px]">lg</code> (768px), and <code className="font-mono text-[11px]">xl</code> (1024px).</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-1">ConfirmDialog for Warnings</h4>
              <p>For quick confirmations (Yes/No), compose <code className="font-mono text-[11px]">ConfirmDialog</code> with semantic tones instead of building custom prompt shells.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Live Sanction Review Modal */}
      {reviewModalOpen && (
        <PortalModalShell
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Sanction Proposal Review (#CW-2026-9042)"
          icon={FileCheck}
          size="lg"
          footer={
            <>
              <PortalModalPrimaryButton
                onClick={handleEndorse}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Endorsing...' : 'Endorse Sanction'}
              </PortalModalPrimaryButton>
              <PortalModalCancelButton onClick={() => setReviewModalOpen(false)}>
                Return
              </PortalModalCancelButton>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 block">Sanction Code:</span>
                <strong className="text-slate-900 font-mono">CW-2026-9042</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Department:</span>
                <strong className="text-slate-900">IT & Communications</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Proposed Amount:</span>
                <strong className="text-[#01458e] font-mono">₹1,45,00,000</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Status:</span>
                <StatusChip label="Pending" />
              </div>
            </div>

            <TextAreaField
              id="modal-remarks"
              name="reviewRemarks"
              label="Supervisory Endorsement Remarks"
              rows={3}
              value={reviewRemarks}
              onChange={(e) => setReviewRemarks(e.target.value)}
            />
          </div>
        </PortalModalShell>
      )}

      {/* 2. Budget Reappropriation Modal */}
      {reappropriationOpen && (
        <PortalModalShell
          isOpen={reappropriationOpen}
          onClose={() => setReappropriationOpen(false)}
          title="Budget Reappropriation Request"
          icon={Coins}
          size="md"
          footer={
            <>
              <PortalModalPrimaryButton
                onClick={handleReappropriate}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Authorize Reappropriation'}
              </PortalModalPrimaryButton>
              <PortalModalCancelButton onClick={() => setReappropriationOpen(false)}>
                Cancel
              </PortalModalCancelButton>
            </>
          }
        >
          <div className="space-y-4">
            <InputField
              id="reapp-from"
              name="fromHead"
              label="Source Head of Account"
              disabled
              value={reappropriationForm.fromHead}
            />
            <InputField
              id="reapp-to"
              name="toHead"
              label="Destination Head of Account"
              value={reappropriationForm.toHead}
              onChange={(e) => setReappropriationForm({ ...reappropriationForm, toHead: e.target.value })}
            />
            <IndianAmountField
              id="reapp-amount"
              name="transferAmount"
              label="Reappropriation Amount (₹)"
              value={reappropriationForm.transferAmount}
              onChange={(e) => setReappropriationForm({ ...reappropriationForm, transferAmount: e.target.value })}
            />
          </div>
        </PortalModalShell>
      )}

      {/* 3. Query Response Modal */}
      {queryModalOpen && (
        <PortalModalShell
          isOpen={queryModalOpen}
          onClose={() => setQueryModalOpen(false)}
          title="Statutory Audit Query Response"
          icon={MessageSquare}
          size="md"
          footer={
            <>
              <PortalModalPrimaryButton
                onClick={() => {
                  setQueryModalOpen(false)
                  showAppToast('Audit query response sent.', 'success', { action: 'submit' })
                }}
              >
                Transmit Response
              </PortalModalPrimaryButton>
              <PortalModalCancelButton onClick={() => setQueryModalOpen(false)}>
                Close
              </PortalModalCancelButton>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-amber-900">
              <span className="font-bold block">Auditor Observation #AG-2026-091:</span>
              <p className="mt-0.5">Please provide soil test certificate and municipal structural safety NOC for Project #CW-2026-9042.</p>
            </div>
            <TextAreaField
              id="query-response-text"
              name="queryResponse"
              label="Executive Reply & References"
              rows={4}
              defaultValue="Soil test report issued by Government Engineering College Soil Mechanics Lab has been appended as File Ref #GEC-SM-8902."
            />
          </div>
        </PortalModalShell>
      )}

      {/* 4. Cancellation Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Confirm Project Cancellation"
        message="Permanently cancel Capital Works Proposal #CW-2026-9042?"
        description="All associated budgetary allocations and technical sanction tokens will be revoked."
        confirmLabel="Yes, Cancel Project"
        cancelLabel="Keep Project"
        tone="delete"
        loading={isSubmitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </SampleModuleLayout>
  )
}
