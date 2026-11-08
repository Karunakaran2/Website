import { useEffect, useState } from 'react'
import {
  AlignVerticalSpaceBetween,
  BookOpen,
  Contrast,
  Highlighter,
  ImageOff,
  MousePointer2,
  Palette,
  Underline,
  X,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SIDEBAR_TRANSITION_MS = 320
const SIDEBAR_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

function OptionTile({ label, icon: Icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'flex min-h-[5.5rem] flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#01458e] cursor-pointer',
        active
          ? 'border-[#01458e] bg-[#01458e] text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50',
      ].join(' ')}
    >
      <Icon
        size={22}
        strokeWidth={1.75}
        className={active ? 'text-white' : 'text-[#01458e]'}
        aria-hidden
      />
      <span className="text-[11px] font-semibold leading-tight">{label}</span>
    </button>
  )
}

export default function AccessibilityOptionsSidebar({
  open,
  panelRef,
  onClose,
  a11y,
}) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      return () => cancelAnimationFrame(frame)
    }
    setVisible(false)
    const timer = window.setTimeout(() => setMounted(false), SIDEBAR_TRANSITION_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  if (!mounted) {
    return null
  }

  const options = [
    {
      id: 'textSpacing',
      label: t('Text Spacing'),
      icon: AlignVerticalSpaceBetween,
      active: a11y.textSpacing,
      onClick: a11y.toggleTextSpacing,
    },
    {
      id: 'dyslexia',
      label: t('Dyslexia Friendly'),
      icon: BookOpen,
      active: a11y.dyslexiaFriendly,
      onClick: a11y.toggleDyslexiaFriendly,
    },
    {
      id: 'highlightLinks',
      label: t('Highlight Links'),
      icon: Highlighter,
      active: a11y.highlightLinks,
      onClick: a11y.toggleHighlightLinks,
    },
    {
      id: 'underlineLinks',
      label: t('Underline Links'),
      icon: Underline,
      active: a11y.underlineLinks,
      onClick: a11y.toggleUnderlineLinks,
    },
    {
      id: 'invert',
      label: t('Invert Colors'),
      icon: Palette,
      active: a11y.invertColors,
      onClick: a11y.toggleInvertColors,
    },
    {
      id: 'grayscale',
      label: t('Grayscale'),
      icon: Contrast,
      active: a11y.grayscale,
      onClick: a11y.toggleGrayscale,
    },
    {
      id: 'hideImages',
      label: t('Hide Images'),
      icon: ImageOff,
      active: a11y.hideImages,
      onClick: a11y.toggleHideImages,
    },
    {
      id: 'bigCursor',
      label: t('Big Cursor'),
      icon: MousePointer2,
      active: a11y.bigCursor,
      onClick: a11y.toggleBigCursor,
    },
  ]

  return (
    <>
      <div
        className={[
          'fixed inset-0 z-[1000001] bg-black/55 transition-opacity',
          visible ? 'cursor-default opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        style={{
          transitionDuration: `${SIDEBAR_TRANSITION_MS}ms`,
          transitionTimingFunction: SIDEBAR_EASE,
        }}
        role="presentation"
        onClick={onClose}
        aria-hidden={!visible}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('Accessibility Options')}
        className={[
          'fixed inset-y-0 right-0 z-[1000002] flex w-full max-w-[min(28rem,100vw)] flex-col bg-white font-sans shadow-[-12px_0_32px_rgba(15,23,42,0.18)] will-change-transform transition-transform',
          visible ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        style={{
          transitionDuration: `${SIDEBAR_TRANSITION_MS}ms`,
          transitionTimingFunction: SIDEBAR_EASE,
        }}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#01336a] bg-[#01458e] px-5 py-4 text-white">
          <p className="m-0 text-lg font-semibold leading-tight">{t('Accessibility Options')}</p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded border-0 bg-transparent p-1 text-white/90 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c518]"
            aria-label={t('Close')}
          >
            <X size={20} aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
            {options.map((option) => (
              <OptionTile
                key={option.id}
                label={option.label}
                icon={option.icon}
                active={option.active}
                onClick={option.onClick}
              />
            ))}
          </div>
        </div>

        <footer className="shrink-0 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={() => {
              a11y.resetAll()
              onClose()
            }}
            className="w-full cursor-pointer rounded-md border border-[#01458e] bg-[#01458e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#01336a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c518]"
          >
            {t('Reset All')}
          </button>
        </footer>
      </aside>
    </>
  )
}
