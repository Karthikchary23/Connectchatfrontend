export function middleware(req) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    if (!token && pathname === "/inbox") {
        return NextResponse.redirect(new URL("/", req.url)); // Not logged in, trying to access inbox
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/inbox", req.url)); // Logged in, trying to access login page
    }

    return NextResponse.next(); // Allow
}

export const config = {
    matcher: ["/", "/inbox"], // Apply to both routes
};
