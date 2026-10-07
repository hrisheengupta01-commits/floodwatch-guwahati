export type Severity = "low" | "moderate" | "severe" | "critical";

export type RoadStatus = "passable" | "difficult" | "blocked" | "unknown";

export type ReportStatus =
  | "pending"
  | "verified"
  | "in-progress"
  | "resolved"
  | "rejected";

export interface FloodReport {
  id: string;
  latitude: number;
  longitude: number;
  locationName: string;
  severity: Severity;
  waterDepth: string;
  roadStatus: RoadStatus;
  description: string;
  photo?: string;
  reportedAt: string;
  status: ReportStatus;
  reporterName: string;
}

export interface FloodAlert {
  id: string;
  kind: "critical" | "warning" | "info";
  title: string;
  location: string;
  description: string;
  updatedAt: string;
}
