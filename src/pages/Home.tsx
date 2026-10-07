import { Link } from "react-router-dom";
import {
  PlusCircle,
  Map as MapIcon,
  CloudRain,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { useFloodReports } from "../hooks/useFloodReports";
import { SEVERITY_META } from "../lib/meta";
import FloodReportCard from "../components/FloodReportCard";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const { reports } = useFloodReports();

  const active = reports.filter(
    (r) => r.status !== "resolved" && r.status !== "rejected"
  );
  const countBy = (sev: "low" | "moderate" | "severe" | "critical") =>
    active.filter((r) => r.severity === sev).length;

  const nearby = [...active]
    .sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    )
    .slice(0, 3);

  const criticalCount = countBy("critical");

  return (
    <div className="space-y-6">
      {/* Monsoon status card */}
      <section
        className="animate-fade-up overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 p-5 text-white shadow-lg"
        aria-labelledby="monsoon-heading"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              id="monsoon-heading"
              className="text-[11px] font-bold tracking-[0.2em] text-water-400"
            >
              MONSOON WATCH
            </p>
            <h2 className="mt-1 text-xl font-bold">Guwahati</h2>
            <p className="mt-1.5 max-w-sm text-sm text-slate-300">
              Flood reports are being monitored in your area.
            </p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-water-500/20 text-water-400">
            <CloudRain className="h-6 w-6" aria-hidden="true" />
          </span>
        </div>
        {criticalCount > 0 && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-500/15 px-3 py-2.5 text-sm text-red-100 ring-1 ring-red-400/30">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" aria-hidden="true" />
            <span>
              {criticalCount} critical report{criticalCount > 1 ? "s" : ""} open
              right now. Avoid completely flooded bylanes.
            </span>
          </p>
        )}
        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          Demo data - sample reports only, not live flood information.
        </p>
      </section>

      {/* Primary action */}
      <Link
        to="/report"
        className="flex min-h-[56px] animate-fade-up items-center justify-center gap-2.5 rounded-2xl bg-orange-500 px-6 text-lg font-extrabold tracking-wide text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 active:scale-[0.99]"
      >
        <PlusCircle className="h-6 w-6" aria-hidden="true" />
        REPORT FLOODING
      </Link>

      {/* Current situation */}
      <section aria-labelledby="situation-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2
            id="situation-heading"
            className="text-lg font-bold text-slate-900"
          >
            Current Situation
          </h2>
          <span className="text-xs text-slate-400">demo data</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Active Reports"
            value={active.length}
            accent="water"
            hint="Updated live on this device"
          />
          <StatCard
            label="Severe"
            value={countBy("severe")}
            accent="orange"
            hint={SEVERITY_META.severe.description}
          />
          <StatCard
            label="Moderate"
            value={countBy("moderate")}
            accent="amber"
            hint={SEVERITY_META.moderate.description}
          />
          <StatCard
            label="Low"
            value={countBy("low")}
            accent="green"
            hint={SEVERITY_META.low.description}
          />
        </div>
      </section>

      {/* Nearby flood reports */}
      <section aria-labelledby="nearby-heading">
        <h2 id="nearby-heading" className="mb-3 text-lg font-bold text-slate-900">
          Nearby Flood Reports
        </h2>
        {nearby.length === 0 ? (
          <EmptyState
            title="No active reports"
            message="No flooding has been reported nearby. Be the first to tag a waterlogged road."
            icon={CloudRain}
            action={
              <Link
                to="/report"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy-700 px-5 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                Report Flooding
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {nearby.map((report) => (
              <li key={report.id}>
                <FloodReportCard report={report} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Map shortcut */}
      <Link
        to="/map"
        className="flex min-h-[52px] items-center justify-between rounded-2xl border-2 border-navy-200 bg-white px-5 py-3.5 text-navy-800 transition hover:border-navy-400 hover:bg-navy-50"
      >
        <span className="flex items-center gap-2.5 text-base font-bold">
          <MapIcon className="h-5 w-5" aria-hidden="true" />
          View Flood Map
        </span>
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Link>
    </div>
  );
}

