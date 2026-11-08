import { useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { PrimaryButton, CancelButton } from '@/shared/components/buttons'

export default function FormsExplorerPage() {
  const [formData, setFormData] = useState({
    title: 'Q3 Enterprise UI Enhancements',
    category: 'design-tokens',
    amount: '1250000',
    notifyLead: true,
    status: 'active',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errorState, setErrorState] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setErrorState(true)
      return
    }
    setErrorState(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full rounded-md px-3 py-2 text-xs border ${
                  errorState
                    ? 'border-red-500 bg-red-50/20 text-red-900'
                    : 'border-slate-300 text-slate-900 focus:border-[#01458e]'
                }`}
                placeholder="e.g. Design System Tokens"
              />
              {errorState ? (
                <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Title cannot be empty.
                </p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-[#01458e]"
              >
                <option value="design-tokens">Design Tokens & Themes</option>
                <option value="components">Core UI Components</option>
                <option value="guidelines">Accessibility Guidelines</option>
                <option value="patterns">Workflow Patterns</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Allocated Budget (₹ Indian Format)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                <input
                  type="text"
                  value={Number(formData.amount).toLocaleString('en-IN')}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '')
                    setFormData({ ...formData, amount: clean })
                  }}
                  className="w-full rounded-md border border-slate-300 pl-7 pr-3 py-2 text-xs font-medium text-slate-900 focus:border-[#01458e]"
                />
              </div>
              <span className="mt-1 block text-[11px] text-slate-400">
                Auto-formatted to Indian currency conventions (lakhs / crores).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Lifecycle Status
              </label>
              <div className="flex gap-4 pt-1">
                {[
                  { id: 'active', label: 'Active' },
                  { id: 'review', label: 'In Review' },
                  { id: 'archived', label: 'Archived' },
                ].map((s) => (
                  <label key={s.id} className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === s.id}
                      onChange={() => setFormData({ ...formData, status: s.id })}
                      className="text-[#01458e]"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.notifyLead}
                onChange={(e) => setFormData({ ...formData, notifyLead: e.target.checked })}
                className="rounded border-slate-300 text-[#01458e]"
              />
              <span>Notify engineering lead on modification</span>
            </label>

            <div className="flex items-center gap-2">
              <CancelButton onClick={() => setFormData({ title: '', category: 'components', amount: '0', notifyLead: false, status: 'active' })}>
                Reset
              </CancelButton>
              <PrimaryButton type="submit">
                Submit Form
              </PrimaryButton>
            </div>
          </div>

          {submitted ? (
            <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Form changes recorded successfully in local state.</span>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  )
}
