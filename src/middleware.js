import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value; // Get token from cookies

    if (!token) {
        return NextResponse.redirect(new URL("/", req.url)); // Redirect to login page
    }
    if (token && req.nextUrl.pathname !== "/inbox") 
    {
        return NextResponse.redirect(new URL("/inbox", req.url)); 
    }

    return NextResponse.next(); // Allow access if token exists
}

export const config = {
    matcher: "/inbox", // Apply middleware to /inbox route
};
