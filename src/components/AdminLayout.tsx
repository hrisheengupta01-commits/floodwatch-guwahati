import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { DEMO_DISCLAIMER } from "../lib/meta";

/** Desktop-first admin shell with a sidebar (collapses to a top bar on mobile). */
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 lg:flex-row">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-navy-900">
              FloodWatch Admin
            </h1>
            <p className="text-xs text-slate-500">
              Guwahati Flood Monitoring · demo data only
            </p>
          </div>
          <span className="rounded-md border border-amber-400/50 bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-widest text-amber-700">
            DEMO MODE
          </span>
        </header>
        <main className="page-enter flex-1 px-4 py-5">
          <Outlet />
        </main>
        <footer className="border-t border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500 lg:hidden">
          {DEMO_DISCLAIMER}
        </footer>
      </div>
    </div>
  );
}
