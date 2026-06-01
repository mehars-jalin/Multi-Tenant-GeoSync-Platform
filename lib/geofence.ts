/** Hardcoded WGS84 polygon (downtown SF rectangle) */
export const GEOFENCE_POLYGON_WKT =
  "POLYGON((-122.42 37.77, -122.40 37.77, -122.40 37.79, -122.42 37.79, -122.42 37.77))";

/** Inside the polygon */
export const TEST_POINT_INSIDE = { lat: 37.78, lng: -122.41 };

/** Outside the polygon */
export const TEST_POINT_OUTSIDE = { lat: 37.5, lng: -122.0 };
