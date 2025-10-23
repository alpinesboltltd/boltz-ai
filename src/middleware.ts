import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;

  // Define protected paths that require authentication
  const isProtectedPath =
    path.startsWith("/dashboard") || path.startsWith("/chatagent");

  // Define auth paths
  const isAuthPath = path.startsWith("/auth/");

  // Check for Bearer token in Authorization header first
  let token: string | undefined = undefined;
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    // Fallback to cookie
    token = request.cookies.get("auth_token")?.value;
  }

  // If accessing protected path without token, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set(
      "redirect",
      encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)
    );
    return NextResponse.redirect(url);
  }

  // If logged in and trying to access auth pages, redirect to dashboard or intended page
  if (token && isAuthPath) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    const targetUrl = redirectTo
      ? decodeURIComponent(redirectTo)
      : "/dashboard";
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|v1).*)"],
};
