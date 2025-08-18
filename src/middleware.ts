import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = ["/auth/verify", "/auth/reset", "/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run on protected paths
  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) {
    // If the user is authenticated but is navigating to a dashboard subpage
    // (not the root /dashboard), ensure their email is verified. If not,
    // redirect them back to the main /dashboard page where the verification
    // alert is shown.
    if (
      pathname.startsWith("/dashboard") &&
      pathname !== "/dashboard" &&
      pathname !== "/dashboard/"
    ) {
      try {
        // Call server API /api/me to get the latest user record (includes emailVerified).
        const meUrl = new URL("/api/me", req.url).toString();
        const res = await fetch(meUrl, {
          headers: { cookie: req.headers.get("cookie") || "" },
        });
        if (res.ok) {
          const body = await res.json();
          const emailVerified = !!body?.user?.emailVerified;
          if (!emailVerified) {
            const dashboardUrl = new URL("/dashboard", req.url);
            return NextResponse.redirect(dashboardUrl);
          }
        }
      } catch (err) {
        // If checking fails, allow navigation so we don't block users unnecessarily
        console.error("middleware /api/me fetch failed", err);
      }
    }

    return NextResponse.next();
  }

  // Redirect to signin with callback
  const signInUrl = new URL("/auth/signin", req.url);
  signInUrl.searchParams.set(
    "callbackUrl",
    req.nextUrl.pathname + req.nextUrl.search,
  );
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    "/auth/verify/:path*",
    "/auth/reset/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
