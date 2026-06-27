import { NextResponse } from "next/server";

const proxy = (request) => {
  console.log("Middleware running");
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;
  const guestRoutes = ["/login", "/signup"];
  const protectedRoutes = [
    "/profile",
    "/my-rides",
    "/booking-confirmation",
    "/booking-payment",
    "/track-chat",
    "/vehicle-details",
    "/vehicle-registration",
  ];

  const driverRoutes = [
    "/vehicle-registration",
    "/vehicle-details",
    "/my-earnings",
    "/requests",
  ];

  const userRoutes = [
    "/booking-confirmation",
    "/ride-booking",
    "/booking-payment",
    "/track-chat",
  ];
  const isGuestRoute = guestRoutes.includes(pathname);
  const isDriverRoute = driverRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  // Guest Route Protection
  if (isGuestRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if ((isProtectedRoute || isDriverRoute || isUserRoute) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isDriverRoute && role !== "driver") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isUserRoute && role !== "passenger") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export default proxy;
export const config = {
  matcher: ["/:path*"],
};
