// utils/decodePolyline.js

/**
 * Decodes an OSRM / Google encoded polyline string into an array of
 * [lat, lng] pairs, in the same order Leaflet expects them.
 *
 * OSRM's `route.polyline` field (the plain `polyline` string returned
 * alongside `geometry` when you don't ask for `geometries=geojson`) is
 * encoded at precision 5 by default — same algorithm Google Maps uses.
 *
 * @param {string} encoded  The encoded polyline string, e.g. ride.polyline
 * @param {number} precision  5 for OSRM/Google default, 6 for some providers
 * @returns {[number, number][]}  Array of [lat, lng] coordinate pairs
 */
export function decodePolyline(encoded, precision = 5) {
  if (!encoded || typeof encoded !== "string") return [];

  const factor = Math.pow(10, precision);
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates = [];

  while (index < encoded.length) {
    let result = 1;
    let shift = 0;
    let b;

    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 1;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coordinates.push([lat / factor, lng / factor]);
  }

  return coordinates;
}
