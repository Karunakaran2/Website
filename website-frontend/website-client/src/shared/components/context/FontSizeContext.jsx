import React, { useContext } from "react";
import AccessibilityContext, {
  AccessibilityProvider,
  useAccessibility,
} from "./AccessibilityContext";

/**
 * Font size API — backed by Org UI AccessibilityProvider.
 * Kept for existing imports (`useFontSize` / `FontSizeProvider`).
 */
export const FontSizeProvider = AccessibilityProvider;

export const useFontSize = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    return {
      currentSize: { className: "user-base", label: "Base" },
      increaseFont: () => {},
      decreaseFont: () => {},
      resetFont: () => {},
      canIncrease: false,
      canDecrease: false,
      isAtBase: true,
    };
  }
  return {
    currentSize: ctx.currentSize,
    increaseFont: ctx.increaseFont,
    decreaseFont: ctx.decreaseFont,
    resetFont: ctx.resetFont,
    canIncrease: ctx.canIncrease,
    canDecrease: ctx.canDecrease,
    isAtBase: ctx.isAtBase,
  };
};

export { useAccessibility, AccessibilityProvider };
