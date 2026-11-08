import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { PageSectionHeader } from '@/shared/components/page'
import { PAGE_SECTION_HEADER_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import StatusChip from '@/shared/components/status/StatusChip'
import { PORTAL_LANDING_MODULES } from '@/app/shell/constants/portalModules'
import { MODULE_LANDING_PANEL_CLASS } from '@/shared/constants/moduleLayoutStyles'

function renderModuleIcon(iconType) {
  const iconSize = 20
  switch (iconType) {
    case 'document':
      return <FileText size={iconSize} aria-hidden="true" />
    case 'layers':
      return <BookOpen size={iconSize} aria-hidden="true" />
    case 'calculator':
      return <Sparkles size={iconSize} aria-hidden="true" />
    case 'support':
      return <ShieldCheck size={iconSize} aria-hidden="true" />
    case 'users':
      return <Users size={iconSize} aria-hidden="true" />
    case 'clipboard':
      return <ClipboardCheck size={iconSize} aria-hidden="true" />
    default:
      return <FileText size={iconSize} aria-hidden="true" />
  }
}

export default function PortalModulesGrid({ modules = PORTAL_LANDING_MODULES }) {
  const navigate = useNavigate()

  const handleCardClick = (module) => {
    if (!module.available) return
    const targetPath = typeof module.path === 'function' ? module.path() : module.path
    navigate(targetPath)
  }

  return (
    <section aria-label="Modules" className={MODULE_LANDING_PANEL_CLASS}>
      <div className={`${PAGE_SECTION_HEADER_SHELL_CLASS} shrink-0`}>
        <PageSectionHeader
          title="Modules"
          subtitle="Access operational areas of the organisation"
        />
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          {modules.map((module) => {
            const isInteractive = module.available !== false

            return (
              <button
                key={module.id}
                type="button"
                disabled={!isInteractive}
                onClick={() => handleCardClick(module)}
                aria-label={`Open ${module.title} module, status ${module.status}`}
                className={`group flex min-h-[136px] flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-2xs transition-all duration-200 ${
                  isInteractive
                    ? 'cursor-pointer hover:-translate-y-0.5 hover:border-[#01458e]/40 hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#01458e] focus:ring-offset-2'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[#01458e] transition-colors group-hover:bg-sky-100">
                    {renderModuleIcon(module.iconType)}
                  </div>
                  <StatusChip label={module.status} />
                </div>

                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-[#01458e]">
                      {module.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{module.description}</p>
                  </div>

                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all group-hover:border-[#01458e] group-hover:bg-sky-50 group-hover:text-[#01458e]"
                    aria-hidden="true"
                  >
                    <ChevronRight size={14} />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
