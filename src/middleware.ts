import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = [
    '/auth/reset',
    '/dashboard',
    '/rephrase'
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Only run on protected paths
    if (!PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token) {
        return NextResponse.next();
    }

    // Redirect to signin with callback
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
}

export const config = {
    matcher: [
        '/rephrase/:path*',
        '/auth/reset/:path*',
        '/dashboard/:path*',
        '/admin/:path*'
    ],
};
