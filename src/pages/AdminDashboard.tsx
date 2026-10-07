import { Link } from "react-router-dom";
import { ListChecks, ArrowRight } from "lucide-react";
import { useFloodReports } from "../hooks/useFloodReports";
import { SEVERITY_META } from "../lib/meta";
import StatCard from "../components/StatCard";
import FloodMap from "../components/FloodMap";
import ReportTable from "../components/ReportTable";

export default function AdminDashboard() {
  const { reports } = useFloodReports();

  const active = reports.filter(
    (r) => r.status !== "resolved" && r.status !== "rejected"
  );
  const severe = reports.filter(
    (r) => r.severity === "severe" && r.status !== "resolved" && r.status !== "rejected"
  );
  const critical = reports.filter(
    (r) => r.severity === "critical" && r.status !== "resolved" && r.status !== "rejected"
  );
  const resolved = reports.filter((r) => r.status === "resolved");

  const recent = [...reports]
    .sort(
      (a, b) =>
        new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    )
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <section aria-labelledby="admin-stats-heading">
        <h2 id="admin-stats-heading" className="sr-only">
          Dashboard statistics
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total Reports" value={reports.length} accent="navy" />
          <StatCard label="Active Floods" value={active.length} accent="water" />
          <StatCard label="Severe" value={severe.length} accent="orange" />
          <StatCard label="Critical" value={critical.length} accent="red" />
          <StatCard label="Resolved" value={resolved.length} accent="green" />
        </div>
      </section>

      {/* Map */}
      <section aria-labelledby="admin-map-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="admin-map-heading" className="text-base font-bold text-slate-800">
            All Reports Map
          </h2>
          <Link
            to="/map"
            className="text-xs font-semibold text-navy-600 hover:underline"
          >
            Citizen view
          </Link>
        </div>
        <FloodMap reports={reports} className="h-[340px] sm:h-[440px]" />
      </section>

      {/* Recent reports table */}
      <section aria-labelledby="admin-recent-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 id="admin-recent-heading" className="text-base font-bold text-slate-800">
            Recent Reports
          </h2>
          <Link
            to="/admin/reports"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-navy-200 bg-white px-3.5 text-sm font-bold text-navy-700 transition hover:bg-navy-50"
          >
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            All Reports
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ReportTable reports={recent} />
        <p className="mt-3 text-xs text-slate-400">
          Severity legend:{" "}
          {(["low", "moderate", "severe", "critical"] as const).map(
            (s, i) => (
              <span key={s}>
                {i > 0 && " · "}
                <span className="font-semibold text-slate-500">
                  {SEVERITY_META[s].label}
                </span>
              </span>
            )
          )}{" "}
          - demo classifications only.
        </p>
      </section>
    </div>
  );
}
