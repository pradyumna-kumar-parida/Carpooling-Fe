import { NextResponse } from "next/server";

const GUEST_ROUTES = ["/login", "/signup"];

const PROTECTED_ROUTES = ["/driver", "/passenger"];

const DRIVER_ROUTES = [
  "/driver/vehicle-registration",
  "/driver/profile",
  "/driver/vehicle-details",
  "/driver/my-rides",
  "/driver/earnings",
  "/driver/booking-requests",
  "/driver/published-rides",
];

const PASSENGER_ROUTES = [
  "/passenger/booking-confirmation",
  "/passenger/ride-booking",
  "/passenger/booking-payment",
  "/passenger/track-chat",
  "/passenger/my-rides",
  "/passenger/profile",
  "/passenger/approval-requests",
];

export function proxy(request) {
  console.log("Middleware running successfully ✅");

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  const isGuest = GUEST_ROUTES.some((route) => pathname.startsWith(route));

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isDriver = DRIVER_ROUTES.some((route) => pathname.startsWith(route));

  const isPassenger = PASSENGER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isGuest && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDriver && role !== "driver") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPassenger && role !== "passenger") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/driver/:path*", "/passenger/:path*", "/login", "/signup"],
};
