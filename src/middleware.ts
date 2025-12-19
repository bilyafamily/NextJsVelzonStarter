// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
// import { Roles } from "./types/auth";

enum Roles {
  Admin = "IRP.Admin",
  Sme = "IRP.Investigator",
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const session = await auth();

    const isLoggedIn = !!session?.user;

    const userRoles = session?.user?.roles || [];

    console.log(userRoles);

    const isAuthPage = pathname.startsWith("/auth");
    const isAdminRoute = pathname.startsWith("/admin");
    const isSmeRoute = pathname.startsWith("/sme");

    const isApiRoute = pathname.startsWith("/api");

    // Skip middleware for API routes and static files
    if (
      isApiRoute ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon")
    ) {
      return NextResponse.next();
    }

    //Redirect logged-in users away from auth pages
    if (isLoggedIn && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Check admin routes - user must be logged in AND have admin role
    if (isSmeRoute) {
      if (!isLoggedIn) {
        const callbackUrl = pathname + request.nextUrl.search;
        return NextResponse.redirect(
          new URL(
            `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
            request.url
          )
        );
      }

      // Check if user has admin role
      if (!userRoles.includes(Roles.Sme)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // Check admin routes - user must be logged in AND have admin role
    if (isAdminRoute) {
      if (!isLoggedIn) {
        const callbackUrl = pathname + request.nextUrl.search;
        return NextResponse.redirect(
          new URL(
            `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
            request.url
          )
        );
      }

      // Check if user has admin role
      // if (!userRoles.includes(Roles.Admin)) {
      //   return NextResponse.redirect(new URL("/unauthorized", request.url));
      // }
    }

    // Otherwise, allow
    return NextResponse.next();
  } catch (error: any) {
    console.log("ERror", error);
    return NextResponse.redirect(
      new URL(
        `/auth/error?error=${encodeURIComponent(error.message)}`,
        request.url
      )
    );
  }
}
export const config = {
  matcher: [
    // "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|login|auth/error).*)",
    // Add more as needed
  ],
};
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|login|auth/error).*)",
//   ],
// };
