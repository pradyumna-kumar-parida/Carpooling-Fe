import { proxy } from "./src/proxy.js";

export const config = {
  matcher: ["/driver/:path*", "/passenger/:path*", "/login", "/signup"],
};

export function middleware(request) {
  return proxy(request);
}
