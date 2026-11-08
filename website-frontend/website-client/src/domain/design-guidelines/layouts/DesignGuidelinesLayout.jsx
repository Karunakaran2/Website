export default function DesignGuidelinesLayout({ title, subtitle, children }) {
  return (
    <div className="w-full space-y-6 pb-12">
      {title ? (
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </div>
  )
}
