"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FiTrendingUp,
  FiUsers,
  FiArrowUpRight,
  FiArrowDownRight,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";
import { GrMoney } from "react-icons/gr";
import { PiBankBold } from "react-icons/pi";
import "../../styles/earning.css";

// ApexCharts needs the browser window object, so it must be loaded client-side only.
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

/* ------------------------------------------------------------------ */
/* Filter pills — label shown in the UI, value matches the backend    */
/* `filter` field ("this_week", "this_month", ...).                   */
/* ------------------------------------------------------------------ */

const FILTERS = [
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "Last 3 Months", value: "last_3_months" },
  { label: "This Year", value: "this_year" },
];

// Maps a raw trip status to a display label + CSS modifier class.
// Add more entries here if the backend introduces new statuses.
const TRIP_STATUS_META = {
  completed: { label: "Completed", chipClass: "completed" },
  scheduled: { label: "Scheduled", chipClass: "scheduled" },
  expired: { label: "Expired", chipClass: "expired" },
  pending: { label: "Pending", chipClass: "pending" },
  cancelled: { label: "Cancelled", chipClass: "cancelled" },
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatCurrency(value = 0) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatCompactCurrency(value = 0) {
  const n = Number(value || 0);
  return n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;
}

// "Dhenkanal, Odisha, India" -> "Dhenkanal"
function formatShortLocation(address = "") {
  if (!address) return "—";
  return address.split(",")[0].trim();
}

// Accepts either a plain time string ("23:51:00") or a full ISO timestamp.
function formatTripTime(timeStr) {
  if (!timeStr) return "—";
  const timePart = timeStr.includes("T") ? timeStr.split("T")[1] : timeStr;
  const [hStr, mStr] = timePart.split(":");
  let h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return timeStr;
  const m = (mStr ?? "00").padStart(2, "0");
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}

function formatPayoutDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDelta(value) {
  const num = Number(value) || 0;
  return { isUp: num >= 0, abs: Math.abs(num) };
}

function getTripStatusMeta(status) {
  return (
    TRIP_STATUS_META[status] || {
      label: status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : "Unknown",
      chipClass: status || "default",
    }
  );
}

// A driver's chart data from the API may only include the days/periods that
// actually had activity (e.g. just "Tue" if that's the only day with a
// ride), rather than the full Mon–Sun spread. This builds the full set of
// expected labels for a filter, zeroed out, so it can be used as a template
// that real data gets merged into — giving a proper line/wave shape instead
// of a single floating point.
function getChartTemplate(filterValue) {
  const now = new Date();

  switch (filterValue) {
    case "this_month":
      return ["Week 1", "Week 2", "Week 3", "Week 4"].map((label) => ({
        label,
        amount: 0,
      }));
    case "last_3_months": {
      const labels = [];
      for (let i = 2; i >= 0; i--) {
        labels.push(
          new Date(now.getFullYear(), now.getMonth() - i, 1).toLocaleDateString(
            "en-US",
            { month: "long" },
          ),
        );
      }
      return labels.map((label) => ({ label, amount: 0 }));
    }
    case "this_year": {
      const labels = [];
      for (let i = 0; i <= now.getMonth(); i++) {
        labels.push(
          new Date(now.getFullYear(), i, 1).toLocaleDateString("en-US", {
            month: "short",
          }),
        );
      }
      return labels.map((label) => ({ label, amount: 0 }));
    }
    case "this_week":
    default:
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
        label,
        amount: 0,
      }));
  }
}

/* ------------------------------------------------------------------ */

export default function EarningsPage({
  DriverRecentTrips = [],
  DriverEarnings = {},
  onFilterChange, // optional: (value) => void — call your fetch here
  onViewAllTrips, // optional: () => void
}) {
  const {
    filter: apiFilter = "this_week",
    kpis = {},
    chartData = [],
    payoutSummary = {},
    payoutHistory = [],
  } = DriverEarnings || {};

  const {
    totalEarnings = 0,
    earningsGrowth = 0,
    totalRides = 0,
    ridesDifference = 0,
    totalPassengers = 0,
    passengersGrowth = 0,
    availableBalance = 0,
  } = kpis;

  const {
    yourBalance = 0,
    totalPayoutsAdmin = 0,
    upcomingPayout = 0,
    lastPayoutReceived = 0,
  } = payoutSummary;

  const [activeFilter, setActiveFilter] = useState(apiFilter);
  const [chartHeight, setChartHeight] = useState(240);

  // If the parent refetches with a new filter, keep the pill row in sync.
  useEffect(() => {
    setActiveFilter(apiFilter);
  }, [apiFilter]);

  useEffect(() => {
    const updateHeight = () =>
      setChartHeight(window.innerWidth >= 1024 ? 340 : 240);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleFilterClick = (value) => {
    setActiveFilter(value);
    onFilterChange?.(value);
  };

  const activeFilterLabel =
    FILTERS.find((f) => f.value === activeFilter)?.label ?? "This Week";

  const effectiveChartData = useMemo(() => {
    const template = getChartTemplate(activeFilter);
    const amountByLabel = new Map(chartData.map((d) => [d.label, d.amount]));
    const merged = template.map((point) => ({
      label: point.label,
      amount: amountByLabel.get(point.label) ?? 0,
    }));
    // Keep any API data points that fall outside the template (e.g. an
    // unexpected label) instead of silently dropping them.
    const templateLabels = new Set(template.map((p) => p.label));
    const extras = chartData.filter((d) => !templateLabels.has(d.label));
    return [...merged, ...extras];
  }, [chartData, activeFilter]);
  const chartCategories = useMemo(
    () => effectiveChartData.map((d) => d.label),
    [effectiveChartData],
  );
  const chartSeriesData = useMemo(
    () => effectiveChartData.map((d) => d.amount),
    [effectiveChartData],
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        id: "earnings-chart",
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "var(--font-body)",
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#2563eb"],
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          gradientToColors: ["#7c3aed"],
          opacityFrom: 0.45,
          opacityTo: 0.04,
          stops: [0, 100],
        },
      },
      markers: {
        size: 0,
        strokeColors: "#2563eb",
        strokeWidth: 2,
        colors: ["#fff"],
        hover: { size: 6 },
      },
      grid: {
        borderColor: "#eef2f7",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: { top: 10, left: 8, right: 8, bottom: 0 },
      },
      xaxis: {
        categories: chartCategories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: "#64748b", fontSize: "12px", fontWeight: 600 },
        },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: (val) => formatCompactCurrency(val),
          style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 },
        },
      },
      tooltip: { y: { formatter: (val) => formatCurrency(val) } },
    }),
    [chartCategories],
  );

  const chartSeries = [{ name: "Earnings", data: chartSeriesData }];

  const earningsDelta = getDelta(earningsGrowth);
  const ridesDelta = getDelta(ridesDifference);
  const passengersDelta = getDelta(passengersGrowth);

  const handleExportCsv = () => {
    if (!DriverRecentTrips.length) return;
    const header = [
      "Source",
      "Destination",
      "Passengers",
      "Earning",
      "Status",
      "Time",
    ];
    const rows = DriverRecentTrips.map((t) => [
      t.source,
      t.destination,
      t.total_passenger,
      t.total_earning,
      t.status,
      t.ride_date,
    ]);
    const csv = [header, ...rows]
      .map((r) =>
        r
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `trips-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="earning-screen">

    <div className="earning-page">
      {/* Header */}
      <div className="earning-header">
        <div className="earning-header-text">
          <h1 className="earning-title">My Earnings</h1>
          <p className="earning-subtitle">
            Track your earnings and payout history
          </p>
        </div>
        <div className="earning-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`earning-filter-btn${
                activeFilter === f.value ? " earning-filter-btn--active" : ""
              }`}
              onClick={() => handleFilterClick(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="earning-stats-grid">
        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <GrMoney className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Total Earnings</span>
            <span className="earning-stat-value">
              {formatCurrency(totalEarnings)}
            </span>
          </div>
          <div
            className={`earning-stat-badge earning-stat-badge--${
              earningsDelta.isUp ? "up" : "down"
            }`}
          >
            {earningsDelta.isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
            <span>{earningsDelta.abs}%</span>
          </div>
        </div>

        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <FiTrendingUp className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Total Rides</span>
            <span className="earning-stat-value">{totalRides}</span>
          </div>
          <div
            className={`earning-stat-badge earning-stat-badge--${
              ridesDelta.isUp ? "up" : "down"
            }`}
          >
            {ridesDelta.isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
            <span>
              {ridesDelta.abs} {ridesDelta.isUp ? "more" : "less"}
            </span>
          </div>
        </div>

        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <FiUsers className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Total Passengers</span>
            <span className="earning-stat-value">{totalPassengers}</span>
          </div>
          <div
            className={`earning-stat-badge earning-stat-badge--${
              passengersDelta.isUp ? "up" : "down"
            }`}
          >
            {passengersDelta.isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
            <span>{passengersDelta.abs}%</span>
          </div>
        </div>

        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <PiBankBold className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Available Balance</span>
            <span className="earning-stat-value">
              {formatCurrency(availableBalance)}
            </span>
          </div>
          <div className="earning-stat-badge earning-stat-badge--up">
            <FiArrowUpRight />
            <span>To be paid</span>
          </div>
        </div>
      </div>

      {/* Chart + Summary */}
      <div className="earning-main-row">
        {/* Chart Card */}
        <div className="earning-chart-card">
          <div className="earning-chart-header">
            <h2 className="earning-chart-title">Earnings Overview</h2>
            <span className="earning-chart-meta">{activeFilterLabel}</span>
          </div>

          <div className="earning-chart-wrap">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height={chartHeight}
            />
          </div>

          <div className="earning-chart-note">
            <FiTrendingUp />
            <span>
              You earned {earningsDelta.abs}%{" "}
              {earningsDelta.isUp ? "more" : "less"} this{" "}
              {activeFilterLabel.toLowerCase()} compared to the previous period.
            </span>
          </div>
        </div>

        {/* Summary column */}
        <div className="earning-wallet-col">
          <div className="earning-payout-card">
            <h2 className="earning-payout-title">Earnings Summary</h2>
            <div className="earning-payout-hero">
              <div className="earning-payout-icon-wrap">
                <GrMoney />
              </div>
              <div>
                <span className="earning-payout-label">Your Balance</span>
                <span className="earning-payout-amount">
                  {formatCurrency(yourBalance)}
                </span>
              </div>
            </div>
            <div className="earning-payout-rows">
              <div className="earning-payout-row">
                <span className="earning-payout-row-label">
                  Total Payouts (by Admin)
                </span>
                <span className="earning-payout-row-val">
                  {formatCurrency(totalPayoutsAdmin)}
                </span>
              </div>
              <div className="earning-payout-divider" />
              <div className="earning-payout-row">
                <span className="earning-payout-row-label">
                  Upcoming Payout
                </span>
                <span className="earning-payout-row-val">
                  {formatCurrency(upcomingPayout)}
                </span>
              </div>
              <div className="earning-payout-divider" />
              <div className="earning-payout-row">
                <span className="earning-payout-row-label">
                  Last Payout Received
                </span>
                <span className="earning-payout-row-val">
                  {formatCurrency(lastPayoutReceived)}
                </span>
              </div>
            </div>
            <div className="earning-payout-note">
              <FiInfo />
              <span>
                Payouts are processed by the admin. You&apos;ll get an update
                here as soon as a payment is transferred to your account.
              </span>
            </div>
          </div>

          {/* Payout History */}
          <div className="earning-withdrawals-card">
            <h3 className="earning-withdrawals-title">Payout History</h3>
            {payoutHistory.length > 0 ? (
              <ul className="earning-withdrawals-list">
                {payoutHistory.map((p) => (
                  <li key={p.id} className="earning-withdrawal-item">
                    <div className="earning-withdrawal-icon">
                      {p.status === "completed" ? (
                        <FiCheckCircle />
                      ) : (
                        <FiClock />
                      )}
                    </div>
                    <div className="earning-withdrawal-body">
                      <span className="earning-withdrawal-date">
                        {formatPayoutDate(p.date)}
                      </span>
                      <span
                        className={`earning-withdrawal-status earning-withdrawal-status--${
                          p.status === "completed" ? "completed" : "processing"
                        }`}
                      >
                        {p.status === "completed" ? "Paid" : "Processing"}
                      </span>
                    </div>
                    <span className="earning-withdrawal-amount">
                      {formatCurrency(p.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="earning-empty-state">No payouts yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="earning-trips-card">
        <div className="earning-trips-header">
          <h2 className="earning-trips-title">Recent Trips</h2>
          <button
            type="button"
            className="earning-trips-export"
            onClick={handleExportCsv}
            disabled={!DriverRecentTrips.length}
          >
            <FiDownload />
            Export CSV
          </button>
        </div>

        {DriverRecentTrips.length > 0 ? (
          <>
            {/* Desktop / tablet table */}
            <div className="earning-table-wrap">
              <table className="earning-table">
                <thead>
                  <tr>
                    <th className="earning-th">Route</th>
                    <th className="earning-th">Time</th>
                    <th className="earning-th">Passengers</th>
                    <th className="earning-th">Earned</th>
                    <th className="earning-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DriverRecentTrips.map((trip) => {
                    const statusMeta = getTripStatusMeta(trip.status);
                    return (
                      <tr key={trip.id} className="earning-tr">
                        <td className="earning-td">
                          <div className="earning-route">
                            <span
                              className="earning-route-from"
                              title={trip.source}
                            >
                              {formatShortLocation(trip.source)}
                            </span>
                            <span className="earning-route-arrow">→</span>
                            <span
                              className="earning-route-to"
                              title={trip.destination}
                            >
                              {formatShortLocation(trip.destination)}
                            </span>
                          </div>
                        </td>
                        <td className="earning-td">
                          <div className="earning-datetime">
                            <FiClock className="earning-datetime-icon" />
                            <span className="earning-time-chip">
                              {formatTripTime(trip.ride_date)}
                            </span>
                          </div>
                        </td>
                        <td className="earning-td">
                          <div className="earning-passengers">
                            <FiUsers className="earning-pass-icon" />
                            {trip.total_passenger}
                          </div>
                        </td>
                        <td className="earning-td">
                          <span className="earning-amount-cell">
                            {formatCurrency(trip.total_earning)}
                          </span>
                        </td>
                        <td className="earning-td">
                          <span
                            className={`earning-status-chip earning-status-chip--${statusMeta.chipClass}`}
                          >
                            {statusMeta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="earning-trip-cards">
              {DriverRecentTrips.map((trip) => {
                const statusMeta = getTripStatusMeta(trip.status);
                return (
                  <div key={trip.id} className="earning-trip-card">
                    <div className="earning-trip-card-top">
                      <div className="earning-route">
                        <span
                          className="earning-route-from"
                          title={trip.source}
                        >
                          {formatShortLocation(trip.source)}
                        </span>
                        <span className="earning-route-arrow">→</span>
                        <span
                          className="earning-route-to"
                          title={trip.destination}
                        >
                          {formatShortLocation(trip.destination)}
                        </span>
                      </div>
                      <span
                        className={`earning-status-chip earning-status-chip--${statusMeta.chipClass}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="earning-trip-card-datetime">
                      <FiClock className="earning-datetime-icon" />
                      <span className="earning-time-chip">
                        {formatTripTime(trip.ride_date)}
                      </span>
                    </div>

                    <div className="earning-trip-card-grid">
                      <div className="earning-trip-card-field">
                        <span className="earning-trip-card-label">
                          Passengers
                        </span>
                        <span className="earning-trip-card-value">
                          <FiUsers className="earning-pass-icon" />
                          {trip.total_passenger}
                        </span>
                      </div>
                      <div className="earning-trip-card-field earning-trip-card-field--right">
                        <span className="earning-trip-card-label">Earned</span>
                        <span className="earning-trip-card-value earning-amount-cell">
                          {formatCurrency(trip.total_earning)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="earning-view-all-btn"
              onClick={() => onViewAllTrips?.()}
            >
              View All Trips
            </button>
          </>
        ) : (
          <div className="earning-empty-state">No trips yet.</div>
        )}
      </div>
    </div>
    </div>
  );
}
