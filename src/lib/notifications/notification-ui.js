import {
  FaGift,
  FaHandPaper,
  FaSignOutAlt,
  FaLock,
  FaKey,
  FaUser,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCar,
  FaEdit,
  FaBan,
  FaFlagCheckered,
  FaClock,
  FaUsers,
  FaTicketAlt,
  FaUserPlus,
  FaMoneyBillWave,
  FaCreditCard,
  FaTimes,
  FaTools,
  FaBullhorn,
} from "react-icons/fa";
import { FaBell } from "react-icons/fa6";
import { FaExclamationTriangle } from "react-icons/fa";

export const notificationUI = {
  // AUTH

  SIGNUP_SUCCESS: {
    icon: FaGift,
    title: "Welcome to Carpooling",
  },

  LOGIN_SUCCESS: {
    icon: FaHandPaper,
    title: "Welcome back",
  },

  LOGOUT: {
    icon: FaSignOutAlt,
    title: "Logged out",
  },

  PASSWORD_CHANGED: {
    icon: FaLock,
    title: "Password changed",
  },

  PASSWORD_RESET_REQUESTED: {
    icon: FaKey,
    title: "Password reset requested",
  },

  PASSWORD_RESET_SUCCESS: {
    icon: FaLock,
    title: "Password reset successful",
  },

  // PROFILE / VERIFICATION

  PROFILE_UPDATED: {
    icon: FaUser,
    title: "Profile updated",
  },

  VERIFICATION_SUBMITTED: {
    icon: FaFileAlt,
    title: "Verification submitted",
  },

  VERIFICATION_COMPLETE: {
    icon: FaCheckCircle,
    title: "Verification complete",
  },

  VERIFICATION_REJECTED: {
    icon: FaTimesCircle,
    title: "Verification rejected",
  },

  DOCUMENT_VERIFICATION_PENDING: {
    icon: FaHourglassHalf,
    title: "Verification pending",
  },

  DOCUMENT_VERIFICATION_COMPLETE: {
    icon: FaCheckCircle,
    title: "Document verified",
  },

  DOCUMENT_VERIFICATION_REJECTED: {
    icon: FaTimesCircle,
    title: "Document verification failed",
  },

  // VEHICLE

  VEHICLE_ADDED: {
    icon: FaCar,
    title: "Vehicle added",
  },

  VEHICLE_VERIFICATION_PENDING: {
    icon: FaHourglassHalf,
    title: "Vehicle verification pending",
  },

  VEHICLE_VERIFIED: {
    icon: FaCheckCircle,
    title: "Vehicle verified",
  },

  VEHICLE_VERIFICATION_REJECTED: {
    icon: FaTimesCircle,
    title: "Vehicle verification rejected",
  },

  VEHICLE_REMOVED: {
    icon: FaCar,
    title: "Vehicle removed",
  },

  // RIDES

  RIDE_PUBLISHED: {
    icon: FaCar,
    title: "Ride published",
  },

  RIDE_UPDATED: {
    icon: FaEdit,
    title: "Ride updated",
  },

  RIDE_CANCELLED: {
    icon: FaBan,
    title: "Ride cancelled",
  },

  RIDE_COMPLETED: {
    icon: FaFlagCheckered,
    title: "Ride completed",
  },

  RIDE_STARTING_SOON: {
    icon: FaClock,
    title: "Ride starting soon",
  },

  RIDE_DEPARTURE_CHANGED: {
    icon: FaClock,
    title: "Departure time changed",
  },

  RIDE_FULL: {
    icon: FaUsers,
    title: "Ride is full",
  },

  // BOOKINGS

  BOOKING_CREATED: {
    icon: FaTicketAlt,
    title: "Ride booked",
  },

  RIDE_BOOKING_REQUESTED: {
    icon: FaUserPlus,
    title: "New booking",
  },

  BOOKING_ACCEPTED: {
    icon: FaCheckCircle,
    title: "Booking accepted",
  },

  BOOKING_REJECTED: {
    icon: FaTimesCircle,
    title: "Booking rejected",
  },

  BOOKING_CANCELLED: {
    icon: FaBan,
    title: "Booking cancelled",
  },

  BOOKING_COMPLETED: {
    icon: FaFlagCheckered,
    title: "Booking completed",
  },

  BOOKING_REFUNDED: {
    icon: FaMoneyBillWave,
    title: "Booking refunded",
  },

  // PAYMENTS

  PAYMENT_SUCCESS: {
    icon: FaCreditCard,
    title: "Payment successful",
  },

  PAYMENT_FAILED: {
    icon: FaTimesCircle,
    title: "Payment failed",
  },

  PAYMENT_PENDING: {
    icon: FaHourglassHalf,
    title: "Payment pending",
  },

  PAYMENT_REFUNDED: {
    icon: FaMoneyBillWave,
    title: "Payment refunded",
  },

  PAYMENT_RECEIVED: {
    icon: FaMoneyBillWave,
    title: "Payment received",
  },

  PAYOUT_PENDING: {
    icon: FaHourglassHalf,
    title: "Payout pending",
  },

  PAYOUT_PROCESSED: {
    icon: FaMoneyBillWave,
    title: "Payout processed",
  },

  PAYOUT_FAILED: {
    icon: FaTimesCircle,
    title: "Payout failed",
  },

  // SYSTEM

  SYSTEM: {
    icon: FaBell,
    title: "Notification",
  },

  SYSTEM_ALERT: {
    icon: FaExclamationTriangle,
    title: "System alert",
  },

  MAINTENANCE: {
    icon: FaTools,
    title: "Scheduled maintenance",
  },

  PROMOTION: {
    icon: FaGift,
    title: "Special offer",
  },

  BROADCAST: {
    icon: FaBullhorn,
    title: "Announcement",
  },
};
