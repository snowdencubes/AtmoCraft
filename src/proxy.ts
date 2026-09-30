import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // We use client-side Zustand for auth, so middleware just passes through.
  // The actual route guard happens in the layout components which read the Zustand store.
  // In a real app with server-side auth (like Supabase), we would check the session cookie here.
  return NextResponse.next();
}

export const config = {
  matcher: ['/trainee/:path*', '/trainer/:path*', '/admin/:path*'],
};
