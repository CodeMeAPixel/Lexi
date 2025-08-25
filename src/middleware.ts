import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = [
  "/auth/verify",
  "/auth/reset",
  "/dashboard",
  "/tools",
  "/admin",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get token (if logged in)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If logged in and hitting /auth/verify, allow access
  if (token && pathname.startsWith("/auth/verify")) {
    return NextResponse.next();
  }
  // If logged in and hitting any other /auth page -> redirect to dashboard
  if (token && pathname.startsWith("/auth")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Only enforce checks on protected paths
  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (token) {
    // If user goes deeper into /dashboard/* or /tools/* and is unverified, force them back to /dashboard
    const isDashboardSubpage =
      pathname.startsWith("/dashboard") &&
      pathname !== "/dashboard" &&
      pathname !== "/dashboard/";
    const isToolPage = pathname.startsWith("/tools");
    if (isDashboardSubpage || isToolPage) {
      try {
        const meUrl = req.nextUrl.clone();
        meUrl.pathname = "/api/me";

        const res = await fetch(meUrl, {
          headers: { cookie: req.headers.get("cookie") || "" },
        });

        if (res.ok) {
          const body = await res.json();
          const emailVerified = !!body?.user?.emailVerified;
          if (!emailVerified) {
            const dashboardUrl = req.nextUrl.clone();
            dashboardUrl.pathname = "/dashboard";
            dashboardUrl.search = ""; // clear query params if any
            return NextResponse.redirect(dashboardUrl);
          }
        }
      } catch (err) {
        console.error("middleware /api/me fetch failed", err);
      }
    }

    return NextResponse.next();
  }

  // Not logged in → redirect to signin
  const signInUrl = req.nextUrl.clone();
  signInUrl.pathname = "/auth/signin";
  signInUrl.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search,
  );

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/tools/:path*",
    "/admin/:path*",
  ],
};
