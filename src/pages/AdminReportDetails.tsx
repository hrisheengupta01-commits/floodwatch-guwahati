import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  ThumbsDown,
  Loader,
  CheckCircle2,
  MapPin,
  Droplets,
  CarFront,
  Clock,
  FileText,
} from "lucide-react";
import type { ReportStatus } from "../types";
import { useFloodReports } from "../hooks/useFloodReports";
import {
  ROAD_STATUS_META,
  SEVERITY_META,
  DEMO_DISCLAIMER,
} from "../lib/meta";
import { timeAgoLong } from "../lib/time";
import SeverityBadge from "../components/SeverityBadge";
import StatusBadge from "../components/StatusBadge";

interface ActionDef {
  status: ReportStatus;
  label: string;
  icon: typeof BadgeCheck;
  style: string;
}

/** Actions available from each state of the status machine. */
const ACTIONS: Record<ReportStatus, ActionDef[]> = {
  pending: [
    {
      status: "verified",
      label: "VERIFY REPORT",
      icon: BadgeCheck,
      style: "bg-navy-700 text-white hover:bg-navy-800",
    },
    {
      status: "rejected",
      label: "REJECT REPORT",
      icon: ThumbsDown,
      style: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
    },
  ],
  verified: [
    {
      status: "in-progress",
      label: "MARK IN PROGRESS",
      icon: Loader,
      style: "bg-blue-600 text-white hover:bg-blue-700",
    },
    {
      status: "rejected",
      label: "REJECT REPORT",
      icon: ThumbsDown,
      style: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
    },
  ],
  "in-progress": [
    {
      status: "resolved",
      label: "MARK RESOLVED",
      icon: CheckCircle2,
      style: "bg-green-600 text-white hover:bg-green-700",
    },
  ],
  resolved: [],
  rejected: [],
};

const FLOW_NOTE: Record<ReportStatus, string> = {
  pending: "Flow: PENDING → VERIFIED → IN PROGRESS → RESOLVED (or REJECTED).",
  verified: "This report is verified. Next: IN PROGRESS, then RESOLVED.",
  "in-progress": "Field response underway. Next: mark the report RESOLVED.",
  resolved: "This report has been resolved. No further actions available.",
  rejected: "This report was rejected. No further actions available.",
};

export default function AdminReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReport, updateReportStatus } = useFloodReports();
  const report = id ? getReport(id) : undefined;

  if (!report) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <FileText className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-slate-800">
          Report not found
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The report ID {id ?? "—"} does not exist on this device.
        </p>
        <Link
          to="/admin/reports"
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-navy-700 px-5 text-sm font-bold text-white hover:bg-navy-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all reports
        </Link>
      </div>
    );
  }

  const severity = SEVERITY_META[report.severity];
  const road = ROAD_STATUS_META[report.roadStatus];
  const actions = ACTIONS[report.status];

  const handleAction = (next: ReportStatus) => {
    updateReportStatus(report.id, next);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-2 inline-flex min-h-[36px] items-center gap-1.5 text-sm font-semibold text-navy-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
          <h2 className="text-lg font-bold text-slate-900">Flood Report</h2>
          <p className="font-mono text-base font-bold text-navy-800">
            {report.id}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={report.status} animate />
          <SeverityBadge severity={report.severity} size="lg" />
        </div>
      </div>

      {/* Details card */}
      <section className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Location
            </dt>
            <dd className="mt-1 flex items-center gap-2 text-base font-semibold text-slate-900">
              <MapPin className="h-5 w-5 text-navy-500" aria-hidden="true" />
              {report.locationName}, Guwahati
            </dd>
            <dd className="text-xs text-slate-400">
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)} (demo
              coordinates)
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Severity
            </dt>
            <dd className="mt-1.5">
              <span
                className={`rounded-lg border px-3 py-1.5 text-sm font-bold tracking-wide ${severity.chip}`}
              >
                {severity.shortLabel}
              </span>
              <span className="mt-1 block text-xs text-slate-500">
                {severity.description} (demo classification)
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Water depth
            </dt>
            <dd className="mt-1.5 flex items-center gap-2 text-base font-semibold text-slate-800">
              <Droplets className="h-5 w-5 text-water-500" aria-hidden="true" />
              {report.waterDepth}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Road status
            </dt>
            <dd className="mt-1.5 flex items-center gap-2 text-base font-semibold text-slate-800">
              <CarFront className="h-5 w-5 text-slate-400" aria-hidden="true" />
              {road.label}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Reported
            </dt>
            <dd className="mt-1.5 flex items-center gap-2 text-base font-semibold text-slate-800">
              <Clock className="h-5 w-5 text-slate-400" aria-hidden="true" />
              {timeAgoLong(report.reportedAt)}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Description
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-slate-700">
              {report.description}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Reporter
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-700">
              {report.reporterName} (demo user)
            </dd>
          </div>
        </dl>
      </section>

      {/* Photo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Submitted photo
        </h3>
        {report.photo ? (
          <img
            src={report.photo}
            alt={`Submitted flood photo for ${report.locationName}`}
            className="mt-2 max-h-72 w-full rounded-xl border border-slate-200 object-contain bg-slate-50"
          />
        ) : (
          <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            <svg
              className="h-5 w-5 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            No photo was attached to this report.
          </div>
        )}
      </section>

      {/* Admin actions */}
      <section
        className="animate-fade-up rounded-2xl border-2 border-navy-100 bg-navy-50/60 p-5"
        aria-labelledby="admin-actions-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            id="admin-actions-heading"
            className="text-sm font-bold uppercase tracking-widest text-navy-800"
          >
            Admin actions
          </h3>
          <StatusBadge status={report.status} animate />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">{FLOW_NOTE[report.status]}</p>

        {actions.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.status}
                  type="button"
                  onClick={() => handleAction(action.status)}
                  className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold tracking-wide transition active:scale-[0.98] ${action.style}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {action.label}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-white px-4 py-3.5 text-sm text-slate-600 ring-1 ring-slate-200">
            This report is in the <strong>{report.status}</strong> state, so no
            further actions are available.
          </p>
        )}

        <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
          {DEMO_DISCLAIMER}
        </p>
      </section>
    </div>
  );
}

