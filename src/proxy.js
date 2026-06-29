import { NextResponse } from "next/server";

const GUEST_ROUTES = ["/login", "/signup"];

const PROTECTED_ROUTES = [
  "/profile",
  "/my-rides",
  "/booking-confirmation",
  "/booking-payment",
  "/track-chat",
  "/vehicle-details",
  "/vehicle-registration",
];

const DRIVER_ROUTES = [
  "/vehicle-registration",
  "/vehicle-details",
  "/my-earnings",
  "/requests",
];

const PASSENGER_ROUTES = [
  "/booking-confirmation",
  "/ride-booking",
  "/booking-payment",
  "/track-chat",
];

export function proxy(request) {
  console.log("Middleware running sucessfully ✅");

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  const isGuest = GUEST_ROUTES.includes(pathname);

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const isDriver = DRIVER_ROUTES.some((route) => pathname.startsWith(route));

  const isPassenger = PASSENGER_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  // Already logged in
  if (isGuest && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Login required
  if (!token && (isProtected || isDriver || isPassenger)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Driver only
  if (isDriver && role !== "driver") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Passenger only
  if (isPassenger && role !== "passenger") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
