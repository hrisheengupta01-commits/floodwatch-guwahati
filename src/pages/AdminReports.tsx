import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { ReportStatus, Severity } from "../types";
import { useFloodReports } from "../hooks/useFloodReports";
import { SEVERITY_ORDER, STATUS_META } from "../lib/meta";
import ReportTable from "../components/ReportTable";

type SeverityFilter = "all" | Severity;
type StatusFilter = "all" | ReportStatus;
type SortOption = "newest" | "oldest" | "severity";

const SEVERITY_OPTIONS: { value: SeverityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "severe", label: "Severe" },
  { value: "critical", label: "Critical" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "in-progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "severity", label: "Severity" },
];

function SelectControl({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-semibold text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 focus:border-navy-400"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function AdminReports() {
  const { reports } = useFloodReports();
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState<SeverityFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = reports.filter((r) => {
      const matchesSearch =
        query === "" ||
        r.locationName.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query);
      const matchesSeverity = severity === "all" || r.severity === severity;
      const matchesStatus = status === "all" || r.status === status;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
    result.sort((a, b) => {
      if (sort === "severity") {
        const diff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
        if (diff !== 0) return diff;
      }
      const aTime = new Date(a.reportedAt).getTime();
      const bTime = new Date(b.reportedAt).getTime();
      return sort === "oldest" ? aTime - bTime : bTime - aTime;
    });
    return result;
  }, [reports, search, severity, status, sort]);

  const hasFilters =
    search !== "" || severity !== "all" || status !== "all" || sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setSeverity("all");
    setStatus("all");
    setSort("newest");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Reports</h2>
          <p className="text-xs text-slate-500">
            {filtered.length} of {reports.length} reports match
          </p>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      <section
        className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        aria-label="Report filters"
      >
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <label htmlFor="admin-search" className="sr-only">
            Search location or report ID
          </label>
          <input
            id="admin-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location or report ID..."
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-400 focus:bg-white"
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-slate-500">Severity</p>
          <div className="flex flex-wrap gap-2">
            {SEVERITY_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={severity === o.value}
                onClick={() => setSeverity(o.value)}
                className={`min-h-[40px] rounded-full border px-4 text-sm font-semibold transition ${
                  severity === o.value
                    ? "border-navy-600 bg-navy-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SelectControl
            label="Status"
            value={status}
            onChange={(v) => setStatus(v as StatusFilter)}
            options={STATUS_OPTIONS}
          />
          <SelectControl
            label="Sort by"
            value={sort}
            onChange={(v) => setSort(v as SortOption)}
            options={SORT_OPTIONS}
          />
        </div>

        {status !== "all" && (
          <p className="text-xs text-slate-400">
            Showing only reports with status{" "}
            <span className="font-semibold">{STATUS_META[status].label}</span>.
          </p>
        )}
      </section>

      <ReportTable reports={filtered} />
    </div>
  );
}

