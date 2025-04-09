import { NextResponse } from "next/server";

export function middleware(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const pathname = req.nextUrl.pathname;

        // Redirect unauthenticated users trying to access "/inbox"
        if (!token && pathname === "/inbox") {
            return NextResponse.redirect(new URL("/", req.url)); // Unauthenticated
        }

        // Redirect authenticated users trying to access "/"
        if (token && pathname !== "/inbox") {
            return NextResponse.redirect(new URL("/inbox", req.url)); // Already authenticated
        }

        // Allow other cases
        return NextResponse.next();
    } catch (err) {
        console.error("Middleware error:", err);
        return NextResponse.next(); // Fail-safe to avoid 500 loop
    }
}

export const config = {
    matcher: ["/", "/inbox"],
};

