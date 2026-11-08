export default function ExplorerCard({ title, description, category, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {category ? (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {category}
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="text-xs text-slate-600 mb-4">{description}</p>
      ) : null}
      {children}
    </div>
  )
}
