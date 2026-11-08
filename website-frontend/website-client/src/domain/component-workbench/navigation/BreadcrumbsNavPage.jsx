import { useState } from 'react'
import { Home, ChevronRight, Slash, Folder } from 'lucide-react'

export default function BreadcrumbsNavPage() {
  const [activeTrail, setActiveTrail] = useState('Capital Sanctions')
  const [selectedCrumb, setSelectedCrumb] = useState(null)

  const handleCrumbClick = (label) => {
    setSelectedCrumb(label)
  }

  return (
    <div className="space-y-6 pb-12 w-full">
      {/* 1. Breadcrumb Trails */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Breadcrumb Navigation Trails</h2>
          <p className="mt-1 text-xs text-slate-500">
            WAI-ARIA Breadcrumb pattern with semantic ordered lists, accessible current-page attributes, and keyboard focus outlines.
          </p>
        </div>

        <div className="space-y-6">
          {/* Chevron Separator Breadcrumb (Standard) */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Standard Chevron Hierarchy (3 Levels)
            </h3>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCrumbClick('Home')}
                    className="flex items-center gap-1 text-[#01458e] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#01458e] rounded px-1"
                  >
                    <Home size={14} className="shrink-0" />
                    <span>Home</span>
                  </button>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} className="text-slate-400" />
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCrumbClick('Administration')}
                    className="text-[#01458e] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#01458e] rounded px-1"
                  >
                    Administration
                  </button>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} className="text-slate-400" />
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCrumbClick('Fixed Assets')}
                    className="text-[#01458e] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#01458e] rounded px-1"
                  >
                    Fixed Assets
                  </button>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} className="text-slate-400" />
                </li>
                <li>
                  <span className="font-bold text-slate-900 px-1" aria-current="page">
                    Asset Register
                  </span>
                </li>
              </ol>
            </nav>
          </div>

          {/* Deep 4-Level Slash Separator Breadcrumb */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Deep Hierarchy with Slash Separator (4 Levels)
            </h3>
            <nav aria-label="Secondary Breadcrumb">
              <ol className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCrumbClick('Secretariat')}
                    className="text-[#01458e] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#01458e] rounded px-1"
                  >
                    Secretariat
                  </button>
                </li>
                <li aria-hidden="true" className="text-slate-300 font-mono">/</li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCrumbClick('Finance & Accounts')}
                    className="text-[#01458e] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#01458e] rounded px-1"
                  >
                    Finance & Accounts
                  </button>
                </li>
                <li aria-hidden="true" className="text-slate-300 font-mono">/</li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCrumbClick('Voucher Approval')}
                    className="text-[#01458e] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#01458e] rounded px-1"
                  >
                    Voucher Approval
                  </button>
                </li>
                <li aria-hidden="true" className="text-slate-300 font-mono">/</li>
                <li>
                  <span className="font-bold text-slate-900 px-1" aria-current="page">
                    Voucher #VCH-2026-9081
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Telemetry Display */}
        {selectedCrumb && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-[#01458e]">
            <span>Navigated via breadcrumb item: <strong>{selectedCrumb}</strong></span>
            <button
              type="button"
              onClick={() => setSelectedCrumb(null)}
              className="text-xs font-semibold underline hover:text-[#002f6c]"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 2. Breadcrumb Accessibility Specifications */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Breadcrumb Accessibility Specifications</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Landmark Navigation</h4>
            <p>Always enclose breadcrumbs within a <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">&lt;nav aria-label="Breadcrumb"&gt;</code> element to distinguish it from main navigation.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Current Page Indicator</h4>
            <p>The terminal item representing the user's active page must specify <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">aria-current="page"</code> and render as text rather than a link.</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200">
            <h4 className="font-bold text-slate-800 mb-1">Hidden Separators</h4>
            <p>Visual separators (chevrons or slashes) must specify <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">aria-hidden="true"</code> to prevent redundant screen reader announcements.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
