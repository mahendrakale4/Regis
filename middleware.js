import { NextResponse } from 'next/server'

export function middleware(request) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname

    // Define protected routes that require authentication
    const protectedRoutes = ['/mem', '/dash']

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

    // Get the user email from localStorage (this will be null if not logged in)
    const userEmail = request.cookies.get('userEmail')?.value

    // If it's a protected route and user is not logged in, redirect to login
    if (isProtectedRoute && !userEmail) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
    matcher: ['/mem/:path*', '/dash/:path*']
} 