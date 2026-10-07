import type { ReportStatus, RoadStatus, Severity } from "../types";

export const SEVERITY_META: Record<
  Severity,
  {
    label: string;
    shortLabel: string;
    description: string;
    /** Tailwind text/background/border classes */
    chip: string;
    dot: string;
    marker: string;
    ring: string;
  }
> = {
  low: {
    label: "Low",
    shortLabel: "LOW",
    description: "Water on road but passable",
    chip: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
    marker: "#22c55e",
    ring: "ring-green-200",
  },
  moderate: {
    label: "Moderate",
    shortLabel: "MODERATE",
    description: "Difficult for vehicles",
    chip: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    marker: "#f59e0b",
    ring: "ring-amber-200",
  },
  severe: {
    label: "Severe",
    shortLabel: "SEVERE",
    description: "Road mostly blocked",
    chip: "bg-orange-100 text-orange-900 border-orange-200",
    dot: "bg-orange-500",
    marker: "#f97316",
    ring: "ring-orange-200",
  },
  critical: {
    label: "Critical",
    shortLabel: "CRITICAL",
    description: "Road completely flooded",
    chip: "bg-red-100 text-red-800 border-red-200",
    dot: "bg-red-500",
    marker: "#ef4444",
    ring: "ring-red-200",
  },
};

export const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  severe: 1,
  moderate: 2,
  low: 3,
};

export const STATUS_META: Record<
  ReportStatus,
  { label: string; chip: string; dot: string }
> = {
  pending: {
    label: "Pending",
    chip: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  verified: {
    label: "Verified",
    chip: "bg-sky-100 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
  },
  "in-progress": {
    label: "In Progress",
    chip: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
  },
  resolved: {
    label: "Resolved",
    chip: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    chip: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export const ROAD_STATUS_META: Record<
  RoadStatus,
  { label: string; icon: string }
> = {
  passable: { label: "Vehicles can pass", icon: "car" },
  difficult: { label: "Passable with difficulty", icon: "car" },
  blocked: { label: "Vehicles cannot pass", icon: "ban" },
  unknown: { label: "Unknown", icon: "help" },
};

export const WATER_DEPTH_OPTIONS = [
  "< 6 inches",
  "6–12 inches",
  "1–2 feet",
  "2–3 feet",
  "> 3 feet",
  "Unknown",
] as const;

export const ROAD_STATUS_OPTIONS: { value: RoadStatus; label: string }[] = [
  { value: "passable", label: "Yes" },
  { value: "difficult", label: "With difficulty" },
  { value: "blocked", label: "No" },
  { value: "unknown", label: "Unknown" },
];

export const DEMO_DISCLAIMER =
  "This prototype uses sample data and is not an official emergency warning system. For emergencies, contact the appropriate local emergency services.";

export const GUWAHATI_CENTER: [number, number] = [26.1445, 91.7362];
