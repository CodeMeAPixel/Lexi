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

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && pathname.startsWith("/auth/verify")) {
    return NextResponse.next();
  }
  if (token && pathname.startsWith("/auth")) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (token) {
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
            dashboardUrl.search = "";
            return NextResponse.redirect(dashboardUrl);
          }
        }
      } catch (err) {
        console.error("proxy /api/me fetch failed", err);
      }
    }

    return NextResponse.next();
  }

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