import { NavLink } from "react-router-dom";
import {
  Home,
  Map,
  PlusCircle,
  BellRing,
  User,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  emphasized?: boolean;
}

const ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/report", label: "Report", icon: PlusCircle, emphasized: true },
  { to: "/alerts", label: "Alerts", icon: BellRing },
  { to: "/profile", label: "Profile", icon: User },
];

/** Mobile bottom navigation; the Report action is visually emphasized. */
export default function BottomNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
        {ITEMS.map(({ to, label, icon: Icon, emphasized }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                [
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-[11px] font-medium transition-colors",
                  emphasized
                    ? "text-navy-700"
                    : isActive
                      ? "text-navy-700"
                      : "text-slate-500 hover:text-navy-600",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      emphasized
                        ? "flex h-9 w-9 -translate-y-1 items-center justify-center rounded-full bg-navy-700 text-white shadow-md shadow-navy-700/30 ring-4 ring-white animate-pulse-ring"
                        : ""
                    }
                    aria-hidden="true"
                  >
                    <Icon
                      className={`h-5 w-5 ${emphasized && isActive ? "opacity-100" : ""}`}
                      strokeWidth={emphasized ? 2.4 : 2}
                    />
                  </span>
                  <span className={emphasized ? "-mt-1" : ""}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
