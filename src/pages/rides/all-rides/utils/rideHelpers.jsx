"use client"
const AVATAR_COLORS = [
  ["#dbeafe", "#1e40af"],
  ["#dcfce7", "#166534"],
  ["#fef3c7", "#92400e"],
  ["#fce7f3", "#9d174d"],
  ["#ede9fe", "#5b21b6"],
];

export const avatarColor = (name) =>
  AVATAR_COLORS[(name || "A").charCodeAt(0) % AVATAR_COLORS.length];

export const formatTime = (t) => {
  if (!t) return "--:--";
  // Accept formats like "HH:MM:SS" or "HH:MM". Fallback to first 5 chars.
  try {
    const parts = t.split(":");
    const hh = parseInt(parts[0], 10);
    const mm = (parts[1] || "00").slice(0, 2);
    if (Number.isNaN(hh)) return t.slice(0, 5);
    const ampm = hh >= 12 ? "pm" : "am";
    let hour12 = hh % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12}:${mm} ${ampm}`;
  } catch (err) {
    return t.slice(0, 5);
  }
};

export const secondsToHM = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h${m > 0 ? m + "m" : ""}` : `${m}m`;
};

export const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

export const getDepartSlot = (timeStr) => {
  if (!timeStr) return "";
  const [h] = timeStr.split(":").map(Number);
  if (Number.isNaN(h)) return "";
  if (h < 6) return "Before 6:00 am";
  if (h < 12) return "6:00 am - 12:00 pm";
  if (h < 18) return "12:01 pm - 6:00 pm";
  return "After 6:00 pm";
};

/**
 * Returns { passed: bool, label: string }
 * e.g. "Departed 2h 10m ago"  /  "Departs in 45m"
 */
export const getRideStatus = (rideDate, departureTime) => {
  if (!rideDate || !departureTime) return { passed: false, label: "Scheduled" };

  const rideDateTime = new Date(`${rideDate}T${departureTime}`);
  const diffMs = rideDateTime - Date.now();

  if (diffMs < 0) {
    const abs = Math.abs(diffMs);
    const h = Math.floor(abs / 3_600_000);
    const m = Math.floor((abs % 3_600_000) / 60_000);
    const ago = h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
    return { passed: true, label: `Departed ${ago}` };
  }

  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  const eta = h > 0 ? `${h}h ${m}m` : `${m}m`;
  return { passed: false, label: `Departs in ${eta}` };
};

export const groupByDate = (rides) => {
  const order = [];
  const map = {};
  rides.forEach((r) => {
    const label = r.ride_date || "Unknown";
    if (!map[label]) {
      map[label] = [];
      order.push(label);
    }
    map[label].push(r);
  });
  return order.map((d) => ({
    date: d,
    rides: map[d],
    route: `${map[d][0].source_address} → ${map[d][0].destination_address}`,
  }));
};
