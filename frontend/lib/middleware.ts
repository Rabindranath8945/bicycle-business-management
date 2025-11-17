import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jid"); // refresh cookie

  const protectedRoutes = [
    "/dashboard",
    "/products",
    "/categories",
    "/customers",
    "/sales",
    "/settings",
  ];

  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/customers/:path*",
    "/sales/:path*",
    "/settings/:path*",
  ],
};
