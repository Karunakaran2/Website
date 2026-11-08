import React from "react";
import {
  PAGE_SECTION_HEADER_SHELL_CLASS,
  PAGE_SECTION_SHELL_CLASS,
} from "../page/pageHeaderStyles";
import SkeletonBlock from "./SkeletonBlock";
import FormSkeleton from "./FormSkeleton";
import ProbityTablePageSkeleton from "./ProbityTablePageSkeleton";

/**
 * Full card page skeleton — route lazy-load and profile/list pages.
 * variant: "table" | "form" | "profile"
 */
export default function PageCardSkeleton({
  variant = "table",
  rows = 6,
  columns = 6,
  formFields = 12,
  className = "",
  message = "Loading page content…",
}) {
  if (variant === "table") {
    return (
      <ProbityTablePageSkeleton
        filterLayout="inbox"
        rows={rows}
        columns={columns}
        showRowNumbers
        message={message}
        className={className}
      />
    );
  }

  return (
    <div
      className={`${PAGE_SECTION_SHELL_CLASS} flex min-h-0 w-full flex-col font-sans ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`${PAGE_SECTION_HEADER_SHELL_CLASS} flex items-center gap-2`}>
        <SkeletonBlock className="h-3.5 w-3.5 shrink-0 rounded" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-36 sm:w-48" />
          <SkeletonBlock className="h-3 w-52 sm:w-72 max-w-full" />
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <FormSkeleton fields={formFields} cols={variant === "profile" ? 3 : 3} />
      </div>

      <span className="sr-only">{message}</span>
    </div>
  );
}
