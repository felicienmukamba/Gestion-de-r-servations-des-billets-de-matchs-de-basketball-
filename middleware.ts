import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

    // Allow API routes for authentication to proceed without redirection
    if (isApiAuthRoute) {
      return null;
    }

    // If the user is on an auth page and is already authenticated, redirect them to the dashboard.
    // This prevents a logged-in user from seeing the sign-in page.
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null; // This allows the auth page to load if the user is not authenticated.
    }

    // If the user is not authenticated and is trying to access a protected page, redirect to sign-in.
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url));
    }

    // Role-based access control
    const pathname = req.nextUrl.pathname;
    const userRole = token?.role;

    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/manager") && userRole !== "GESTIONNAIRE" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages even if there is no token
        const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
        return !!token || isAuthPage;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/manager/:path*", "/auth/:path*"],
};