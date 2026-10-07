import { useCallback, useEffect, useState } from "react";
import type { FloodReport, ReportStatus } from "../types";
import { SEED_REPORTS } from "../data/mockData";

const STORAGE_KEY = "floodReports";
const LAST_ID_KEY = "floodReportCounter";
const MY_IDS_KEY = "floodMyReportIds";
/** The demo citizen "owns" these sample reports by default. */
const DEFAULT_MY_IDS = ["FW-2026-000124", "FW-2026-000119"];


function readStorage(): FloodReport[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = SEED_REPORTS.map((r) => ({ ...r }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid storage shape");
    return parsed as FloodReport[];
  } catch (err) {
    console.warn("FloodWatch: could not read localStorage, using seed data.", err);
    return SEED_REPORTS.map((r) => ({ ...r }));
  }
}

function writeStorage(reports: FloodReport[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.warn("FloodWatch: could not write to localStorage.", err);
  }
}

function nextReportId(reports: FloodReport[]): string {
  let counter = 124;
  try {
    const stored = window.localStorage.getItem(LAST_ID_KEY);
    if (stored) counter = Math.max(counter, Number(stored) || 0);
  } catch {
    /* ignore */
  }
  for (const r of reports) {
    const match = r.id.match(/(\d+)$/);
    if (match) counter = Math.max(counter, Number(match[1]));
  }
  counter += 1;
  try {
    window.localStorage.setItem(LAST_ID_KEY, String(counter));
  } catch {
    /* ignore */
  }
  return `FW-2026-${String(counter).padStart(6, "0")}`;
}

/** Shared reactive store so every screen updates when reports change. */
let memoryReports: FloodReport[] | null = null;
const listeners = new Set<() => void>();

function getReports(): FloodReport[] {
  if (memoryReports === null) memoryReports = readStorage();
  return memoryReports;
}

function setReports(next: FloodReport[]): void {
  memoryReports = next;
  writeStorage(next);
  listeners.forEach((l) => l());
}

function readMyIds(): string[] {
  try {
    const raw = window.localStorage.getItem(MY_IDS_KEY);
    if (!raw) return [...DEFAULT_MY_IDS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [...DEFAULT_MY_IDS];
  } catch {
    return [...DEFAULT_MY_IDS];
  }
}

function addMyId(id: string): void {
  try {
    const current = readMyIds();
    if (!current.includes(id)) {
      window.localStorage.setItem(
        MY_IDS_KEY,
        JSON.stringify([id, ...current])
      );
    }
  } catch {
    /* ignore */
  }
}

export function useFloodReports() {
  const [reports, setLocal] = useState<FloodReport[]>(() => getReports());
  const [myReportIds, setMyReportIds] = useState<string[]>(() => readMyIds());

  useEffect(() => {
    const listener = () => {
      setLocal(getReports());
      setMyReportIds(readMyIds());
    };
    listeners.add(listener);
    listener();
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const addReport = useCallback(
    (input: Omit<FloodReport, "id" | "reportedAt" | "status" | "reporterName"> & {
      reporterName?: string;
    }): FloodReport => {
      const report: FloodReport = {
        ...input,
        id: nextReportId(getReports()),
        reportedAt: new Date().toISOString(),
        status: "pending",
        reporterName: input.reporterName ?? "Demo Citizen",
      };
      setReports([report, ...getReports()]);
      addMyId(report.id);
      setMyReportIds(readMyIds());
      return report;
    },
    []
  );

  const updateReportStatus = useCallback(
    (id: string, status: ReportStatus): FloodReport | undefined => {
      let updated: FloodReport | undefined;
      const next = getReports().map((r) => {
        if (r.id === id) {
          updated = { ...r, status };
          return updated;
        }
        return r;
      });
      if (updated) setReports(next);
      return updated;
    },
    []
  );

  const getReport = useCallback(
    (id: string): FloodReport | undefined => getReports().find((r) => r.id === id),
    []
  );

  const resetToSeed = useCallback(() => {
    const seeded = SEED_REPORTS.map((r) => ({ ...r }));
    setReports(seeded);
    try {
      window.localStorage.setItem(MY_IDS_KEY, JSON.stringify(DEFAULT_MY_IDS));
    } catch {
      /* ignore */
    }
    setMyReportIds([...DEFAULT_MY_IDS]);
  }, []);

  return {
    reports,
    myReportIds,
    addReport,
    updateReportStatus,
    getReport,
    resetToSeed,
  };
}

