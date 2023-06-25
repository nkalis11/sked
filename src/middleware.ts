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
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  // if the user is not signed in redirect them to the sign in page.
  const { userId } = getAuth(request)

  if (!userId) {
    // redirect the users to /pages/users/sign-in/[[...index]].ts
    // and pass the current url as a query parameter
    const signInUrl = new URL('/users/sign-in', request.url)
    signInUrl.searchParams.set('redirect_url', '/dashboard/maintenance') //Redirects to the maintenance page
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
})

export const config = { matcher:  '/((?!_next/image|_next/static|favicon.ico).*)'};