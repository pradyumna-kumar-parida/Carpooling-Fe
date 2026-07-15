import img1 from "@/assets/images/offer-ride-profile-1.jpg";
import img2 from "@/assets/images/offer-ride-profile-2.jpg";
import img3 from "@/assets/images/offer-ride-profile-3.jpg";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Booking Request",
    body: "Pradyumna requested 2 seats for Mumbai to Pune.",
    time: "2 min ago",
    img: img1,
    read: false,
  },
  {
    id: 2,
    title: "Ride Confirmed",
    body: "Your ride to Bangalore has been confirmed.",
    time: "10 min ago",
    read: false,
    img: img2,
  },
  {
    id: 3,
    title: "Ride Confirmed",
    body: "Your ride to Bangalore has been confirmed.",
    time: "10 min ago",
    read: false,
    img: img2,
  },
  {
    id: 4,
    title: "Ride Confirmed",
    body: "Your ride to Bangalore has been confirmed.",
    time: "10 min ago",
    read: false,
    img: img2,
  },
  {
    id: 5,
    title: "Passenger Cancelled",
    body: "Amit cancelled his booking request.",
    time: "1 hour ago",
    read: true,
    img: img3,
  },
];
export default INITIAL_NOTIFICATIONS;
