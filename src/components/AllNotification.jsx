"use client";

import { useNotifications } from "@/hooks/useNotifications";
import React, { useEffect, useMemo, useRef, useState } from "react";
/* Import the stylesheet once in your root layout/_app instead of here —
   see note at the bottom of this file. */

/* ---------- tiny inline icons (no external deps) ---------- */

const IconCard = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const IconBell = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconClose = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
  >
    <line x1="4" y1="4" x2="16" y2="16" />
    <line x1="16" y1="4" x2="4" y2="16" />
  </svg>
);

const IconInbox = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" />
  </svg>
);

const IconAlert = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/* ---------- category metadata (color + tag label) ----------
   Keys are lower-cased "internal" categories. Real API `type` values
   (e.g. LOGIN_SUCCESS, RIDE_CANCELLED, CONVERSATION, SYSTEM, ...) get
   normalized into one of these via TYPE_TO_CATEGORY below. Anything
   we don't recognize falls back to the `default` entry so the UI
   never breaks on a new/unknown notification type. */

const CATEGORY = {
  booking: { label: "Booking", tone: "blue" },
  confirmed: { label: "Ride confirmed", tone: "green" },
  cancelled: { label: "Ride cancelled", tone: "red" },
  payment: { label: "Payment", tone: "amber" },
  message: { label: "Message", tone: "blue" },
  system: { label: "Update", tone: "gray" },
  default: { label: "Notification", tone: "gray" },
};

const DOT_COLOR = {
  blue: "var(--custom-one)",
  green: "var(--ntfy-success)",
  red: "var(--ntfy-danger)",
  amber: "var(--ntfy-amber)",
  gray: "var(--ntfy-gray)",
};

/* Maps raw API `type` strings to the internal CATEGORY keys used for
   styling + tab filtering. Extend this as new backend types appear —
   anything missing safely falls back to "default". */
const TYPE_TO_CATEGORY = {
  LOGIN_SUCCESS: "system",
  SYSTEM: "system",
  RIDE_CANCELLED: "cancelled",
  RIDE_CONFIRMED: "confirmed",
  RIDE_EXPIRED: "cancelled",
  BOOKING_REQUEST: "booking",
  BOOKING_ACCEPTED: "booking",
  CONVERSATION: "message",
  MESSAGE: "message",
  PAYMENT: "payment",
  PAYOUT: "payment",
};

const normalizeCategory = (rawType) => {
  if (!rawType) return "default";
  const key = TYPE_TO_CATEGORY[String(rawType).toUpperCase()];
  return key && CATEGORY[key] ? key : "default";
};

const GROUP_ORDER = ["Today", "Yesterday", "Earlier"];

const TABS = [
  { id: "all", label: "All", filter: () => true },
  { id: "unread", label: "Unread", filter: (n) => n.unread },
  { id: "booking", label: "Bookings", filter: (n) => n.category === "booking" },
  {
    id: "rides",
    label: "Rides",
    filter: (n) => n.category === "confirmed" || n.category === "cancelled",
  },
  { id: "payment", label: "Payments", filter: (n) => n.category === "payment" },
];

/* ---------- date / time helpers ---------- */

// API sends "YYYY-MM-DD HH:mm:ss" (treated as local time).
const parseApiDate = (value) => {
  if (!value) return null;
  const isoish = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(isoish);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getGroupLabel = (date) => {
  if (!date) return "Earlier";
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return "Earlier";
};

const formatRelativeTime = (date) => {
  if (!date) return "";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;

  const diffHrs = Math.round(diffMin / 60);
  if (isSameDay(date, now))
    return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const timeStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  if (isSameDay(date, yesterday)) return `Yesterday, ${timeStr}`;

  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

// Pulls a stable initial (for the avatar-less icon vs. letter avatar) out
// of the notification title, if it looks like a person-addressed message.
const getAvatarLetter = (n) => {
  if (n.category !== "message") return null;
  const match = n.title?.match(/from\s+([A-Za-z])/i);
  return match ? match[1].toUpperCase() : null;
};

/* Normalizes whatever shape the notifications query returns (plain array,
   `{ data: [...] }`, or a paginated `{ data: [...], meta: {...} }`) into
   a flat array so pagination changes on the backend can't break the UI. */
const extractList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.notifications)) return payload.notifications;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

export default function NotificationsPage() {
  const {
    carpoolnotifications,
    carpoolunreadCount,
    carpoolmarkRead,
    carpoolmarkAllRead,
    isLoading,
    isError,
    error,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState("all");
  const [dismissedIds, setDismissedIds] = useState(() => new Set());

  /* ---------------- mark-all-as-read on mount (once) ---------------- */
  const hasTriggeredMarkAllRef = useRef(false);

  /* ---------------- "new" (live-arrival) tracking ----------------
     `isNew` is NOT the same as `unread`. `unread` reflects the backend
     `is_read` flag, which flips true almost immediately after mount
     because we call carpoolmarkAllRead() below. `isNew` instead means
     "this id showed up in a refetch that happened after the page was
     already open" — e.g. a Firebase push that invalidates the
     ["notifications"] query while the user is sitting on this page.
     That's the one that should get a distinct highlight background. */
  const previousNotificationIdsRef = useRef(new Set());
  const hasInitializedNotificationsRef = useRef(false);
const [newNotificationIds, setNewNotificationIds] = useState(
  () => new Set()
);

  useEffect(() => {
    // Wait for the first successful load so we know whether there's
    // anything to mark, and never fire more than once per mount.
    if (hasTriggeredMarkAllRef.current) return;
    if (isLoading) return;

    hasTriggeredMarkAllRef.current = true;

    if (!carpoolunreadCount) return; // nothing unread, skip the call entirely

    // Your useNotifications() hook's markAllRead mutation already
    // invalidates ["notifications"] onSuccess, which updates this page,
    // the header badge, and anything else subscribed to that query key —
    // so there's no need to invalidate again here.
    Promise.resolve(carpoolmarkAllRead?.()).catch((err) => {
      console.error("Failed to mark all notifications as read:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  /* Detect ids that appear in a refetch AFTER the page was already open
     (e.g. a Firebase-triggered invalidation of ["notifications"] while
     the user is sitting here) and remember them as "new" for the rest
     of the visit. The very first successful response just seeds the
     "known ids" baseline — nothing is "new" on initial load. */
useEffect(() => {
  if (!carpoolnotifications) return;

  const list = extractList(carpoolnotifications);

  const currentIds = new Set(list.map((n) => n.id));

  // First API response = baseline
  if (!hasInitializedNotificationsRef.current) {
    previousNotificationIdsRef.current = currentIds;
    hasInitializedNotificationsRef.current = true;
    return;
  }

  // Find notifications that were not present before
  const arrivedIds = [...currentIds].filter(
    (id) => !previousNotificationIdsRef.current.has(id)
  );

  if (arrivedIds.length > 0) {
    setNewNotificationIds((prev) => {
      const next = new Set(prev);

      arrivedIds.forEach((id) => {
        next.add(id);
      });

      return next;
    });
  }

  previousNotificationIdsRef.current = currentIds;
}, [carpoolnotifications]);
  /* ---------------- map API notifications -> UI shape ---------------- */

const notifications = useMemo(() => {
  const list = extractList(carpoolnotifications);

  return list.map((raw) => {
    const category = normalizeCategory(raw.type);
    const date = parseApiDate(raw.created_at);

    const mapped = {
      id: raw.id,
      rawType: raw.type,
      category,
      title: raw.title ?? "Notification",
      description: raw.body ?? "",
      unread: !raw.is_read,

      // New notification that arrived while page was open
      isNew: newNotificationIds.has(raw.id),

      date,
      time: formatRelativeTime(date),
      group: getGroupLabel(date),
      data: raw.data ?? {},
    };

    mapped.avatar = getAvatarLetter(mapped);

    return mapped;
  });
}, [carpoolnotifications, newNotificationIds]);

  const visibleNotifications = useMemo(
    () => notifications.filter((n) => !dismissedIds.has(n.id)),
    [notifications, dismissedIds],
  );

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      counts[tab.id] = visibleNotifications.filter(tab.filter).length;
    });
    return counts;
  }, [visibleNotifications]);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab) || TABS[0];
    return visibleNotifications.filter(tab.filter);
  }, [visibleNotifications, activeTab]);

  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: filtered.filter((n) => n.group === group),
  })).filter((g) => g.items.length > 0);

  /* ---------------- interactions ----------------
     Everything is already marked read via carpoolmarkAllRead on mount,
     so a per-card click doesn't need to hit the single-read API right
     now. carpoolmarkRead is kept wired up (commented call below) so
     it's a one-line change to re-enable per-item marking later. */
  const handleCardClick = (n) => {
    // carpoolmarkRead?.(n.id);
    if (n.data?.screen) {
      // hook this up to your router if/when per-card navigation is needed
      // router.push(mapScreenToRoute(n.data.screen, n.data));
    }
  };

  const dismiss = (id, e) => {
    e.stopPropagation();
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  /* ---------------- render states ---------------- */

  return (
    <div className="ntfy-page">
      <div className="notify-header">
        <h2 id="avl-rides-heading" className="avl-rides-title">
          Notifications
        </h2>
        <nav className="ntfy-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`ntfy-tab${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span
                className={`ntfy-tab-count ${
                  activeTab === tab.id ? "tab-countactive" : ""
                }`}
              >
                {tabCounts[tab.id] ?? 0}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="ntfy-scroll-area">
        {isLoading ? (
          <div className="ntfy-empty">
            <div className="ntfy-empty-icon">
              <IconInbox />
            </div>
            <h3>Loading notifications…</h3>
            <p>Hang tight, this only takes a second.</p>
          </div>
        ) : isError ? (
          <div className="ntfy-empty">
            <div className="ntfy-empty-icon">
              <IconAlert />
            </div>
            <h3>Couldn't load notifications</h3>
            <p>{error?.message || "Something went wrong. Please try again."}</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="ntfy-empty">
            <div className="ntfy-empty-icon">
              <IconInbox />
            </div>
            <h3>Nothing here</h3>
            <p>You have no notifications in this view right now.</p>
          </div>
        ) : (
          groups.map(({ group, items }) => (
            <section className="ntfy-group" key={group}>
              <h2 className="ntfy-group-label">{group}</h2>
              <div className="ntfy-list">
                {items.map((n) => {
                  const meta = CATEGORY[n.category] || CATEGORY.default;
                  return (
                    <div
                      className={`ntfy-row${n.unread ? " is-unread" : ""}${
                        n.isNew ? " is-new" : ""
                      }`}
                      key={n.id}
                      style={{ color: DOT_COLOR[meta.tone] }}
                    >
                      <article
                        className={`ntfy-card${n.unread ? "" : " is-read"}${
                          n.isNew ? " ntfy-card--new" : ""
                        }`}
                        onClick={() => handleCardClick(n)}
                        tabIndex={0}
                        role="button"
                        aria-label={n.title}
                      >
                        {n.avatar ? (
                          <div className="ntfy-avatar">{n.avatar}</div>
                        ) : (
                          <div className={`ntfy-icon-badge ${meta.tone}`}>
                            {n.category === "payment" ? (
                              <IconCard />
                            ) : (
                              <IconBell />
                            )}
                          </div>
                        )}

                        <div className="ntfy-content">
                          <div className="ntfy-row-top">
                            <div>
                              <p className="ntfy-card-title">{n.title}</p>
                              <p className="ntfy-card-desc">{n.description}</p>
                            </div>
                            <div className="ntfy-row-actions">
                              <button
                                className="ntfy-dismiss"
                                onClick={(e) => dismiss(n.id, e)}
                                aria-label="Dismiss notification"
                              >
                                <IconClose />
                              </button>
                            </div>
                          </div>
                          <div className="ntfy-card-meta">
                            <span className={`ntfy-tag ${meta.tone}`}>
                              {meta.label}
                            </span>
                            <span className="ntfy-timing">{n.time}</span>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

