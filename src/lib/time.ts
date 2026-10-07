/** Human-friendly relative time such as "18 min ago". */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "unknown";
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} mo ago`;
}

/** Longer form used on detail pages: "18 minutes ago". */
export function timeAgoLong(iso: string): string {
  const short = timeAgo(iso);
  if (short === "just now") return "just now";
  if (short === "yesterday") return "yesterday";
  if (short === "unknown") return "unknown";
  const map: Record<string, string> = {};
  void map;
  return short
    .replace(" min ago", " minutes ago")
    .replace(/(\d) hr ago/, "$1 hour ago")
    .replace(/(\d) hrs ago/, "$1 hours ago")
    .replace(" days ago", " days ago");
}

export function formatReportedShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown";
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
