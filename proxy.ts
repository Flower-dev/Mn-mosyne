import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isOnDashboard = pathname.startsWith("/app");

  // Edge-compatible: just checks the cookie, no Node.js DB call
  const sessionCookie = getSessionCookie(request);
  const isLoggedIn = !!sessionCookie;

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isOnDashboard && isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
