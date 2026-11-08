import { createContext, useContext, useLayoutEffect, useMemo, useState } from 'react'

const ContrastContext = createContext()
const STORAGE_KEY = 'org-ui-a11y'
const COLOR_SCHEMES = ['standard', 'high', 'yellow']

const DEFAULT_STATE = {
  colorScheme: 'standard',
  textSpacing: false,
  highlightLinks: false,
  underlineLinks: false,
  dyslexiaFriendly: false,
  invertColors: false,
  grayscale: false,
  bigCursor: false,
  hideImages: false,
}

const BOOL_KEYS = [
  'textSpacing',
  'highlightLinks',
  'underlineLinks',
  'dyslexiaFriendly',
  'invertColors',
  'grayscale',
  'bigCursor',
  'hideImages',
]

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const colorScheme = COLOR_SCHEMES.includes(parsed.colorScheme)
        ? parsed.colorScheme
        : parsed.highContrast
          ? 'high'
          : DEFAULT_STATE.colorScheme
      const next = { ...DEFAULT_STATE, colorScheme }
      BOOL_KEYS.forEach((key) => {
        next[key] = !!parsed[key]
      })
      return next
    }
    const legacy = localStorage.getItem('contrastMode')
    if (COLOR_SCHEMES.includes(legacy)) {
      return { ...DEFAULT_STATE, colorScheme: legacy }
    }
  } catch {
    /* keep defaults */
  }
  return { ...DEFAULT_STATE }
}

export const ContrastProvider = ({ children }) => {
  const [state, setState] = useState(loadState)

  useLayoutEffect(() => {
    const html = document.documentElement
    html.classList.toggle('contrast-high', state.colorScheme === 'high')
    html.classList.toggle('contrast-yellow', state.colorScheme === 'yellow')
    html.dataset.colorScheme = state.colorScheme
    html.dataset.textSpacing = state.textSpacing ? 'on' : 'off'
    html.dataset.highlightLinks = state.highlightLinks ? 'on' : 'off'
    html.dataset.underlineLinks = state.underlineLinks ? 'on' : 'off'
    html.dataset.dyslexia = state.dyslexiaFriendly ? 'on' : 'off'
    html.dataset.invert = state.invertColors ? 'on' : 'off'
    html.dataset.grayscale = state.grayscale ? 'on' : 'off'
    html.dataset.bigCursor = state.bigCursor ? 'on' : 'off'
    html.dataset.hideImages = state.hideImages ? 'on' : 'off'

    const classMap = [
      [state.textSpacing, 'a11y-text-spacing'],
      [state.highlightLinks, 'a11y-highlight-links'],
      [state.underlineLinks, 'a11y-underline-links'],
      [state.dyslexiaFriendly, 'a11y-dyslexia'],
      [state.invertColors, 'a11y-invert'],
      [state.grayscale, 'a11y-grayscale'],
      [state.bigCursor, 'a11y-big-cursor'],
      [state.hideImages, 'a11y-hide-images'],
    ]
    classMap.forEach(([enabled, className]) => {
      html.classList.toggle(className, !!enabled)
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    localStorage.setItem('contrastMode', state.colorScheme)
  }, [state])

  const value = useMemo(() => {
    const patch = (partial) => setState((current) => ({ ...current, ...partial }))
    const toggle = (key) => setState((current) => ({ ...current, [key]: !current[key] }))
    return {
      ...state,
      mode: state.colorScheme,
      setMode: (colorScheme) => {
        if (COLOR_SCHEMES.includes(colorScheme)) patch({ colorScheme })
      },
      setColorScheme: (colorScheme) => {
        if (COLOR_SCHEMES.includes(colorScheme)) patch({ colorScheme })
      },
      toggleTextSpacing: () => toggle('textSpacing'),
      toggleHighlightLinks: () => toggle('highlightLinks'),
      toggleUnderlineLinks: () => toggle('underlineLinks'),
      toggleDyslexiaFriendly: () => toggle('dyslexiaFriendly'),
      toggleInvertColors: () => toggle('invertColors'),
      toggleGrayscale: () => toggle('grayscale'),
      toggleBigCursor: () => toggle('bigCursor'),
      toggleHideImages: () => toggle('hideImages'),
      resetAppearance: () => setState({ ...DEFAULT_STATE }),
    }
  }, [state])

  return <ContrastContext.Provider value={value}>{children}</ContrastContext.Provider>
}

export const useContrast = () => useContext(ContrastContext)
