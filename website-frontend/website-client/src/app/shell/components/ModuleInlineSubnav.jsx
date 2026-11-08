import { MODULE_NAV_TAB_FONT } from '@/app/shell/constants/moduleNavStyles'

/**
 * In-page tabs (Probity Asset Approval pattern): 45px row, navy active text, gold underline.
 * Not route-based — pair with state or optional URL sync in the host page.
 */
export default function ModuleInlineSubnav({ items, activeId, onSelect, getLabel }) {
  if (!items?.length) {
    return null
  }

  return (
    <ul className="box-border flex h-[45px] min-h-[45px] max-h-[45px] items-center overflow-x-auto px-3 sm:px-4">
      {items.map((tab) => {
        const isActive = activeId === tab.id
        const label = getLabel ? getLabel(tab) : tab.label
        return (
          <li key={tab.id} className="h-[45px] shrink-0">
            <button
              type="button"
              aria-current={isActive ? 'page' : 'false'}
              onClick={() => onSelect(tab.id)}
              className={`relative box-border flex h-[45px] cursor-pointer items-center whitespace-nowrap border-none bg-transparent px-3 font-medium md:px-5 ${MODULE_NAV_TAB_FONT} transition ${
                isActive ? 'text-[#01458e]' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {label}
              {isActive ? (
                <span
                  aria-hidden
                  className="absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-[#f5c518]"
                />
              ) : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
