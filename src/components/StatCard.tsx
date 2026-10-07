/** Compact statistic tile used on citizen + admin dashboards. */
export default function StatCard({
  label,
  value,
  accent = "navy",
  hint,
}: {
  label: string;
  value: number | string;
  accent?: "navy" | "red" | "orange" | "amber" | "green" | "water";
  hint?: string;
}) {
  const accents: Record<string, string> = {
    navy: "border-navy-200 bg-navy-50 text-navy-800",
    red: "border-red-200 bg-red-50 text-red-800",
    orange: "border-orange-200 bg-orange-50 text-orange-900",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    green: "border-green-200 bg-green-50 text-green-800",
    water: "border-water-500/30 bg-water-500/10 text-water-600",
  };
  return (
    <div
      className={`animate-fade-up rounded-2xl border p-4 ${accents[accent]}`}
      role="group"
      aria-label={`${label}: ${value}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">
        {label}
      </p>
      <p className="mt-1 text-3xl font-extrabold leading-none">{value}</p>
      {hint && <p className="mt-1.5 text-xs opacity-75">{hint}</p>}
    </div>
  );
}
