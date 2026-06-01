import { NextRequest, NextResponse } from "next/server";
import { GEOFENCE_POLYGON_WKT } from "@/lib/geofence";
import { prisma } from "@/lib/prisma";

function parseCoordinates(body: unknown): { lat: number; lng: number } | null {
  if (!body || typeof body !== "object") return null;
  const { lat, lng } = body as Record<string, unknown>;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const coords = parseCoordinates(body);
  if (!coords) {
    return NextResponse.json(
      { error: "Body must include finite lat (-90..90) and lng (-180..180)" },
      { status: 400 }
    );
  }

  const { lat, lng } = coords;

  try {
    const result = await prisma.$queryRaw<[{ inside: boolean }]>`
      SELECT ST_Contains(
        ST_GeomFromText(${GEOFENCE_POLYGON_WKT}, 4326),
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
      ) AS inside
    `;

    return NextResponse.json({
      inside: Boolean(result[0]?.inside),
      lat,
      lng,
    });
  } catch (error) {
    console.error("Geofence query failed:", error);
    return NextResponse.json(
      { error: "Geofence check failed. Is PostGIS running?" },
      { status: 500 }
    );
  }
}
