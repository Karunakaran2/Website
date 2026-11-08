import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FONT_SIZES, SIZE_KEYS } from "./FontSizeConstant";

const STORAGE_KEY = "probity-a11y";
const FONT_KEYS = ["xs", "sm", "md", "lg", "xl"];
const FONT_TO_CLASS = {
  xs: "user-xs",
  sm: "user-sm",
  md: "user-base",
  lg: "user-lg",
  xl: "user-xl",
};
const CLASS_TO_FONT = {
  "user-xs": "xs",
  "user-sm": "sm",
  "user-base": "md",
  "user-lg": "lg",
  "user-xl": "xl",
};
const COLOR_SCHEMES = ["standard", "high", "yellow"];

const DEFAULT_STATE = {
  fontSize: "md",
  colorScheme: "standard",
  textSpacing: false,
  highlightLinks: false,
  underlineLinks: false,
  dyslexiaFriendly: false,
  invertColors: false,
  grayscale: false,
  bigCursor: false,
  hideImages: false,
  language: "en",
};

const AccessibilityContext = createContext(null);

const mergePreferredLanguage = (state) => {
  try {
    const preferred = localStorage.getItem("preferredLanguage");
    if (preferred === "hi" || preferred === "en") {
      return { ...state, language: preferred };
    }
  } catch {
    /* ignore */
  }
  return state;
};

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrate legacy fontSize key if present
      const legacy = localStorage.getItem("fontSize");
      if (legacy && CLASS_TO_FONT[legacy]) {
        return mergePreferredLanguage({
          ...DEFAULT_STATE,
          fontSize: CLASS_TO_FONT[legacy],
        });
      }
      return mergePreferredLanguage({ ...DEFAULT_STATE });
    }
    const parsed = JSON.parse(raw);
    const colorScheme = COLOR_SCHEMES.includes(parsed.colorScheme)
      ? parsed.colorScheme
      : parsed.highContrast
        ? "high"
        : DEFAULT_STATE.colorScheme;
    return mergePreferredLanguage({
      ...DEFAULT_STATE,
      fontSize: FONT_KEYS.includes(parsed.fontSize)
        ? parsed.fontSize
        : DEFAULT_STATE.fontSize,
      colorScheme,
      textSpacing: !!parsed.textSpacing,
      highlightLinks: !!parsed.highlightLinks,
      underlineLinks: !!parsed.underlineLinks,
      dyslexiaFriendly: !!parsed.dyslexiaFriendly,
      invertColors: !!parsed.invertColors,
      grayscale: !!parsed.grayscale,
      bigCursor: !!parsed.bigCursor,
      hideImages: !!parsed.hideImages,
      language: parsed.language === "hi" ? "hi" : "en",
    });
  } catch {
    return mergePreferredLanguage({ ...DEFAULT_STATE });
  }
};

/**
 * Org UI Standard accessibility preferences (font, contrast, options).
 * Applies dataset + classes on <html> and persists to localStorage.
 */
export const AccessibilityProvider = ({ children }) => {
  const [state, setState] = useState(readStored);

  useEffect(() => {
    const root = document.documentElement;
    const fontClass = FONT_TO_CLASS[state.fontSize] || "user-base";

    SIZE_KEYS.forEach((key) => root.classList.remove(FONT_SIZES[key].className));
    root.classList.add(fontClass);
    localStorage.setItem("fontSize", fontClass);

    root.dataset.fontSize = state.fontSize;
    root.lang = state.language === "hi" ? "hi" : "en";
    root.dataset.colorScheme = state.colorScheme;
    // Keep attribute in sync for any legacy selectors
    if (state.colorScheme === "standard") {
      root.removeAttribute("data-login-contrast");
    } else {
      root.setAttribute("data-login-contrast", state.colorScheme);
    }
    root.dataset.textSpacing = state.textSpacing ? "on" : "off";
    root.dataset.highlightLinks = state.highlightLinks ? "on" : "off";
    root.dataset.underlineLinks = state.underlineLinks ? "on" : "off";
    root.dataset.dyslexia = state.dyslexiaFriendly ? "on" : "off";
    root.dataset.invert = state.invertColors ? "on" : "off";
    root.dataset.grayscale = state.grayscale ? "on" : "off";
    root.dataset.bigCursor = state.bigCursor ? "on" : "off";
    root.dataset.hideImages = state.hideImages ? "on" : "off";

    const classMap = [
      [state.textSpacing, "a11y-text-spacing"],
      [state.highlightLinks, "a11y-highlight-links"],
      [state.underlineLinks, "a11y-underline-links"],
      [state.dyslexiaFriendly, "a11y-dyslexia"],
      [state.invertColors, "a11y-invert"],
      [state.grayscale, "a11y-grayscale"],
      [state.bigCursor, "a11y-big-cursor"],
      [state.hideImages, "a11y-hide-images"],
    ];
    classMap.forEach(([on, cls]) => {
      root.classList.toggle(cls, !!on);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const patch = useCallback((partial) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggle = useCallback((key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = useMemo(() => {
    const idx = FONT_KEYS.indexOf(state.fontSize);
    const safeIdx = idx < 0 ? 2 : idx;
    return {
      ...state,
      currentSize: FONT_SIZES[FONT_TO_CLASS[state.fontSize] || "user-base"],
      isAtBase: state.fontSize === "md",
      canIncrease: safeIdx < FONT_KEYS.length - 1,
      canDecrease: safeIdx > 0,
      increaseFont: () =>
        patch({ fontSize: FONT_KEYS[Math.min(safeIdx + 1, FONT_KEYS.length - 1)] }),
      decreaseFont: () =>
        patch({ fontSize: FONT_KEYS[Math.max(safeIdx - 1, 0)] }),
      resetFont: () => patch({ fontSize: "md" }),
      setColorScheme: (colorScheme) =>
        patch({
          colorScheme: COLOR_SCHEMES.includes(colorScheme)
            ? colorScheme
            : "standard",
        }),
      setLanguage: (language) =>
        patch({ language: language === "hi" ? "hi" : "en" }),
      toggleTextSpacing: () => toggle("textSpacing"),
      toggleHighlightLinks: () => toggle("highlightLinks"),
      toggleUnderlineLinks: () => toggle("underlineLinks"),
      toggleDyslexiaFriendly: () => toggle("dyslexiaFriendly"),
      toggleInvertColors: () => toggle("invertColors"),
      toggleGrayscale: () => toggle("grayscale"),
      toggleBigCursor: () => toggle("bigCursor"),
      toggleHideImages: () => toggle("hideImages"),
      resetAll: () => setState({ ...DEFAULT_STATE, language: state.language }),
    };
  }, [state, patch, toggle]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return ctx;
};

/** Safe hook — returns null outside provider (for optional chrome). */
export const useAccessibilityOptional = () => useContext(AccessibilityContext);

export default AccessibilityContext;
