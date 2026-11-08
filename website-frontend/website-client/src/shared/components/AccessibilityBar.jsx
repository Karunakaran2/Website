import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { useAccessibility } from "./context/AccessibilityContext";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { setLanguage } from "@/shared/redux/slices/language/languageSlice";
import { ROUTES } from "@/shared/constants";
import AccessibilityOptionsSidebar from "./AccessibilityOptionsSidebar";

/** Pixel-locked so fluid html rem cannot change the 36px GIGW utility bar. */
const TOOLBAR_CONTROL_H_CLASS = "h-[24px] min-h-[24px]";

const TOOLBAR_ROW_CLASS = `${TOOLBAR_CONTROL_H_CLASS} items-center`;

const toolbarItemClass = `inline-flex ${TOOLBAR_CONTROL_H_CLASS} shrink-0 items-center justify-center self-center leading-none [line-height:1]`;

const toolbarLabelClass = `${toolbarItemClass} px-0.5 text-[12px] font-medium text-slate-400 whitespace-nowrap`;

const toolbarDividerClass = `mx-0.5 inline-flex ${TOOLBAR_CONTROL_H_CLASS} shrink-0 items-center self-center`;

const A11yBtn = React.forwardRef(
  (
    {
      children,
      onClick,
      ariaLabel,
      active = false,
      className = "",
      "aria-haspopup": ariaHasPopup,
      "aria-expanded": ariaExpanded,
    },
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={typeof active === "boolean" ? active : undefined}
      aria-haspopup={ariaHasPopup}
      aria-expanded={ariaExpanded}
      title={ariaLabel}
      className={[
        "m-0 min-h-0 min-w-0 appearance-none rounded-[2px] px-1.5 text-[12px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c518] cursor-pointer border-0",
        toolbarItemClass,
        active
          ? "bg-[#f5c518] text-black"
          : "bg-transparent text-slate-200 hover:bg-white/10 hover:text-white",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  )
);
A11yBtn.displayName = "A11yBtn";

function ToolbarDivider() {
  return (
    <span className={toolbarDividerClass} aria-hidden>
      <span className="block h-3 w-px bg-slate-600" />
    </span>
  );
}

const LANGUAGE_MENU = [
  { code: "en", labelKey: "header.english", fallback: "English" },
  { code: "hi", labelKey: "header.hindi", fallback: "हिंदी" },
];

function languageMenuLabel(entry, t) {
  return t(entry.labelKey, { defaultValue: entry.fallback });
}

function LanguageDropdown({ currentCode, onSelect, t }) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const currentEntry =
    LANGUAGE_MENU.find((entry) => entry.code === currentCode) || LANGUAGE_MENU[0];

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: rect.right,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return undefined;
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const select = (code) => {
    onSelect(code);
    setOpen(false);
  };

  const menu =
    open && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={menuRef}
            role="listbox"
            aria-label={t("Language")}
            className="fixed z-[100010] min-w-[8.75rem] overflow-hidden rounded-md border border-slate-700 bg-slate-900 py-0.5 shadow-lg"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              transform: "translateX(-100%)",
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {LANGUAGE_MENU.map((entry) => {
              const selected = entry.code === currentCode;
              const label = languageMenuLabel(entry, t);
              return (
                <li key={entry.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => select(entry.code)}
                    className={[
                      "flex w-full cursor-pointer border-0 px-3 py-1.5 text-left text-[12px] font-medium transition focus:outline-none focus-visible:bg-white/10",
                      selected
                        ? "bg-[#f5c518] text-black"
                        : "bg-transparent text-slate-100 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div className="relative shrink-0">
      <A11yBtn
        ref={triggerRef}
        onClick={() => setOpen((value) => !value)}
        ariaLabel={t("Language")}
        active={open}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex gap-0.5 whitespace-nowrap pr-1"
      >
        <span>{languageMenuLabel(currentEntry, t)}</span>
        <ChevronDown
          size={12}
          strokeWidth={2.5}
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </A11yBtn>
      {menu}
    </div>
  );
}

const skipToMainContent = (e) => {
  e.preventDefault();
  const el = document.getElementById("main-content");
  if (!el) return;
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: false });
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/**
 * GIGW-style accessibility top bar — black strip, quick controls, options in right sidebar.
 */
const AccessibilityBar = ({ dense = false, optionsPortal = true }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { currentLanguage } = useSelector((state) => state.language) || {};
  const a11y = useAccessibility();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsRef = useRef(null);
  const optionsPanelRef = useRef(null);
  const optionsTriggerRef = useRef(null);

  useFocusTrap(optionsOpen, optionsPanelRef, { lockBodyScroll: true });

  const isHi =
    a11y.language === "hi" ||
    String(currentLanguage || i18n.language || "")
      .toLowerCase()
      .startsWith("hi");
  const isSmall = a11y.fontSize === "xs" || a11y.fontSize === "sm";
  const isLarge = a11y.fontSize === "lg" || a11y.fontSize === "xl";

  useEffect(() => {
    if (!optionsOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOptionsOpen(false);
        optionsTriggerRef.current?.focus?.({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [optionsOpen]);

  const applyLanguage = (code) => {
    const next = code === "hi" ? "hi" : "en";
    a11y.setLanguage(next);
    dispatch(setLanguage(next));
    i18n.changeLanguage(next);
  };

  const langCode = isHi ? "hi" : "en";

  const linkClass = [
    toolbarItemClass,
    "rounded-[2px] px-1.5 text-[12px] font-medium text-slate-200 no-underline transition hover:bg-white/10 hover:text-[#f5c518] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c518]",
  ].join(" ");

  const innerClass = dense
    ? `page-shell flex ${TOOLBAR_ROW_CLASS} flex-nowrap items-center justify-between gap-x-2 overflow-visible text-[12px] leading-none`
    : `page-shell flex h-full ${TOOLBAR_ROW_CLASS} w-full max-w-none flex-nowrap items-center justify-between gap-x-2 overflow-visible text-[12px] leading-none`;

  const closeOptions = () => {
    setOptionsOpen(false);
    optionsTriggerRef.current?.focus?.({ preventScroll: true });
  };

  const sidebar =
    typeof document !== "undefined" ? (
      <AccessibilityOptionsSidebar
        open={optionsOpen}
        panelRef={optionsPanelRef}
        onClose={closeOptions}
        a11y={a11y}
      />
    ) : null;

  return (
    <>
      <div className="relative z-[100] box-border flex h-[36px] min-h-[36px] max-h-[36px] items-center overflow-visible border-b border-slate-800 bg-black px-0 font-sans text-[12px] leading-none text-slate-200">
        <div className={`${innerClass} w-full`}>
          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
            <a
              href="#main-content"
              className={linkClass}
              onClick={skipToMainContent}
            >
              <span className="sm:hidden">{t("Skip")}</span>
              <span className="hidden sm:inline">{t("Skip to Main Content")}</span>
            </a>
            <span className="hidden sm:contents">
              <ToolbarDivider />
            </span>
            <Link to={ROUTES.SCREEN_READER_ACCESS} className={`hidden sm:inline-flex ${linkClass}`}>
              {t("Screen Reader Access")}
            </Link>
            <span className="hidden lg:contents">
              <ToolbarDivider />
            </span>
            <Link
              to={ROUTES.ACCESSIBILITY_STATEMENT}
              className={`hidden lg:inline-flex ${linkClass}`}
            >
              {t("Accessibility Statement")}
            </Link>
          </div>

          <div
            className="flex max-w-full shrink-0 items-center justify-end gap-1 overflow-x-auto sm:gap-1.5"
            role="group"
            aria-label={t("Accessibility controls")}
          >
            <span className={`hidden xl:inline-flex ${toolbarLabelClass}`}>{t("Text size")}</span>
            <A11yBtn
              onClick={a11y.decreaseFont}
              ariaLabel={t("Decrease text size")}
              active={isSmall}
            >
              A−
            </A11yBtn>
            <A11yBtn
              onClick={a11y.resetFont}
              ariaLabel={t("Default text size")}
              active={a11y.isAtBase}
            >
              A
            </A11yBtn>
            <A11yBtn
              onClick={a11y.increaseFont}
              ariaLabel={t("Increase text size")}
              active={isLarge}
            >
              A+
            </A11yBtn>

            <ToolbarDivider />

            <span className={`hidden xl:inline-flex ${toolbarLabelClass}`}>{t("Contrast")}</span>
            <A11yBtn
              onClick={() => a11y.setColorScheme("standard")}
              ariaLabel={t("Standard contrast")}
              active={a11y.colorScheme === "standard"}
              className="hidden sm:inline-flex"
            >
              {t("Standard")}
            </A11yBtn>
            <A11yBtn
              onClick={() => a11y.setColorScheme("high")}
              ariaLabel={t("High contrast")}
              active={a11y.colorScheme === "high"}
            >
              {t("High")}
            </A11yBtn>
            <A11yBtn
              onClick={() => a11y.setColorScheme("yellow")}
              ariaLabel={t("Yellow on black contrast")}
              active={a11y.colorScheme === "yellow"}
              className="hidden md:inline-flex"
            >
              {t("Yellow")}
            </A11yBtn>

            <ToolbarDivider />

            <LanguageDropdown
              currentCode={langCode}
              onSelect={applyLanguage}
              t={t}
            />

            <ToolbarDivider />

            <div
              className="relative flex shrink-0 items-center whitespace-nowrap"
              ref={optionsRef}
            >
              <A11yBtn
                ref={optionsTriggerRef}
                onClick={() => setOptionsOpen((o) => !o)}
                ariaLabel={t("Accessibility Options")}
                active={optionsOpen}
                aria-haspopup="dialog"
                aria-expanded={optionsOpen}
                className="shrink-0 whitespace-nowrap font-semibold"
              >
                <span className="sm:hidden">{t("Options")}</span>
                <span className="hidden sm:inline">{t("Accessibility Options")}</span>
              </A11yBtn>
            </div>
          </div>
        </div>
      </div>

      {optionsPortal && sidebar
        ? createPortal(sidebar, document.body)
        : !optionsPortal
          ? sidebar
          : null}
    </>
  );
};

export default AccessibilityBar;
