import { Link, Outlet, useLocation } from "react-router-dom";
import { Droplets } from "lucide-react";
import BottomNav from "./BottomNav";
import { DEMO_DISCLAIMER } from "../lib/meta";

/**
 * Shared shell for citizen-facing pages: header, demo labeling,
 * disclaimer footer, and the mobile bottom navigation.
 */
export default function CitizenLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-navy-950 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-water-500/20 text-water-400">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold tracking-tight">
                FloodWatch
              </span>
              <span className="block text-xs text-water-400">Guwahati</span>
            </span>
          </Link>
          <span
            className="rounded-md border border-amber-400/50 bg-amber-400/10 px-2 py-1 text-[10px] font-bold tracking-widest text-amber-300"
            title="This application is a prototype using sample data"
          >
            DEMO MODE
          </span>
        </div>
      </header>

      <main
        key={pathname}
        className="page-enter mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5"
      >
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 pb-24 text-center text-xs leading-relaxed text-slate-500">
        <p>{DEMO_DISCLAIMER}</p>
      </footer>

      <BottomNav />
    </div>
  );
}
