import { Link } from "react-router-dom";
import {
  User,
  ShieldCheck,
  PlusCircle,
  FileText,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { useFloodReports } from "../hooks/useFloodReports";
import { timeAgo } from "../lib/time";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

const DEMO_USER = {
  name: "Demo Citizen",
  area: "Guwahati, Assam",
  joined: "Monsoon season 2026",
};

export default function Profile() {
  const { reports, myReportIds, resetToSeed } = useFloodReports();

  const myReports = reports
    .filter((r) => myReportIds.includes(r.id))
    .sort(
      (a, b) =>
        new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );

  return (
    <div className="space-y-6">
      {/* Identity card */}
      <section
        className="animate-fade-up rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 p-5 text-white shadow-lg"
        aria-labelledby="profile-heading"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-water-500/20 text-water-300 ring-2 ring-water-400/40">
            <User className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 id="profile-heading" className="text-lg font-bold">
              {DEMO_USER.name}
            </h1>
            <p className="text-sm text-slate-300">{DEMO_USER.area}</p>
            <p className="text-xs text-slate-400">{DEMO_USER.joined}</p>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-water-400" aria-hidden="true" />
          Demo profile - no sign-in required for this prototype.
        </p>
      </section>

      {/* My reports */}
      <section aria-labelledby="my-reports-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="my-reports-heading" className="text-lg font-bold text-slate-900">
            My Reports
          </h2>
          <span className="text-xs text-slate-400">
            {myReports.length} total
          </span>
        </div>

        {myReports.length === 0 ? (
          <EmptyState
            title="You haven't reported yet"
            message="Reports you submit from this device will appear here with their live status."
            icon={FileText}
            action={
              <Link
                to="/report"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                <PlusCircle className="h-4 w-4" aria-hidden="true" />
                Report Flooding
              </Link>
            }
          />
        ) : (
          <ul className="space-y-3">
            {myReports.map((report, index) => (
              <li key={report.id}>
                <Link
                  to={`/admin/report/${report.id}`}
                  className="animate-fade-up block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-navy-300 hover:shadow-md"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm font-bold text-navy-800">
                      {report.id}
                    </span>
                    <StatusBadge status={report.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {report.locationName}
                    </span>
                    <SeverityBadge severity={report.severity} size="sm" />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">
                    Reported {timeAgo(report.reportedAt)} · water ~
                    {report.waterDepth}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Admin access */}
      <section
        className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/60 p-4"
        aria-labelledby="admin-access-heading"
      >
        <h2
          id="admin-access-heading"
          className="text-sm font-bold uppercase tracking-widest text-navy-700"
        >
          Demo Controls
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          This prototype has no password protection.
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          <Link
            to="/admin"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-navy-800 px-5 text-sm font-bold text-white transition hover:bg-navy-900"
          >
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Open Admin Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Reset all demo reports back to the original sample data?"
                )
              ) {
                resetToSeed();
              }
            }}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset Demo Data
          </button>
        </div>
      </section>
    </div>
  );
}
