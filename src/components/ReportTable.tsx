import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import type { FloodReport } from "../types";
import { ROAD_STATUS_META } from "../lib/meta";
import { timeAgo } from "../lib/time";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "./StatusBadge";

/**
 * Responsive report table: a real table on desktop, stacked cards on mobile.
 * Columns: Report ID, Location, Severity, Water Depth, Reported, Status, Action.
 */
export default function ReportTable({ reports }: { reports: FloodReport[] }) {
  if (reports.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
        No reports match the current filters.
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">
            Flood reports with severity, water depth, time and status
          </caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-4 py-3">Report ID</th>
              <th scope="col" className="px-4 py-3">Location</th>
              <th scope="col" className="px-4 py-3">Severity</th>
              <th scope="col" className="px-4 py-3">Water Depth</th>
              <th scope="col" className="px-4 py-3">Reported</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-slate-100 transition last:border-b-0 hover:bg-navy-50/50"
              >
                <td className="px-4 py-3 font-mono text-xs font-bold text-navy-800">
                  {report.id}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {report.locationName}
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={report.severity} size="sm" />
                </td>
                <td className="px-4 py-3 text-slate-600">{report.waterDepth}</td>
                <td className="px-4 py-3 text-slate-500">
                  {timeAgo(report.reportedAt)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/report/${report.id}`}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-navy-200 bg-navy-50 px-3 text-xs font-bold text-navy-700 transition hover:bg-navy-100"
                    aria-label={`View report ${report.id} at ${report.locationName}`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 lg:hidden">
        {reports.map((report, index) => (
          <li key={report.id}>
            <Link
              to={`/admin/report/${report.id}`}
              className="animate-fade-up block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-navy-300"
              style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-navy-800">
                  {report.id}
                </span>
                <StatusBadge status={report.status} />
              </div>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {report.locationName}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <SeverityBadge severity={report.severity} size="sm" />
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                  Water: {report.waterDepth}
                </span>
                <span>{timeAgo(report.reportedAt)}</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                {ROAD_STATUS_META[report.roadStatus].label}
              </p>
              <span className="mt-3 flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg bg-navy-700 text-sm font-bold text-white">
                <Eye className="h-4 w-4" aria-hidden="true" />
                View
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
