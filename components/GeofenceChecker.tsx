"use client";

import { useState } from "react";
import { TEST_POINT_INSIDE, TEST_POINT_OUTSIDE } from "@/lib/geofence";

export default function GeofenceChecker() {
  const [lat, setLat] = useState(String(TEST_POINT_INSIDE.lat));
  const [lng, setLng] = useState(String(TEST_POINT_INSIDE.lng));
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    setError(null);
    setResult(null);

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    try {
      const res = await fetch("/api/geofence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: parsedLat, lng: parsedLng }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }

      setResult(
        data.inside
          ? `Inside geofence (${data.lat}, ${data.lng})`
          : `Outside geofence (${data.lat}, ${data.lng})`
      );
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label>
        Lat
        <input
          type="number"
          step="any"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
      </label>
      <label>
        Lng
        <input
          type="number"
          step="any"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
        />
      </label>
      <div>
        <button type="button" onClick={check} disabled={loading}>
          {loading ? "Checking…" : "Check geofence"}
        </button>
        <button
          type="button"
          onClick={() => {
            setLat(String(TEST_POINT_INSIDE.lat));
            setLng(String(TEST_POINT_INSIDE.lng));
          }}
        >
          Inside sample
        </button>
        <button
          type="button"
          onClick={() => {
            setLat(String(TEST_POINT_OUTSIDE.lat));
            setLng(String(TEST_POINT_OUTSIDE.lng));
          }}
        >
          Outside sample
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {result && (
        <p className={result.startsWith("Inside") ? "inside" : "outside"}>
          {result}
        </p>
      )}
    </div>
  );
}
