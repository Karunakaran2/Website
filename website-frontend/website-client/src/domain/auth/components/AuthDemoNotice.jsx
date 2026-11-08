import { authDemoInfoBannerClass } from '@/domain/auth/constants/authFormStyles'

export default function AuthDemoNotice({ title, children, actionLabel, onAction }) {
  return (
    <div className={authDemoInfoBannerClass} role="note">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs sm:text-sm">
          {title ? <span className="font-bold text-[#01458E]">{title}</span> : null}
          <span className={title ? 'ml-1 text-slate-700' : 'text-slate-700'}>{children}</span>
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="rounded bg-[#01458E] px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-[#01336a]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  )
}
