import { normalizeAssetInformationStatus } from '../utils/assetInformationFormFooterActions'

const STEPS = [
  { code: 'I', label: 'Saved' },
  { code: 'S', label: 'Submitted' },
  { code: 'V', label: 'Verified' },
  { code: 'A', label: 'Approved' },
]

function stepIndex(code) {
  const normalized = normalizeAssetInformationStatus(code)
  if (normalized === 'A') {
    return 3
  }
  const idx = STEPS.findIndex((step) => step.code === normalized)
  return idx >= 0 ? idx : 0
}

export default function AssetInformationWorkflowSteps({ status }) {
  const currentIndex = stepIndex(status)

  return (
    <nav
      aria-label="Asset information workflow"
      className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]"
    >
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <span key={step.code} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span className="text-slate-400" aria-hidden="true">
                →
              </span>
            ) : null}
            <span
              className={
                isCurrent
                  ? 'font-semibold text-[#01458e]'
                  : isComplete
                    ? 'font-medium text-slate-700'
                    : 'text-slate-500'
              }
              aria-current={isCurrent ? 'step' : undefined}
            >
              {step.label}
            </span>
          </span>
        )
      })}
    </nav>
  )
}
