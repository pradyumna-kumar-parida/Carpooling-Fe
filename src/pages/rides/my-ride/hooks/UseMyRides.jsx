"use client";

import { useState } from "react";

const upcomingRides = [
  {
    id: 1,
    from: "Mumbai",
    to: "Pune",
    date: "April 25, 2026",
    time: "11:00 AM",
    duration: "3h 10m",
    fromAddress:
      "Terminal 2, International APT, Metro Stn, Navpada, Marol, Andheri(E)",
    toAddress: "FR6C+9WF, Navale Brg, Kudale Baug, Vadgaon Budruk, Maharashtra",
    driver: {
      name: "Suraj Kumar",
      avatar: "https://i.pravatar.cc/150?img=33",
      rating: 4.8,
      car: "Maruti Swift Dzire - White",
      phone: "+91 9876543210",
    },
    price: 600,
    passengers: 2,
    status: "confirmed",
  },
  {
    id: 2,
    from: "Delhi",
    to: "Agra",
    date: "April 28, 2026",
    time: "06:00 AM",
    duration: "4h 30m",
    fromAddress: "Connaught Place, New Delhi",
    toAddress: "Taj Mahal Road, Agra",
    passengers: 3,
    price: 450,
    status: "confirmed",
    bookedSeats: [
      {
        name: "Rahul Singh",
        avatar: "https://i.pravatar.cc/150?img=12",
        phone: "+91 9876543211",
      },
      {
        name: "Priya Sharma",
        avatar: "https://i.pravatar.cc/150?img=45",
        phone: "+91 9876543212",
      },
    ],
  },
  {
    id: 3,
    from: "Bangalore",
    to: "Mysore",
    date: "May 2, 2026",
    time: "09:30 AM",
    duration: "2h 45m",
    fromAddress: "MG Road, Bangalore",
    toAddress: "Mysore Palace Road",
    driver: {
      name: "Amit Patel",
      avatar: "https://i.pravatar.cc/150?img=68",
      rating: 4.9,
      car: "Honda City - Silver",
      phone: "+91 9876543213",
    },
    price: 350,
    passengers: 1,
    status: "confirmed",
  },
];

const completedRides = [
  {
    id: 4,
    from: "Chennai",
    to: "Pondicherry",
    date: "April 10, 2026",
    time: "02:00 PM",
    duration: "3h 00m",
    fromAddress: "Chennai Central Railway Station",
    toAddress: "Beach Road, Pondicherry",
    driver: {
      name: "Vijay Kumar",
      avatar: "https://i.pravatar.cc/150?img=56",
      rating: 4.7,
      car: "Hyundai Creta - Red",
      phone: "+91 9876543214",
    },
    price: 500,
    passengers: 2,
    status: "completed",
  },
  {
    id: 5,
    from: "Kolkata",
    to: "Darjeeling",
    date: "March 20, 2026",
    time: "05:00 AM",
    duration: "12h 00m",
    fromAddress: "Howrah Station, Kolkata",
    toAddress: "Mall Road, Darjeeling",
    passengers: 4,
    price: 1200,
    status: "completed",
    bookedSeats: [
      {
        name: "Sneha Das",
        avatar: "https://i.pravatar.cc/150?img=23",
        phone: "+91 9876543215",
      },
      {
        name: "Arjun Roy",
        avatar: "https://i.pravatar.cc/150?img=67",
        phone: "+91 9876543216",
      },
      {
        name: "Meera Sen",
        avatar: "https://i.pravatar.cc/150?img=89",
        phone: "+91 9876543217",
      },
    ],
  },
];

const cancelledRides = [
  {
    id: 6,
    from: "Hyderabad",
    to: "Vijayawada",
    date: "April 5, 2026",
    time: "08:00 AM",
    duration: "5h 30m",
    fromAddress: "HITEC City, Hyderabad",
    toAddress: "MG Road, Vijayawada",
    driver: {
      name: "Rajesh Reddy",
      avatar: "https://i.pravatar.cc/150?img=15",
      rating: 4.5,
      car: "Toyota Innova - White",
      phone: "+91 9876543218",
    },
    price: 700,
    passengers: 1,
    status: "cancelled",
    cancelledBy: "You",
    cancelReason: "Change of plans",
  },
];

export const RIDES_DATA = { upcomingRides, completedRides, cancelledRides };

export function getStatusColor(status) {
  switch (status) {
    case "confirmed":
      return "#008257";
    case "pending":
      return "#f59e0b";
    case "completed":
      return "#3b82f6";
    case "cancelled":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

export function useMyRides() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedRide, setSelectedRide] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const getRidesData = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingRides;
      case "completed":
        return completedRides;
      case "cancelled":
        return cancelledRides;
      default:
        return upcomingRides;
    }
  };

  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setOpenDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsModal(false);
    setSelectedRide(null);
  };

  return {
    activeTab,
    setActiveTab,
    selectedRide,
    openDetailsModal,
    getRidesData,
    handleViewDetails,
    handleCloseDetails,
  };
}
