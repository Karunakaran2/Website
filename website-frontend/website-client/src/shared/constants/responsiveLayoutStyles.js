/**
 * Application-wide responsive layout tokens (Tailwind class strings).
 * Chrome gutters align with GIGW 20px at sm+; narrow phones use 12px.
 */

/** Horizontal inset for header, gold nav, module tabs, footer, a11y bar (.page-shell). */
export const ORG_CHROME_GUTTER_CLASS = 'px-3 sm:px-5 xl:px-[20px]'

/** Prevent flex/grid children from forcing page-level horizontal scroll. */
export const APP_MIN_WIDTH_ZERO_CLASS = 'min-w-0 max-w-full w-full'

/** Optional cap for long-form docs / guidelines (not domain CRUD listings). */
export const APP_READING_COLUMN_CLASS = 'mx-auto w-full max-w-[min(100%,48rem)]'

/** Wide dashboards on large displays — full width within main, no artificial 7xl cap. */
export const APP_WIDE_CONTENT_CLASS = 'mx-auto w-full max-w-[min(100%,100rem)] 3xl:max-w-[min(100%,120rem)]'
