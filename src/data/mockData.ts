import type { FloodAlert, FloodReport } from "../types";

const minutesAgo = (m: number): string =>
  new Date(Date.now() - m * 60_000).toISOString();

/**
 * Sample flood reports for demonstration ONLY.
 * Coordinates are approximate points around Guwahati and do NOT represent
 * real, current flood locations.
 */
export const SEED_REPORTS: FloodReport[] = [
  {
    id: "FW-2026-000124",
    latitude: 26.1556,
    longitude: 91.7703,
    locationName: "Bamunimaidam",
    severity: "severe",
    waterDepth: "2-3 feet",
    roadStatus: "blocked",
    description:
      "Water has accumulated across the lane and two-wheelers are unable to pass safely.",
    reportedAt: minutesAgo(18),
    status: "pending",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000119",
    latitude: 26.1047,
    longitude: 91.6712,
    locationName: "Pandu",
    severity: "moderate",
    waterDepth: "1-2 feet",
    roadStatus: "difficult",
    description:
      "Waterlogging near the ghati road after heavy rain. Cars are crawling through and smaller vehicles are struggling.",
    reportedAt: minutesAgo(32),
    status: "verified",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000122",
    latitude: 26.1642,
    longitude: 91.7435,
    locationName: "Zoo Road",
    severity: "low",
    waterDepth: "6-12 inches",
    roadStatus: "difficult",
    description:
      "Shallow waterlogging along the service lane near the zoo crossing. Drainage appears clogged.",
    reportedAt: minutesAgo(62),
    status: "verified",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000121",
    latitude: 26.1631,
    longitude: 91.6882,
    locationName: "Maligaon",
    severity: "critical",
    waterDepth: "> 3 feet",
    roadStatus: "blocked",
    description:
      "Street completely flooded near the railway colony gate. Water is entering ground-floor houses.",
    reportedAt: minutesAgo(70),
    status: "in-progress",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000120",
    latitude: 26.1571,
    longitude: 91.7512,
    locationName: "Noonmati",
    severity: "severe",
    waterDepth: "2-3 feet",
    roadStatus: "blocked",
    description:
      "Refinery road under water. Heavy vehicles only; two-wheelers cannot pass.",
    reportedAt: minutesAgo(95),
    status: "in-progress",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000123",
    latitude: 26.1468,
    longitude: 91.7641,
    locationName: "Hatigaon",
    severity: "moderate",
    waterDepth: "1-2 feet",
    roadStatus: "difficult",
    description:
      "Standing water on the bylane behind the market. Vehicles are creating waves into doorways.",
    reportedAt: minutesAgo(140),
    status: "verified",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000118",
    latitude: 26.1253,
    longitude: 91.7672,
    locationName: "Beltola",
    severity: "moderate",
    waterDepth: "6-12 inches",
    roadStatus: "difficult",
    description:
      "Waterlogging at the Beltola-GS Road crossing. Traffic is moving slowly in both directions.",
    reportedAt: minutesAgo(185),
    status: "pending",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000117",
    latitude: 26.1672,
    longitude: 91.7571,
    locationName: "Chandmari",
    severity: "low",
    waterDepth: "< 6 inches",
    roadStatus: "passable",
    description:
      "Thin layer of water on the road shoulder. Passable but slippery for two-wheelers.",
    reportedAt: minutesAgo(240),
    status: "resolved",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000116",
    latitude: 26.1861,
    longitude: 91.7452,
    locationName: "Bharalumukh",
    severity: "severe",
    waterDepth: "1-2 feet",
    roadStatus: "blocked",
    description:
      "Low-lying lane near the embankment is under water. Residents are using boats to move essentials.",
    reportedAt: minutesAgo(310),
    status: "verified",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000115",
    latitude: 26.1441,
    longitude: 91.6853,
    locationName: "Jalukbari",
    severity: "low",
    waterDepth: "6-12 inches",
    roadStatus: "difficult",
    description:
      "Water pools near the flyover base after every shower. Passable at reduced speed.",
    reportedAt: minutesAgo(375),
    status: "resolved",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000114",
    latitude: 26.1358,
    longitude: 91.7392,
    locationName: "Rukminigaon",
    severity: "critical",
    waterDepth: "> 3 feet",
    roadStatus: "blocked",
    description:
      "Bylane completely inundated; drain overflow has reached doorsteps of every house on the row.",
    reportedAt: minutesAgo(430),
    status: "pending",
    reporterName: "Demo Citizen",
  },
  {
    id: "FW-2026-000113",
    latitude: 26.1785,
    longitude: 91.7102,
    locationName: "Basisthapur",
    severity: "low",
    waterDepth: "< 6 inches",
    roadStatus: "passable",
    description:
      "Minor waterlogging near the chariali. Should clear shortly after rain stops.",
    reportedAt: minutesAgo(520),
    status: "rejected",
    reporterName: "Demo Citizen",
  },
];

export const SEED_ALERTS: FloodAlert[] = [
  {
    id: "alert-1",
    kind: "critical",
    title: "CRITICAL ALERT",
    location: "Multiple low-lying areas",
    description:
      "Water levels reported above 3 ft in multiple low-lying areas. Avoid low-lying bylanes and keep children indoors.",
    updatedAt: minutesAgo(12),
  },
  {
    id: "alert-2",
    kind: "warning",
    title: "ROAD WARNING",
    location: "Maligaon & Noonmati",
    description:
      "Severe waterlogging reported. Avoid unnecessary travel through the affected areas.",
    updatedAt: minutesAgo(40),
  },
  {
    id: "alert-3",
    kind: "warning",
    title: "ROAD WARNING",
    location: "Bamunimaidam",
    description:
      "Road mostly blocked by standing water. Two-wheelers are unable to pass safely.",
    updatedAt: minutesAgo(55),
  },
  {
    id: "alert-4",
    kind: "info",
    title: "MONSOON ADVISORY",
    location: "Guwahati citywide",
    description:
      "Heavy rainfall is expected through the evening. Report flooding in your bylane to keep neighbours informed.",
    updatedAt: minutesAgo(120),
  },
];

