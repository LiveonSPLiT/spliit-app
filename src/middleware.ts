import { auth } from '@/lib/auth'
import { env } from '@/lib/env'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/groups']

export default async function middleware(request: NextRequest) {
  const session = await auth()

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )

  if (!session && isProtected) {
    // Store the current URL in a query parameter to redirect back after login
    const publicUrl = env.NEXT_PUBLIC_BASE_URL || 'https://liveonsplit.com'
    const redirectUrl = new URL('/', request.nextUrl.origin)
    const redirectGroupUrl = `${publicUrl}/groups${
      request.nextUrl.toString().split('/groups')[1]
    }`
    redirectUrl.searchParams.set('callbackUrl', redirectGroupUrl)
    return NextResponse.redirect(redirectUrl.toString())
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
