import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, Home, FileText } from "lucide-react";
import { useFloodReports } from "../hooks/useFloodReports";
import StatusBadge from "../components/StatusBadge";

export default function ReportSuccess() {
  const location = useLocation();
  const { reports } = useFloodReports();
  const stateId = (location.state as { reportId?: string } | null)?.reportId;

  const [reportId, setReportId] = useState<string | null>(stateId ?? null);

  useEffect(() => {
    if (reportId) return;
    const stored = sessionStorage.getItem("lastSubmittedReportId");
    if (stored && reports.some((r) => r.id === stored)) {
      setReportId(stored);
    }
  }, [reportId, reports]);

  const report = reportId
    ? reports.find((r) => r.id === reportId)
    : undefined;

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircle2 className="h-11 w-11" aria-hidden="true" />
      </span>

      <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
        Flood Report Submitted
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Thank you for helping keep Guwahati informed.
      </p>

      <dl className="mt-6 w-full max-w-sm space-y-3 text-left">
        <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white px-4 py-3.5">
          <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Report ID
          </dt>
          <dd className="mt-1 font-mono text-lg font-bold text-navy-800">
            {reportId ?? "FW-2026-------"}
          </dd>
        </div>
        <div
          className="animate-fade-up rounded-2xl border border-slate-200 bg-white px-4 py-3.5"
          style={{ animationDelay: "80ms" }}
        >
          <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Status
          </dt>
          <dd className="mt-1.5">
            <StatusBadge status={report?.status ?? "pending"} />
            <span className="mt-1.5 block text-xs text-slate-500">
              Pending Verification - an admin will review it shortly.
            </span>
          </dd>
        </div>
        {report && (
          <div
            className="animate-fade-up rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left"
            style={{ animationDelay: "160ms" }}
          >
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Location
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {report.locationName}
            </dd>
            <dd className="text-xs capitalize text-slate-500">
              {report.severity} severity · water ~{report.waterDepth}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-7 flex w-full max-w-sm flex-col gap-3">
        <Link
          to={report ? `/admin/report/${report.id}` : "/profile"}
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-navy-700 px-5 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
          View Report
        </Link>
        <Link
          to="/"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-slate-300"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          Back to Home
        </Link>
      </div>

      <p className="mt-6 max-w-sm text-[11px] leading-relaxed text-slate-400">
        This is a prototype. Reports are stored locally in your browser and are
        not sent to any emergency service.
      </p>
    </div>
  );
}
