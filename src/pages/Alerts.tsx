import {
  AlertOctagon,
  Construction,
  Info,
  MapPin,
  Clock,
  BellRing,
} from "lucide-react";
import { SEED_ALERTS } from "../data/mockData";
import { timeAgo } from "../lib/time";
import type { FloodAlert } from "../types";

const KIND_STYLE: Record<
  FloodAlert["kind"],
  { card: string; chip: string; icon: typeof AlertOctagon }
> = {
  critical: {
    card: "border-red-300 bg-red-50",
    chip: "bg-red-600 text-white",
    icon: AlertOctagon,
  },
  warning: {
    card: "border-orange-300 bg-orange-50",
    chip: "bg-orange-500 text-white",
    icon: Construction,
  },
  info: {
    card: "border-sky-200 bg-sky-50",
    chip: "bg-sky-600 text-white",
    icon: Info,
  },
};

export default function Alerts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Flood Alerts</h1>
          <p className="text-xs text-slate-500">
            Sample alerts for demonstration
          </p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <BellRing className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="space-y-3" role="list" aria-label="Flood alerts">
        {SEED_ALERTS.map((alert, index) => {
          const style = KIND_STYLE[alert.kind];
          const Icon = style.icon;
          return (
            <article
              key={alert.id}
              role="listitem"
              className={`animate-fade-up rounded-2xl border-l-4 p-4 shadow-sm ring-1 ring-slate-200/70 ${style.card}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold tracking-widest ${style.chip}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {alert.title}
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-slate-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {timeAgo(alert.updatedAt)}
                </span>
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                {alert.location}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {alert.description}
              </p>
            </article>
          );
        })}
      </div>

      <p className="rounded-xl bg-slate-100 px-3.5 py-3 text-center text-xs leading-relaxed text-slate-500">
        These are sample alerts. This prototype is not an official emergency
        warning system - for real emergencies, contact local authorities.
      </p>
    </div>
  );
}
