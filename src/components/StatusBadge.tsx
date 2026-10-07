import type { ReportStatus } from "../types";
import { STATUS_META } from "../lib/meta";

/** Status chip used across citizen and admin screens. */
export default function StatusBadge({
  status,
  animate = false,
}: {
  status: ReportStatus;
  animate?: boolean;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.chip} ${
        animate ? "animate-scale-in" : ""
      }`}
      aria-label={`Status: ${meta.label}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}
