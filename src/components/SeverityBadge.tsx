import type { Severity } from "../types";
import { SEVERITY_META } from "../lib/meta";

const ICONS: Record<Severity, string> = {
  low: "○",
  moderate: "◐",
  severe: "●",
  critical: "▲",
};

/**
 * Severity chip. Uses an icon + text label in addition to color so severity
 * is never communicated by color alone (accessibility requirement).
 */
export default function SeverityBadge({
  severity,
  size = "md",
}: {
  severity: Severity;
  size?: "sm" | "md" | "lg";
}) {
  const meta = SEVERITY_META[severity];
  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : size === "lg"
        ? "text-sm px-3 py-1.5"
        : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${meta.chip} ${sizeClasses}`}
      aria-label={`Severity: ${meta.label}`}
    >
      <span aria-hidden="true">{ICONS[severity]}</span>
      {meta.shortLabel}
    </span>
  );
}
