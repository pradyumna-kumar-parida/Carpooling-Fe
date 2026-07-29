"use client";

import React, { useMemo, useState } from "react";
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

/* ---------- category metadata (color + tag label) ---------- */

const CATEGORY = {
  booking: { label: "Booking", tone: "blue" },
  confirmed: { label: "Ride confirmed", tone: "green" },
  cancelled: { label: "Ride cancelled", tone: "red" },
  payment: { label: "Payment", tone: "amber" },
  message: { label: "Message", tone: "blue" },
  system: { label: "Update", tone: "gray" },
};

const DOT_COLOR = {
  blue: "var(--custom-one)",
  green: "var(--ntfy-success)",
  red: "var(--ntfy-danger)",
  amber: "var(--ntfy-amber)",
  gray: "var(--ntfy-gray)",
};

/* ---------- sample data — wire this up to your API ---------- */

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "booking",
    group: "Today",
    avatar: "P",
    title: "New booking request",
    description: "Pradyumna requested 2 seats for Mumbai → Pune.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "confirmed",
    group: "Today",
    avatar: "A",
    title: "Ride confirmed",
    description: "Your ride to Bangalore on Aug 2, 7:30 AM is confirmed.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 3,
    type: "confirmed",
    group: "Today",
    avatar: "R",
    title: "Ride confirmed",
    description: "Your ride to Bangalore on Aug 2, 9:00 PM is confirmed.",
    time: "10 min ago",
    unread: true,
  },
  {
    id: 4,
    type: "message",
    group: "Today",
    avatar: "S",
    title: "New message from Sanya",
    description: "Running 5 minutes late, see you at the pickup point.",
    time: "34 min ago",
    unread: false,
  },
  {
    id: 5,
    type: "payment",
    group: "Today",
    title: "Payment received",
    description: "₹450 credited for your Pune → Mumbai ride.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 6,
    type: "cancelled",
    group: "Yesterday",
    avatar: "K",
    title: "Ride cancelled",
    description: "Karan cancelled the ride from Hyderabad to Vijayawada.",
    time: "Yesterday, 6:12 PM",
    unread: false,
  },
  {
    id: 7,
    type: "system",
    group: "Yesterday",
    title: "Pickup point updated",
    description:
      "Your driver moved tomorrow's pickup point closer to the metro station.",
    time: "Yesterday, 4:45 PM",
    unread: true,
  },
  {
    id: 8,
    type: "booking",
    group: "Yesterday",
    avatar: "M",
    title: "Booking request accepted",
    description: "You accepted Meera's request for 1 seat to Nashik.",
    time: "Yesterday, 11:20 AM",
    unread: false,
  },
  {
    id: 9,
    type: "payment",
    group: "Earlier",
    title: "Payout processed",
    description: "₹1,200 was transferred to your linked bank account.",
    time: "3 days ago",
    unread: false,
  },
  {
    id: 10,
    type: "system",
    group: "Earlier",
    title: "Profile verified",
    description: "Your driving licence has been verified successfully.",
    time: "5 days ago",
    unread: false,
  },
];

const GROUP_ORDER = ["Today", "Yesterday", "Earlier"];

const TABS = [
  { id: "all", label: "All", filter: () => true },
  { id: "unread", label: "Unread", filter: (n) => n.unread },
  { id: "booking", label: "Bookings", filter: (n) => n.type === "booking" },
  {
    id: "rides",
    label: "Rides",
    filter: (n) => n.type === "confirmed" || n.type === "cancelled",
  },
  { id: "payment", label: "Payments", filter: (n) => n.type === "payment" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => n.unread).length;

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach((tab) => {
      counts[tab.id] = notifications.filter(tab.filter).length;
    });
    return counts;
  }, [notifications]);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.id === activeTab) || TABS[0];
    return notifications.filter(tab.filter);
  }, [notifications, activeTab]);

  const groups = GROUP_ORDER.map((group) => ({
    group,
    items: filtered.filter((n) => n.group === group),
  })).filter((g) => g.items.length > 0);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  const dismiss = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

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
              <span className="ntfy-tab-count">{tabCounts[tab.id]}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="ntfy-scroll-area">
        {groups.length === 0 ? (
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
                  const meta = CATEGORY[n.type];
                  return (
                    <div
                      className={`ntfy-row${n.unread ? " is-unread" : ""}`}
                      key={n.id}
                      style={{ color: DOT_COLOR[meta.tone] }}
                    >
                      <div className="ntfy-marker">
                        <span
                          className="ntfy-dot-marker"
                          style={{ background: DOT_COLOR[meta.tone] }}
                        />
                        <span className="ntfy-line" />
                      </div>

                      <article
                        className={`ntfy-card${n.unread ? "" : " is-read"}`}
                        onClick={() => markRead(n.id)}
                        tabIndex={0}
                        role="button"
                        aria-label={n.title}
                      >
                        {n.avatar ? (
                          <div className="ntfy-avatar">{n.avatar}</div>
                        ) : (
                          <div className={`ntfy-icon-badge ${meta.tone}`}>
                            {n.type === "payment" ? <IconCard /> : <IconBell />}
                          </div>
                        )}

                        <div className="ntfy-content">
                          <div className="ntfy-row-top">
                            <div>
                              <p className="ntfy-card-title">{n.title}</p>
                              <p className="ntfy-card-desc">{n.description}</p>
                            </div>
                            <div className="ntfy-row-actions">
                              {n.unread && <span className="ntfy-unread-dot" />}
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
                            <span>{n.time}</span>
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
