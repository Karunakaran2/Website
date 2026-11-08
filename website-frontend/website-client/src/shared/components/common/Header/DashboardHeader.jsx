import { useSelector } from 'react-redux'
import { selectActivePrimaryId } from '@/app/shell/redux/selectors'
import { resolveHeaderModulePortalLabel } from '@/app/shell/utils/headerModulePortalLabel'
import ModuleUserDropdown from '@/shared/components/common/Header/ModuleUserDropdown'
import ProbityHeaderBrand from '@/shared/components/common/Header/ProbityHeaderBrand'

/** Same Tailwind shell as spfo_frontend pfManagement Header.jsx */
export default function DashboardHeader() {
  const activePrimaryId = useSelector(selectActivePrimaryId)
  const modulePortalLabel = resolveHeaderModulePortalLabel(activePrimaryId)

  return (
    <header className="relative z-50 h-[64px] w-full min-w-0 bg-[#01458E] shadow-[0px_2px_6.7px_-5px_#00000040] sm:h-[73px]">
      <div className="flex h-full min-w-0 items-center justify-between gap-2 px-3 sm:px-5 xl:px-[20px]">
        <div className="flex min-w-0 flex-1 items-center overflow-hidden pr-1">
          <ProbityHeaderBrand portalLabel={modulePortalLabel ?? undefined} />
        </div>
        <div className="flex shrink-0 items-center">
          <ModuleUserDropdown theme="dark" />
        </div>
      </div>
    </header>
  )
}
