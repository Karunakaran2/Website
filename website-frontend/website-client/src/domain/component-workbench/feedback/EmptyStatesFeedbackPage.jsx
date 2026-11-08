import { useState } from 'react'
import { Search, FolderOpen, AlertTriangle, Plus, RefreshCw, FilterX } from 'lucide-react'
import ActionButton from '@/shared/components/buttons/ActionButton'

export default function EmptyStatesFeedbackPage() {
  const [activeTab, setActiveTab] = useState('search')
  const [actionMessage, setActionMessage] = useState(null)

  const handleAction = (msg) => {
    setActionMessage(msg)
    setTimeout(() => setActionMessage(null), 3000)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Empty States Showcase */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Standard Empty States</h2>
            <p className="mt-1 text-xs text-slate-500">
              Clear, non-blocking empty states guiding users back to an operational state with prominent calls-to-action.
            </p>
          </div>
          {/* Segmented Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'search'
                  ? 'bg-white text-[#01458e] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Search Filter Empty
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('initial')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'initial'
                  ? 'bg-white text-[#01458e] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Initial Zero-Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('error')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'error'
                  ? 'bg-white text-[#01458e] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Service Fallback
            </button>
          </div>
        </div>

        {/* Live Container */}
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 min-h-[320px] flex items-center justify-center">
          {activeTab === 'search' && (
            <div className="flex flex-col items-center justify-center text-center max-w-sm animate-fadeIn">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                <Search size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Matching Records Found</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                We couldn't find any vouchers or projects matching your search term. Try adjusting your query or resetting active category filters.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <ActionButton
                  type="button"
                  variant="reset"
                  onClick={() => handleAction('Reset filter search criteria')}
                  className="inline-flex items-center gap-1.5 text-xs"
                >
                  <FilterX size={14} />
                  <span>Reset All Filters</span>
                </ActionButton>
              </div>
            </div>
          )}

          {activeTab === 'initial' && (
            <div className="flex flex-col items-center justify-center text-center max-w-sm animate-fadeIn">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#01458e] mb-3">
                <FolderOpen size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Projects Created Yet</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                There are currently no active capital sanction records in this department queue. Initiate a new project to start the workflow.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <ActionButton
                  type="button"
                  variant="primary"
                  onClick={() => handleAction('Opened new project creation dialog')}
                  className="inline-flex items-center gap-1.5 text-xs"
                >
                  <Plus size={14} />
                  <span>Create First Project</span>
                </ActionButton>
              </div>
            </div>
          )}

          {activeTab === 'error' && (
            <div className="flex flex-col items-center justify-center text-center max-w-sm animate-fadeIn">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Unable to Fetch Dataset</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                The connection to the central audit cache timed out. Local offline drafts are saved. Retry syncing the table.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <ActionButton
                  type="button"
                  variant="submit"
                  onClick={() => handleAction('Initiated dataset synchronization retry')}
                  className="inline-flex items-center gap-1.5 text-xs"
                >
                  <RefreshCw size={14} />
                  <span>Retry Connection</span>
                </ActionButton>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry Display */}
        {actionMessage && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-[#01458e] animate-fadeIn">
            Action: <strong>{actionMessage}</strong>
          </div>
        )}
      </div>

      {/* 2. Empty State Architecture Rules */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Empty State Component Rules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Never Dead-End the User</h4>
            <p>Every empty state must provide a clear next step—such as creating an item, clearing active search filters, or retrying a network operation.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Explain the Root Cause</h4>
            <p>Distinguish between zero items because no records exist vs zero items due to an over-constrained filter query or network disruption.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Subtle Visual Anchors</h4>
            <p>Use muted 48×48px circular icon backgrounds and avoid loud decorative illustrations that distract from enterprise productivity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
