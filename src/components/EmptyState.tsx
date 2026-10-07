import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

/** Friendly empty state for lists with no matching items. */
export default function EmptyState({
  title,
  message,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  message: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
