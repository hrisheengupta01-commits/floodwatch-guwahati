import { AlertTriangle } from "lucide-react";
import ReportForm from "../components/ReportForm";
import { DEMO_DISCLAIMER } from "../lib/meta";

export default function Report() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Report Flooding</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tag the location, severity and condition of flooding on your road.
          Takes under a minute - no account needed.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          Severity levels are demo classifications for this prototype, not
          official government standards. {DEMO_DISCLAIMER}
        </p>
      </div>

      <ReportForm />
    </div>
  );
}
