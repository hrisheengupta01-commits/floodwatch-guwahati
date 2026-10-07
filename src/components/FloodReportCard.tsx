import { Link } from "react-router-dom";
import { Droplets, ChevronRight } from "lucide-react";
import type { FloodReport } from "../types";
import { ROAD_STATUS_META, SEVERITY_META } from "../lib/meta";
import { timeAgo } from "../lib/time";
import StatusBadge from "./StatusBadge";

/** Card summarizing a single flood report for citizen-facing lists. */
export default function FloodReportCard({
  report,
  compact = false,
}: {
  report: FloodReport;
  compact?: boolean;
}) {
  const severity = SEVERITY_META[report.severity];
  const road = ROAD_STATUS_META[report.roadStatus];
  return (
    <Link
      to={`/admin/report/${report.id}`}
      className={`group block animate-fade-up rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-navy-300 hover:shadow-md ${
        compact ? "" : "min-h-[44px]"
      }`}
      aria-label={`Flood report ${report.id} at ${report.locationName}, severity ${severity.label}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 shrink-0 rounded-full ${severity.dot}`}
              aria-hidden="true"
            />
            <h3 className="truncate text-base font-semibold text-slate-900">
              {report.locationName}
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {severity.label} flooding · {road.label}
          </p>
        </div>
        <ChevronRight
          className="mt-1 h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-navy-600"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-md bg-water-500/10 px-2 py-1 font-medium text-water-600">
          <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
          Water: ~{report.waterDepth.replace(" feet", " ft").replace(" inches", " in")}
        </span>
        <span className="text-slate-500">Reported {timeAgo(report.reportedAt)}</span>
        <StatusBadge status={report.status} />
      </div>
      <span className="sr-only">{severity.label} severity</span>
    </Link>
  );
}
