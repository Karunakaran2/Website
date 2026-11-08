import React from "react";
import { Lock } from "lucide-react";
import FormLabel from './FormLabel'
import { readOnlyValueClass } from './readOnlyFieldStyles'

export default function ReadOnlyField({
  label,
  value,
  fullWidth = false,
  showLock = false,
  wrapperClassName = "",
}) {
  return (
    <div
      className={`${fullWidth ? "sm:col-span-2 lg:col-span-3" : ""} ${wrapperClassName}`.trim()}
    >
      <FormLabel label={label} as="span" />
      <div
        className={`${readOnlyValueClass}${showLock ? " flex items-center gap-2" : ""}`}
        aria-readonly="true"
      >
        <span className={showLock ? "min-w-0 flex-1 truncate" : "block truncate"}>
          {value || "—"}
        </span>
        {showLock ? <Lock size={12} className="shrink-0 text-slate-400" aria-hidden /> : null}
      </div>
    </div>
  );
}
