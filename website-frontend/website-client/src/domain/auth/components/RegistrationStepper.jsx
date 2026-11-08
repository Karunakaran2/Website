import { CheckCircle2 } from 'lucide-react'

export default function RegistrationStepper({
  steps,
  activeStep,
  maxReachableStep = activeStep,
  onStepClick,
}) {
  return (
    <nav className="mb-6 w-full px-0.5" aria-label="Registration progress">
      <ol className="flex list-none flex-wrap items-center gap-2 p-0 sm:gap-3">
        {steps.map((item, idx) => {
          const isCompleted = activeStep > item.step
          const isActive = activeStep === item.step
          const canNavigate = item.step <= maxReachableStep

          return (
            <li key={item.step} className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  if (canNavigate && onStepClick) {
                    onStepClick(item.step)
                  }
                }}
                disabled={!canNavigate}
                aria-current={isActive ? 'step' : undefined}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all duration-200 ${
                  canNavigate ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'
                } ${
                  isCompleted
                    ? 'border-emerald-200 bg-[#D1FAE5] text-[#065F46]'
                    : isActive
                      ? 'border-[#01458e] bg-[#01458e] text-white shadow-sm'
                      : 'border-slate-200 bg-[#F3F4F6] text-slate-600'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isCompleted
                      ? 'bg-[#A7F3D0] text-[#065F46]'
                      : isActive
                        ? 'bg-[#01336a] text-white'
                        : 'bg-[#E5E7EB] text-slate-600'
                  }`}
                  aria-hidden
                >
                  {isCompleted ? <CheckCircle2 size={12} /> : item.step}
                </span>
                <span className="whitespace-nowrap text-xs font-bold">{item.title}</span>
              </button>
              {idx < steps.length - 1 ? (
                <span
                  className="hidden h-[1.5px] w-6 shrink-0 bg-slate-300 sm:inline-block sm:w-10"
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
