import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Crosshair,
  ImagePlus,
  X,
  AlertTriangle,
  CarFront,
  Droplets,
  Send,
} from "lucide-react";
import type { Severity, RoadStatus } from "../types";
import {
  GUWAHATI_CENTER,
  ROAD_STATUS_OPTIONS,
  SEVERITY_META,
  WATER_DEPTH_OPTIONS,
} from "../lib/meta";
import { fileToDataUrl } from "../lib/image";
import { useFloodReports } from "../hooks/useFloodReports";
import FloodMap from "./FloodMap";

interface FormErrors {
  location?: string;
  severity?: string;
  photo?: string;
  description?: string;
  form?: string;
}

function StepHeading({
  number,
  title,
  hint,
  id,
}: {
  number: number;
  title: string;
  hint?: string;
  id?: string;
}) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white"
        aria-hidden="true"
      >
        {number}
      </span>
      <div>
        <h2 id={id} className="text-base font-semibold text-slate-900">
          {title}
        </h2>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
}

type PickedLocation = { latitude: number; longitude: number } | null;

/**
 * Multi-step flood report form. All steps live on a single scrollable page
 * to keep the citizen reporting flow as short as possible.
 */
export default function ReportForm() {
  const navigate = useNavigate();
  const { addReport } = useFloodReports();

  const [location, setLocation] = useState<PickedLocation>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [locating, setLocating] = useState(false);
  const [severity, setSeverity] = useState<Severity | null>(null);
  const [waterDepth, setWaterDepth] = useState<string>("");
  const [roadStatus, setRoadStatus] = useState<RoadStatus | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultCenter = useMemo(
    () => ({
      latitude: GUWAHATI_CENTER[0],
      longitude: GUWAHATI_CENTER[1],
    }),
    []
  );

  const handleUseCurrentLocation = () => {
    setLocating(true);
    setErrors((e) => ({ ...e, location: undefined }));
    const finish = (lat: number, lng: number, label: string) => {
      setLocation({ latitude: lat, longitude: lng });
      setLocationLabel(label);
      setLocating(false);
    };
    if (!("geolocation" in navigator)) {
      finish(
        defaultCenter.latitude,
        defaultCenter.longitude,
        "Selected location (Guwahati centre - demo)"
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        finish(
          pos.coords.latitude,
          pos.coords.longitude,
          "Selected location (from device GPS)"
        ),
      () =>
        finish(
          defaultCenter.latitude,
          defaultCenter.longitude,
          "Selected location (Guwahati centre - demo)"
        ),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
    );
  };

  const handlePhotoChange = async (file: File | undefined) => {

    if (!file) return;
    setErrors((e) => ({ ...e, photo: undefined }));
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
      setPhotoName(file.name);
    } catch (err) {
      setPhoto(null);
      setPhotoName("");
      setErrors((e) => ({
        ...e,
        photo:
          err instanceof Error
            ? err.message
            : "Image upload failed. You can still submit without a photo.",
      }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!location) {
      next.location =
        "Please select a flood location before submitting. Use your current location or pick a spot on the map.";
    }
    if (!severity) {
      next.severity = "Please select a flood severity before submitting.";
    }
    if (description.trim().length > 0 && description.trim().length < 5) {
      next.description = "Please add a little more detail to your description.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !location || !severity) return;
    setSubmitting(true);
    try {
      const report = addReport({
        latitude: location.latitude,
        longitude: location.longitude,
        locationName:
          locationLabel.trim() ||
          `Pinned location (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`,
        severity,
        waterDepth: waterDepth || "Unknown",
        roadStatus: roadStatus ?? "unknown",
        description: description.trim() || "No description provided.",
        photo: photo ?? undefined,
      });
      sessionStorage.setItem("lastSubmittedReportId", report.id);
      navigate("/report/success", { state: { reportId: report.id } });
    } catch (err) {
      console.error(err);
      setErrors({
        form: "Something went wrong while saving your report. Please try again.",
      });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Step 1: location */}
      <section aria-labelledby="step-location-heading">
        <div className="mb-3 flex items-start gap-2.5">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white"
            aria-hidden="true"
          >
            1
          </span>
          <div>
            <h2
              id="step-location-heading"
              className="text-base font-semibold text-slate-900"
            >
              Where is the flooding?
            </h2>
            <p className="text-xs text-slate-500">
              Tap the map to drop a pin on the affected road or bylane.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={locating}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-navy-300 bg-white px-4 text-sm font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-60"
          >
            <Crosshair className="h-5 w-5" aria-hidden="true" />
            {locating ? "Locating..." : "Use Current Location"}
          </button>
          <button
            type="button"
            onClick={() => setShowMapPicker((v) => !v)}
            aria-expanded={showMapPicker}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-navy-300 bg-white px-4 text-sm font-semibold text-navy-700 transition hover:bg-navy-50"
          >
            <MapPin className="h-5 w-5" aria-hidden="true" />
            Select Location on Map
          </button>
        </div>
        {showMapPicker && (
          <div className="mt-3 animate-scale-in">
            <FloodMap
              reports={[]}
              pickMode
              pickedLocation={location}
              showPopups={false}
              className="h-64"
              onPick={(lat, lng) => {
                setLocation({ latitude: lat, longitude: lng });
                setLocationLabel(
                  `Selected location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                );
                setErrors((e) => ({ ...e, location: undefined }));
              }}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Demo map - tap anywhere to place your flood marker.
            </p>
          </div>
        )}
        <div
          className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-3 text-sm ${
            location
              ? "border-green-200 bg-green-50 text-green-800"
              : errors.location
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-slate-200 bg-white text-slate-500"
          }`}
          role={errors.location ? "alert" : "status"}
        >
          <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">Location:</span>{" "}
            {location
              ? locationLabel ||
                `Selected location (${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)})`
              : "Not selected yet"}
          </span>
        </div>
        {errors.location && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.location}
          </p>
        )}
      </section>
      {/* Step 2: severity */}
      <section aria-labelledby="step-severity-heading">
        <StepHeading
          number={2}
          id="step-severity-heading"
          title="How severe is the flooding?"
          hint="Demo classifications - not official government standards."
        />
        <div
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="radiogroup"
          aria-labelledby="step-severity-heading"
        >
          {(Object.keys(SEVERITY_META) as Severity[]).map((key) => {
            const meta = SEVERITY_META[key];
            const selected = severity === key;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setSeverity(key);
                  setErrors((e) => ({ ...e, severity: undefined }));
                }}
                className={`flex min-h-[64px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  selected
                    ? `${meta.chip} ring-2 ring-offset-1`
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                    selected ? meta.dot : "border-slate-300"
                  } bg-white`}
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-bold tracking-wide">
                    {meta.shortLabel}
                  </span>
                  <span className="block text-xs opacity-80">
                    {meta.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {errors.severity && (
          <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
            {errors.severity}
          </p>
        )}
      </section>
      {/* Step 3: water depth */}
      <section aria-labelledby="step-depth-heading">
        <StepHeading
          number={3}
          id="step-depth-heading"
          title="Approximate water depth"
          hint="Optional - pick the closest estimate."
        />
        <div className="flex flex-wrap gap-2">
          {WATER_DEPTH_OPTIONS.map((opt) => {
            const selected = waterDepth === opt;
            return (
              <button
                key={opt}
                type="button"
                aria-pressed={selected}
                onClick={() => setWaterDepth(selected ? "" : opt)}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition ${
                  selected
                    ? "border-water-500 bg-water-500/10 text-water-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Droplets className="h-4 w-4" aria-hidden="true" />
                {opt}
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 4: road status */}
      <section aria-labelledby="step-road-heading">
        <StepHeading
          number={4}
          id="step-road-heading"
          title="Can vehicles pass?"
          hint="Optional - helps drivers choose a safer route."
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ROAD_STATUS_OPTIONS.map((opt) => {
            const selected = roadStatus === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setRoadStatus(selected ? null : opt.value)}
                className={`flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition ${
                  selected
                    ? "border-navy-500 bg-navy-50 text-navy-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <CarFront className="h-4 w-4" aria-hidden="true" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>
      {/* Step 5: photo */}
      <section aria-labelledby="step-photo-heading">
        <StepHeading
          number={5}
          id="step-photo-heading"
          title="Add photo"
          hint="Optional - a photo helps verify the report."
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Choose a flood photo"
          onChange={(e) => handlePhotoChange(e.target.files?.[0])}
        />
        {photo ? (
          <div className="relative inline-block">
            <img
              src={photo}
              alt="Preview of the flood photo you selected"
              className="h-40 rounded-xl border border-slate-200 object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPhotoName("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
              aria-label="Remove selected photo"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <p className="mt-1 max-w-[15rem] truncate text-xs text-slate-500">
              {photoName}
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[88px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-4 text-slate-500 transition hover:border-navy-400 hover:text-navy-600"
          >
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
            <span className="text-sm font-semibold">Tap to choose a photo</span>
            <span className="text-xs">PNG or JPG - optional</span>
          </button>
        )}
        {errors.photo && (
          <p
            className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600"
            role="alert"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {errors.photo}
          </p>
        )}
      </section>
      {/* Step 6: description */}
      <section aria-labelledby="step-description-heading">
        <StepHeading
          number={6}
          id="step-description-heading"
          title="Describe the situation"
          hint="Optional - tell neighbours what you can see."
        />
        <label htmlFor="report-description" className="sr-only">
          Situation description
        </label>
        <textarea
          id="report-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors((err) => ({ ...err, description: undefined }));
          }}
          rows={4}
          maxLength={500}
          placeholder="Example: Water is entering houses and the road is not accessible to small cars."
          aria-describedby="description-help"
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-400"
        />
        <div
          className="mt-1 flex justify-between gap-3 text-xs text-slate-400"
          id="description-help"
        >
          <span className={errors.description ? "text-red-600" : ""}>
            {errors.description ?? "Short and specific helps responders."}
          </span>
          <span aria-hidden="true">{description.length}/500</span>
        </div>
      </section>

      {errors.form && (
        <div
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm font-medium text-red-700"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
          {errors.form}
        </div>
      )}

      {/* Step 7: submit */}
      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
          Step 7
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-navy-700 px-6 text-base font-bold tracking-wide text-white shadow-lg shadow-navy-700/25 transition hover:bg-navy-800 active:scale-[0.99] disabled:opacity-60"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
          {submitting ? "SUBMITTING..." : "SUBMIT FLOOD REPORT"}
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">
          No account needed - your report is saved on this device for the demo.
        </p>
      </div>
    </form>
  );
}






