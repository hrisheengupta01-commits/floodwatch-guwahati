import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import type { FloodReport } from "../types";
import { GUWAHATI_CENTER, ROAD_STATUS_META, SEVERITY_META } from "../lib/meta";
import { timeAgo } from "../lib/time";

function makeIcon(severity: keyof typeof SEVERITY_META, size: number): L.DivIcon {
  const color = SEVERITY_META[severity].marker;
  return L.divIcon({
    className: "",
    html: `<span class="fw-marker" style="width:${size}px;height:${size}px;background:${color}"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function MapClickCapture({
  onPick,
  enabled,
}: {
  onPick?: (lat: number, lng: number) => void;
  enabled: boolean;
}) {
  useMapEvents({
    click(e) {
      if (enabled && onPick) onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface FloodMapProps {
  reports: FloodReport[];
  /** Enables tap-to-place-marker mode used by the report form. */
  pickMode?: boolean;
  pickedLocation?: { latitude: number; longitude: number } | null;
  onPick?: (lat: number, lng: number) => void;
  showPopups?: boolean;
  className?: string;
  scrollWheelZoom?: boolean;
}

/**
 * Leaflet map of demo flood reports around Guwahati.
 * All points shown are sample/demo data, not live flood locations.
 */
export default function FloodMap({
  reports,
  pickMode = false,
  pickedLocation,
  onPick,
  showPopups = true,
  className = "h-72",
  scrollWheelZoom = true,
}: FloodMapProps) {
  const markers = useMemo(
    () =>
      reports.map((r) => ({
        report: r,
        icon: makeIcon(r.severity, r.severity === "critical" ? 24 : 20),
      })),
    [reports]
  );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 ${className}`}
    >
      <div className="absolute left-3 top-3 z-[500] rounded-lg bg-red-600/95 px-3 py-2 text-white shadow-lg">
        <p className="text-[11px] font-bold tracking-widest">DEMO DATA</p>
        <p className="max-w-[210px] text-[11px] leading-snug text-red-100">
          Flood locations shown are sample reports for demonstration.
        </p>
      </div>
      <MapContainer
        center={GUWAHATI_CENTER}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={scrollWheelZoom}
        className="h-full w-full"
        aria-label="Demo flood report map of Guwahati"
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickCapture enabled={pickMode} onPick={onPick} />
        {markers.map(({ report, icon }) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={icon}
            aria-label={`${report.locationName}, ${SEVERITY_META[report.severity].label} severity`}
          >
            {showPopups && (
              <Popup>
                <div className="min-w-[190px]">
                  <p className="text-sm font-bold text-slate-900">
                    {report.locationName}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">
                    {SEVERITY_META[report.severity].label} Flooding
                  </p>
                  <dl className="mt-2 space-y-1 text-[13px] text-slate-600">
                    <div>
                      <dt className="inline font-semibold text-slate-700">
                        Water depth:{" "}
                      </dt>
                      <dd className="inline">~{report.waterDepth}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-slate-700">
                        Road status:{" "}
                      </dt>
                      <dd className="inline">
                        {ROAD_STATUS_META[report.roadStatus].label}
                      </dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold text-slate-700">
                        Reported:{" "}
                      </dt>
                      <dd className="inline">{timeAgo(report.reportedAt)}</dd>
                    </div>
                  </dl>
                  <Link
                    to={`/admin/report/${report.id}`}
                    className="mt-3 flex min-h-[40px] items-center justify-center rounded-lg bg-navy-700 px-4 text-sm font-semibold text-white transition hover:bg-navy-800"
                  >
                    View Report
                  </Link>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
        {pickMode && pickedLocation && (
          <Marker
            position={[pickedLocation.latitude, pickedLocation.longitude]}
            icon={makeIcon("critical", 26)}
          >
            <Popup>Your selected location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
