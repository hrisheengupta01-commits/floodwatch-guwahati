import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  ArrowLeft,
  Droplets,
} from "lucide-react";
import { DEMO_DISCLAIMER } from "../lib/meta";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/reports", label: "All Reports", icon: ListChecks, end: false },
];

/** Admin navigation sidebar: top bar on mobile, full sidebar on desktop. */
export default function AdminSidebar() {
  return (
    <aside className="border-b border-navy-800 bg-navy-950 text-white lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2.5 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-water-500/20 text-water-400">
          <Droplets className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-bold">FloodWatch Admin</p>
          <p className="text-xs text-water-400">Guwahati Flood Monitoring</p>
        </div>
      </div>
      <nav aria-label="Admin navigation" className="px-3 pb-3">
        <ul className="flex gap-2 lg:flex-col">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-water-500/15 text-water-300"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
          <li className="lg:mt-4">
            <Link
              to="/"
              className="flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Back to app
            </Link>
          </li>
        </ul>
      </nav>
      <p className="hidden px-4 pb-4 text-[11px] leading-relaxed text-slate-400 lg:block">
        {DEMO_DISCLAIMER}
      </p>
    </aside>
  );
}
