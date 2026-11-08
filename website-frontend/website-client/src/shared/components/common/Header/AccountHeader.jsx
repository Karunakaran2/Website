import ModuleUserDropdown from '@/shared/components/common/Header/ModuleUserDropdown'
import ProbityHeaderBrand from '@/shared/components/common/Header/ProbityHeaderBrand'

export default function AccountHeader() {
  return (
    <header className="relative z-50 h-[64px] w-full min-w-0 bg-[#01458E] shadow-[0px_2px_6.7px_-5px_#00000040] sm:h-[73px]">
      <div className="flex h-full min-w-0 items-center justify-between gap-2 px-3 sm:px-5 xl:px-[20px]">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-4">
          <ProbityHeaderBrand />
        </div>
        <ModuleUserDropdown theme="dark" />
      </div>
    </header>
  )
}
