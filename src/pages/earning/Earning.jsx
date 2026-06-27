"use client";
import { useState } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import "../../styles/earning.css";

const weeklyData = [
  { day: "Mon", amount: 420 },
  { day: "Tue", amount: 680 },
  { day: "Wed", amount: 310 },
  { day: "Thu", amount: 750 },
  { day: "Fri", amount: 920 },
  { day: "Sat", amount: 1100 },
  { day: "Sun", amount: 560 },
];

const recentTrips = [
  {
    id: 1,
    from: "Mumbai",
    to: "Pune",
    date: "April 25, 2026",
    time: "11:00 AM",
    passengers: 2,
    earned: 600,
    status: "completed",
  },
  {
    id: 2,
    from: "Delhi",
    to: "Agra",
    date: "April 28, 2026",
    time: "06:00 AM",
    passengers: 3,
    earned: 450,
    status: "completed",
  },
  {
    id: 3,
    from: "Bangalore",
    to: "Mysore",
    date: "May 2, 2026",
    time: "09:30 AM",
    passengers: 1,
    earned: 350,
    status: "completed",
  },
  {
    id: 4,
    from: "Chennai",
    to: "Vellore",
    date: "May 5, 2026",
    time: "08:00 AM",
    passengers: 2,
    earned: 280,
    status: "completed",
  },
  {
    id: 5,
    from: "Hyderabad",
    to: "Warangal",
    date: "May 8, 2026",
    time: "07:30 AM",
    passengers: 4,
    earned: 520,
    status: "completed",
  },
];

const maxBar = Math.max(...weeklyData.map((d) => d.amount));

export default function EarningsPage() {
  const [activeFilter, setActiveFilter] = useState("This Week");
  const filters = ["This Week", "This Month", "Last 3 Months", "This Year"];

  const totalEarned = recentTrips.reduce((s, t) => s + t.earned, 0);
  const totalRides = recentTrips.length;
  const avgPerRide = Math.round(totalEarned / totalRides);

  return (
    <div className="earning-page">
      {/* Header */}
      <div className="earning-header">
        <div className="earning-header-text">
          <h1 className="earning-title">My Earnings</h1>
          <p className="earning-subtitle">Track your income and ride history</p>
        </div>
        <div className="earning-filter-row">
          {filters.map((f) => (
            <button
              key={f}
              className={`earning-filter-btn${activeFilter === f ? " earning-filter-btn--active" : ""}`}
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
            <FiDollarSign className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Total Earned</span>
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
            <FiTrendingUp className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Avg per Ride</span>
            <span className="earning-stat-value">₹{avgPerRide}</span>
          </div>
          <div className="earning-stat-badge earning-stat-badge--up">
            <FiArrowUpRight />
            <span>8.1%</span>
          </div>
        </div>

        <div className="earning-stat-card">
          <div className="earning-stat-icon-wrap">
            <FiMapPin className="earning-stat-icon" />
          </div>
          <div className="earning-stat-body">
            <span className="earning-stat-label">Rides Completed</span>
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
            <span className="earning-stat-value">
              {recentTrips.reduce((s, t) => s + t.passengers, 0)}
            </span>
          </div>
          <div className="earning-stat-badge earning-stat-badge--up">
            <FiArrowUpRight />
            <span>5.3%</span>
          </div>
        </div>
      </div>

      {/* Chart + Payout */}
      <div className="earning-main-row">
        {/* Bar Chart */}
        <div className="earning-chart-card">
          <div className="earning-chart-header">
            <h2 className="earning-chart-title">Weekly Earnings</h2>
            <span className="earning-chart-meta">{activeFilter}</span>
          </div>
          <div className="earning-chart-bars">
            {weeklyData.map((d) => (
              <div key={d.day} className="earning-bar-group">
                <span className="earning-bar-amount">₹{d.amount}</span>
                <div className="earning-bar-track">
                  <div
                    className="earning-bar-fill"
                    style={{ height: `${(d.amount / maxBar) * 100}%` }}
                  />
                </div>
                <span className="earning-bar-day">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Summary */}
        <div className="earning-payout-card">
          <h2 className="earning-payout-title">Payout Summary</h2>
          <div className="earning-payout-hero">
            <span className="earning-payout-label">Available Balance</span>
            <span className="earning-payout-amount">₹2,200</span>
          </div>
          <div className="earning-payout-rows">
            <div className="earning-payout-row">
              <span className="earning-payout-row-label">Pending</span>
              <span className="earning-payout-row-val">₹800</span>
            </div>
            <div className="earning-payout-divider" />
            <div className="earning-payout-row">
              <span className="earning-payout-row-label">
                Withdrawn this month
              </span>
              <span className="earning-payout-row-val">₹1,200</span>
            </div>
            <div className="earning-payout-divider" />
            <div className="earning-payout-row">
              <span className="earning-payout-row-label">
                Platform fee (8%)
              </span>
              <span className="earning-payout-row-val earning-payout-row-val--red">
                -₹176
              </span>
            </div>
          </div>
          <button className="earning-withdraw-btn">Withdraw Now</button>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="earning-trips-card">
        <div className="earning-trips-header">
          <h2 className="earning-trips-title">Recent Trips</h2>
          <button className="earning-trips-export">Export CSV</button>
        </div>
        <div className="earning-table-wrap">
          <table className="earning-table">
            <thead>
              <tr>
                <th className="earning-th">Route</th>
                <th className="earning-th">Date & Time</th>
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
                    <span className="earning-status-chip">{trip.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
