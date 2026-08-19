"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FiTrendingUp,
  FiCalendar,
  FiMapPin,
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
/* Static data — swap these for API data when wiring up the backend.  */
/* ------------------------------------------------------------------ */

const FILTERS = ["This Week", "This Month", "Last 3 Months", "This Year"];

// One earnings dataset per filter, so the chart actually reacts to the pill row.
const earningsByFilter = {
  "This Week": {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    data: [420, 680, 310, 750, 920, 1100, 560],
  },
  "This Month": {
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [2200, 3100, 2750, 3400],
  },
  "Last 3 Months": {
    categories: ["March", "April", "May"],
    data: [9800, 11200, 10450],
  },
  "This Year": {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    data: [7200, 8100, 9800, 11200, 10450, 12300, 9900],
  },
};

const recentTrips = [
  {
    id: 1,
    from: "Mumbai",
    to: "Pune",
    date: "May 25, 2026",
    time: "11:00 AM",
    passengers: 2,
    earned: 600,
    status: "completed",
  },
  {
    id: 2,
    from: "Delhi",
    to: "Agra",
    date: "May 28, 2026",
    time: "06:00 AM",
    passengers: 3,
    earned: 450,
    status: "completed",
  },
  {
    id: 3,
    from: "Bangalore",
    to: "Mysore",
    date: "June 2, 2026",
    time: "09:30 AM",
    passengers: 1,
    earned: 350,
    status: "completed",
  },
  {
    id: 4,
    from: "Chennai",
    to: "Vellore",
    date: "June 5, 2026",
    time: "08:00 AM",
    passengers: 2,
    earned: 280,
    status: "completed",
  },
  {
    id: 5,
    from: "Hyderabad",
    to: "Warangal",
    date: "June 8, 2026",
    time: "07:30 AM",
    passengers: 4,
    earned: 520,
    status: "pending",
  },
];

// Admin controls payouts now — no withdraw action, just balance + history.
const payoutSummary = {
  balance: 2200,
  totalPayouts: 12800,
  upcomingPayout: 2200,
  upcomingPayoutDate: "Jun 15, 2026",
  lastPayoutAmount: 1800,
  lastPayoutDate: "May 30, 2026",
};

const recentPayouts = [
  { id: 1, date: "May 30, 2026", amount: 1800, status: "paid" },
  { id: 2, date: "May 15, 2026", amount: 1500, status: "paid" },
  { id: 3, date: "Apr 30, 2026", amount: 1200, status: "processing" },
];

/* ------------------------------------------------------------------ */

export default function EarningsPage() {
  const [activeFilter, setActiveFilter] = useState("This Week");
  const [chartHeight, setChartHeight] = useState(240);

  useEffect(() => {
    const updateHeight = () => {
      setChartHeight(window.innerWidth >= 1024 ? 340 : 240);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const totalEarned = useMemo(
    () => recentTrips.reduce((sum, t) => sum + t.earned, 0),
    [],
  );
  const totalRides = recentTrips.length;
  const totalPassengers = useMemo(
    () => recentTrips.reduce((sum, t) => sum + t.passengers, 0),
    [],
  );

  const chartData = earningsByFilter[activeFilter];

  const chartOptions = {
    chart: {
      id: "earnings-chart",
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "var(--font-body)",
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
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
      categories: chartData.categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val >= 1000 ? `₹${(val / 1000).toFixed(1)}k` : `₹${val}`,
        style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 },
      },
    },
    tooltip: {
      y: { formatter: (val) => `₹${val.toLocaleString()}` },
    },
  };

  const chartSeries = [{ name: "Earnings", data: chartData.data }];

  return (
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
              key={f}
              type="button"
              className={`earning-filter-btn${
                activeFilter === f ? " earning-filter-btn--active" : ""
              }`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
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
              ₹{totalEarned.toLocaleString()}
            </span>
          </div>
          <div className="earning-stat-badge earning-stat-badge--up">
            <FiArrowUpRight />
            <span>12.4%</span>
          </div>
        </div>

        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <FiMapPin className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Total Rides</span>
            <span className="earning-stat-value">{totalRides}</span>
          </div>
          <div className="earning-stat-badge earning-stat-badge--down">
            <FiArrowDownRight />
            <span>2 less</span>
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
          <div className="earning-stat-badge earning-stat-badge--up">
            <FiArrowUpRight />
            <span>5.3%</span>
          </div>
        </div>

        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <PiBankBold className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Available Balance</span>
            <span className="earning-stat-value">
              ₹{payoutSummary.balance.toLocaleString()}
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
            <span className="earning-chart-meta">{activeFilter}</span>
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
              You earned 12.4% more this {activeFilter.toLowerCase()} compared
              to the previous period.
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
                  ₹{payoutSummary.balance.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="earning-payout-rows">
              <div className="earning-payout-row">
                <span className="earning-payout-row-label">
                  Total Payouts (by Admin)
                </span>
                <span className="earning-payout-row-val">
                  ₹{payoutSummary.totalPayouts.toLocaleString()}
                </span>
              </div>
              <div className="earning-payout-divider" />
              <div className="earning-payout-row">
                <span className="earning-payout-row-label">
                  Upcoming Payout
                </span>
                <span className="earning-payout-row-val">
                  ₹{payoutSummary.upcomingPayout.toLocaleString()}
                </span>
              </div>
              <div className="earning-payout-divider" />
              <div className="earning-payout-row">
                <span className="earning-payout-row-label">
                  Last Payout Received
                </span>
                <span className="earning-payout-row-val">
                  ₹{payoutSummary.lastPayoutAmount.toLocaleString()}
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
            <ul className="earning-withdrawals-list">
              {recentPayouts.map((p) => (
                <li key={p.id} className="earning-withdrawal-item">
                  <div className="earning-withdrawal-icon">
                    {p.status === "paid" ? <FiCheckCircle /> : <FiClock />}
                  </div>
                  <div className="earning-withdrawal-body">
                    <span className="earning-withdrawal-date">{p.date}</span>
                    <span
                      className={`earning-withdrawal-status earning-withdrawal-status--${
                        p.status === "paid" ? "completed" : "processing"
                      }`}
                    >
                      {p.status === "paid" ? "Paid" : "Processing"}
                    </span>
                  </div>
                  <span className="earning-withdrawal-amount">
                    ₹{p.amount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="earning-trips-card">
        <div className="earning-trips-header">
          <h2 className="earning-trips-title">Recent Trips</h2>
          <button type="button" className="earning-trips-export">
            <FiDownload />
            Export CSV
          </button>
        </div>

        {/* Desktop / tablet table */}
        <div className="earning-table-wrap">
          <table className="earning-table">
            <thead>
              <tr>
                <th className="earning-th">Route</th>
                <th className="earning-th">Date &amp; Time</th>
                <th className="earning-th">Passengers</th>
                <th className="earning-th">Earned</th>
                <th className="earning-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.id} className="earning-tr">
                  <td className="earning-td">
                    <div className="earning-route">
                      <span className="earning-route-from">{trip.from}</span>
                      <span className="earning-route-arrow">→</span>
                      <span className="earning-route-to">{trip.to}</span>
                    </div>
                  </td>
                  <td className="earning-td">
                    <div className="earning-datetime">
                      <FiCalendar className="earning-datetime-icon" />
                      <span>{trip.date}</span>
                      <span className="earning-time-chip">{trip.time}</span>
                    </div>
                  </td>
                  <td className="earning-td">
                    <div className="earning-passengers">
                      <FiUsers className="earning-pass-icon" />
                      {trip.passengers}
                    </div>
                  </td>
                  <td className="earning-td">
                    <span className="earning-amount-cell">₹{trip.earned}</span>
                  </td>
                  <td className="earning-td">
                    <span
                      className={`earning-status-chip earning-status-chip--${trip.status}`}
                    >
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="earning-trip-cards">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="earning-trip-card">
              <div className="earning-trip-card-top">
                <div className="earning-route">
                  <span className="earning-route-from">{trip.from}</span>
                  <span className="earning-route-arrow">→</span>
                  <span className="earning-route-to">{trip.to}</span>
                </div>
                <span
                  className={`earning-status-chip earning-status-chip--${trip.status}`}
                >
                  {trip.status}
                </span>
              </div>

              <div className="earning-trip-card-datetime">
                <FiCalendar className="earning-datetime-icon" />
                <span>{trip.date}</span>
                <span className="earning-time-chip">{trip.time}</span>
              </div>

              <div className="earning-trip-card-grid">
                <div className="earning-trip-card-field">
                  <span className="earning-trip-card-label">Passengers</span>
                  <span className="earning-trip-card-value">
                    <FiUsers className="earning-pass-icon" />
                    {trip.passengers}
                  </span>
                </div>
                <div className="earning-trip-card-field earning-trip-card-field--right">
                  <span className="earning-trip-card-label">Earned</span>
                  <span className="earning-trip-card-value earning-amount-cell">
                    ₹{trip.earned}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="earning-view-all-btn">
          View All Trips
        </button>
      </div>
    </div>
  );
}
