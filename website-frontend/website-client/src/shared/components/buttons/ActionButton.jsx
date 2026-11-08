import React from "react";
import { Loader2 } from "lucide-react";
import { ACTION_VARIANTS } from "./actionVariants";

/**
 * Standard action button by semantic variant.
 * Variants: primary | submit | save | cancel | view | delete | remove | verify | add
 */
export default function ActionButton({
  variant = "primary",
  onClick,
  children,
  className = "",
  iconSize = 16,
  type = "button",
  disabled = false,
  loading = false,
  icon: IconOverride,
  hideIcon = false,
  iconOnly = false,
  form,
  ...rest
}) {
  const config = ACTION_VARIANTS[variant] || ACTION_VARIANTS.primary;
  const Icon = IconOverride !== undefined ? IconOverride : config.Icon;
  const label = iconOnly ? null : children ?? config.defaultLabel;
  const showIcon = !hideIcon && Icon;
  const iconOnlyClass = iconOnly ? "p-1.5" : "";

  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${config.className} ${iconOnlyClass} ${className}`.trim()}
      {...rest}
    >
      {loading ? (
        <>
          <Loader2 size={iconSize} className="animate-spin" aria-hidden />
          {label}
        </>
      ) : (
        <>
          {showIcon ? <Icon size={iconSize} aria-hidden /> : null}
          {label}
        </>
      )}
    </button>
  );
}
