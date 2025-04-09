import { NextResponse } from "next/server";

export function middleware(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const pathname = req.nextUrl.pathname;

        if (!token && pathname === "/inbox") {
            return NextResponse.redirect(new URL("/", req.url)); // Unauthenticated
        }

<<<<<<< HEAD
        if (token && pathname !== "/inbox") {
=======
        if (token && pathname === "/") {
>>>>>>> d0cfd7dbeb7a8e1a9bc2d0fc0c2a98d23da18ade
            return NextResponse.redirect(new URL("/inbox", req.url)); // Already authenticated
        }

        return NextResponse.next(); // Allow other cases
    } catch (err) {
        console.error("Middleware error:", err);
        return NextResponse.next(); // Fail-safe to avoid 500 loop
    }
}

export const config = {
    matcher: ["/", "/inbox"],
<<<<<<< HEAD
};
=======
};
>>>>>>> d0cfd7dbeb7a8e1a9bc2d0fc0c2a98d23da18ade
