import { useTranslation } from 'react-i18next'

export default function AccountCard({ account, selected, onSelect }) {
  const { t } = useTranslation()
  const handleClick = () => onSelect(account.id)

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(account.id)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      className="focus-ring relative h-[288px] cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition-[border-color,box-shadow] duration-200 hover:border-probity-brand hover:shadow-[0_0_0_1px_#064cac] focus-visible:border-probity-brand focus-visible:shadow-[0_0_0_1px_#064cac] active:border-probity-brand active:shadow-[0_0_0_1px_#064cac] sm:p-6"
    >
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug text-[#01458e] sm:text-base">
            {account.name}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{t('accounts.role')}</p>
        </div>

        <span className="shrink-0 rounded-sm border border-emerald-500 bg-emerald-50 px-6 py-1 text-xs font-semibold text-emerald-700">
          {t('common.active')}
        </span>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 h-[170px] w-[300px] max-w-[78%] p-3 sm:h-[195px] sm:w-[320px] sm:p-4">
        <img
          src={account.image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain object-right object-bottom opacity-70"
          decoding="async"
        />
      </div>
    </div>
  )
}
