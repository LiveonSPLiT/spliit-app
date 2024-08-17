import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/groups"];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  
  if (!session && isProtected) {
    // Store the current URL in a query parameter to redirect back after login
    const redirectUrl = new URL("/", request.nextUrl.origin);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.toString());
    return NextResponse.redirect(redirectUrl.toString());

  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};