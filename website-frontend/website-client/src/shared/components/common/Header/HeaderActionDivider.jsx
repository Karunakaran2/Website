/** Vertical rule between header actions — spfo_frontend ModuleUserDropdown */
export default function HeaderActionDivider({ theme = 'dark' }) {
  const isLight = theme === 'light'
  return (
    <div
      className={`h-4 w-px shrink-0 ${isLight ? 'bg-gray-300' : 'bg-white dark:bg-slate-800/20'}`}
      aria-hidden
    />
  )
}
