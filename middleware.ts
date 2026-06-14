import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const isAuthenticated = true;

    const isAuthPage =
        request.nextUrl.pathname.startsWith("/auth");

    if (!isAuthenticated && !isAuthPage) {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(
            new URL("/programs", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/programs/:path*",
        "/profiles/:path*",
        "/documents/:path*",
        "/tests/:path*",
        "/auth/:path*",
    ],
};