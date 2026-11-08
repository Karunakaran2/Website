export const PORTAL_REGISTRATION_OPTION = {
  id: 'portal-user',
  label: 'Portal user registration',
  summary: 'Request access to the KRAN Design System portal (demonstration flow).',
}

export const otrRegistrationCardClass = (isSelected) =>
  [
    'relative flex h-full min-h-[168px] min-w-0 cursor-pointer flex-col rounded-lg border p-4 text-left shadow-none transition',
    isSelected
      ? 'border-[#01458e] bg-[#F4FAFF] ring-2 ring-[#01458e]/15'
      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
  ].join(' ')

export const OTR_REGISTRATION_CARDS_GRID_CLASS =
  'grid min-h-0 grid-cols-1 items-stretch gap-4 sm:max-w-md'
