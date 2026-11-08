import { useState } from 'react'
import { ChevronRight, Home } from 'lucide-react'

export default function NavigationExplorerPage() {
  const [activeTab, setActiveTab] = useState('tab-1')

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          Breadcrumb Hierarchy
        </h3>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-[#01458e] font-medium hover:underline cursor-pointer">
            <Home className="h-4 w-4" />
            Home
          </span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-[#01458e] font-medium hover:underline cursor-pointer">
            Component Explorer
          </span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-slate-800" aria-current="page">
            Navigation Patterns
          </span>
        </nav>
      </div>

      {/* Tab Strip Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600">
          In-Page Tabs Pattern
        </h3>
        <div className="border-b border-slate-200">
          <div className="flex gap-4">
            {[
              { id: 'tab-1', label: 'Primary Information' },
              { id: 'tab-2', label: 'Workflow Approvals' },
              { id: 'tab-3', label: 'Audit Trail' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2.5 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#01458e] text-[#01458e]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
          {activeTab === 'tab-1' ? (
            <p>Active Tab: <strong>Primary Information</strong>. Displays core attributes, metadata, and timestamps.</p>
          ) : activeTab === 'tab-2' ? (
            <p>Active Tab: <strong>Workflow Approvals</strong>. Displays approval hierarchy, sign-off steps, and dates.</p>
          ) : (
            <p>Active Tab: <strong>Audit Trail</strong>. Displays chronological history of system alterations.</p>
          )}
        </div>
      </div>
    </div>
  )
}
