import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone();
  
  // Route Protection Logic
  const isAuthRoute = url.pathname.startsWith('/login') || url.pathname.startsWith('/signup') || url.pathname.startsWith('/forgot-password');
  const isPublicRoute = url.pathname === '/' || url.pathname.startsWith('/public') || isAuthRoute;
  
  if (
    !user &&
    !isPublicRoute &&
    !url.pathname.startsWith('/api') &&
    !url.pathname.startsWith('/_next')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  if (user && isAuthRoute) {
    // If user is already logged in and tries to go to login/signup, redirect to dashboard
    url.pathname = '/dashboard' // we'll redirect to specific dashboards later
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}
