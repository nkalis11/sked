import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set the paths that don't require the user to be signed in
const publicPaths = ['/', '/users/sign-in*', '/users/sign-up*']

const isPublic = (path: string) => {
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request)

  // if uses is signed in, allow them to continue
  if (userId && request.nextUrl.pathname.startsWith('/users/sign-in')) {
    return NextResponse.redirect('/dashboard/maintenance');
  }
  // If the path is public, proceed without any further checks.
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  // If the user is not signed in and they're trying to access a non-public page, redirect them to the sign-in page.
  if (!userId && !isPublic(request.nextUrl.pathname)) {
    const signInUrl = new URL('/users/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', request.url)
    return NextResponse.redirect(signInUrl)
  }
  // If neither condition is met, proceed to the requested page.
  return NextResponse.next()
})

export const config = { matcher:  '/((?!_next/image|_next/static|favicon.ico).*)'};