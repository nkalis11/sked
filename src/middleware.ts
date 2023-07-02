import { withClerkMiddleware, getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Set the paths that don't require the user to be signed in
const publicPaths = ['/', '/users/sign-in*', '/users/sign-up*']

const isPublic = (path: string) => { //Checks if the path is public
  return publicPaths.find(x =>
    path.match(new RegExp(`^${x}$`.replace('*$', '($|/)')))
  )
}

// Middleware to check if the user is signed in
export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request)

  if (isPublic(request.nextUrl.pathname)) {
    if (userId) {
      // If the user is signed in and visits a public path, redirect them to the dashboard
      const dashboardUrl = new URL('/dashboard/maintenance', request.url)
      return NextResponse.redirect(dashboardUrl.toString())
    }
    // If the user is not signed in, let them proceed
    return NextResponse.next()
  }

  if (!userId) {
    // If the user is not signed in and tries to access a non-public path, redirect them to the sign-in page.
    const signInUrl = new URL('/users/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', '/dashboard/maintenance') //Redirects to the maintenance page
    return NextResponse.redirect(signInUrl.toString())
  }

  // If the user is signed in and tries to access a non-public path, let them proceed
  return NextResponse.next()
})

export const config = { matcher:  '/((?!_next/image|_next/static|favicon.ico).*)'};
