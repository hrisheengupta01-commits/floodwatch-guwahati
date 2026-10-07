import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ListFilter } from "lucide-react";
import type { Severity } from "../types";
import { useFloodReports } from "../hooks/useFloodReports";
import { SEVERITY_META } from "../lib/meta";
import FloodMap from "../components/FloodMap";
import FloodReportCard from "../components/FloodReportCard";
import EmptyState from "../components/EmptyState";

type SeverityFilter = "all" | Severity;
type StatusFilter = "active" | "resolved";

const SEVERITY_FILTERS: { value: SeverityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "critical", label: "Critical" },
];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
];

function FilterChip({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-semibold transition ${
        active
          ? "border-navy-600 bg-navy-700 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
      }`}
    >
      {dotColor && (
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotColor}`}
          aria-hidden="true"
        />
      )}
      {label}
    </button>
  );
}

export default function MapPage() {
  const { reports } = useFloodReports();
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const sevOk =
        severityFilter === "all" || r.severity === severityFilter;
      const isActive = r.status !== "resolved" && r.status !== "rejected";
      const statusOk =
        statusFilter === "active" ? isActive : !isActive;
      return sevOk && statusOk;
    });
  }, [reports, severityFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Flood Map</h1>
          <p className="text-xs text-slate-500">
            Sample reports around Guwahati - demo only
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
          <ListFilter className="h-3.5 w-3.5" aria-hidden="true" />
          {filtered.length} shown
        </span>
      </div>

      {/* Filters */}
      <div className="space-y-2" role="group" aria-label="Map filters">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {SEVERITY_FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={severityFilter === f.value}
              onClick={() => setSeverityFilter(f.value)}
              dotColor={
                f.value === "all" ? undefined : SEVERITY_META[f.value].dot
              }
            />
          ))}
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
            />
          ))}
        </div>
      </div>

      {/* Map */}
      <FloodMap reports={filtered} className="h-[380px] sm:h-[460px]" />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs text-slate-600 ring-1 ring-slate-200">
        <span className="font-semibold text-slate-700">Legend:</span>
        {(["low", "moderate", "severe", "critical"] as Severity[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span
              className={`h-3 w-3 rounded-full ${SEVERITY_META[s].dot}`}
              aria-hidden="true"
            />
            {SEVERITY_META[s].label}
          </span>
        ))}
      </div>

      {/* List under the map */}
      <section aria-labelledby="map-list-heading">
        <h2 id="map-list-heading" className="mb-3 text-lg font-bold text-slate-900">
          Reports on this view
        </h2>
        {filtered.length === 0 ? (
          <EmptyState
            title="No reports match"
            message="Try a different severity or status filter."
            icon={MapPin}
          />
        ) : (
          <ul className="space-y-3">
            {filtered.map((report) => (
              <li key={report.id}>
                <FloodReportCard report={report} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link
        to="/report"
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-600"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        REPORT FLOODING HERE
      </Link>
    </div>
  );
}
