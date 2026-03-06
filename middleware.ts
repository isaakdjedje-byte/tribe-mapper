import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (but not /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(request, res, sessionOptions);
    
    if (!(session as SessionData).isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
