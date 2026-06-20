import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJWT(token: string) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("token")?.value;
    const payload = token ? parseJWT(token) : null;

    const roles: string[] = payload?.roles || [];

    const isAuthenticated = !!payload;
    const isAdmin = roles.includes("ADMIN");

    const isAuthPage = pathname.startsWith("/auth");
    const isAdminRoute = pathname.startsWith("/admin");

    if (!isAuthenticated && !isAuthPage) {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    if (isAdminRoute && !isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/not-found";
        return NextResponse.rewrite(url);
    }

    if (isAuthenticated && isAuthPage) {
        return NextResponse.redirect(
            new URL("/courses", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};