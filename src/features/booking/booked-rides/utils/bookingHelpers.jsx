export const formatTime = (t) => {
  if (!t) return "--:--";
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

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const metersToKm = (m) => (m ? `${(m / 1000).toFixed(1)} km` : "");

const AVATAR_COLORS = [
  ["#dbeafe", "#1e40af"],
  ["#dcfce7", "#166534"],
  ["#fef3c7", "#92400e"],
  ["#fce7f3", "#9d174d"],
  ["#ede9fe", "#5b21b6"],
];

export const avatarColor = (name) =>
  AVATAR_COLORS[(name || "A").charCodeAt(0) % AVATAR_COLORS.length];

export const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
};

export const isRidePassed = (rideDate, departureTime) =>
  rideDate && departureTime
    ? new Date(`${rideDate}T${departureTime}`) < new Date()
    : false;
