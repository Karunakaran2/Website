export default function GuidelineCard({ title, badge, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#01458e] border border-blue-200">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}
