import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { getSessionOptions, SessionData } from '@/lib/auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  // In Next.js 16 App Router, cookies() is async and must be awaited
  const cookieStore = await cookies();
  
  // Build cookie header string manually from cookie store
  // cookieStore.toString() returns "[object Object]" which breaks iron-session
  const cookieEntries: string[] = [];
  try {
    // Get all cookies from the store
    const allCookies = cookieStore.getAll();
    for (const cookie of allCookies) {
      cookieEntries.push(`${cookie.name}=${encodeURIComponent(cookie.value)}`);
    }
  } catch (e) {
    // If getAll fails, try getting just the session cookie
    const sessionCookie = cookieStore.get('tribe_mapper_session');
    if (sessionCookie) {
      cookieEntries.push(`${sessionCookie.name}=${encodeURIComponent(sessionCookie.value)}`);
    }
  }
  const cookieHeader = cookieEntries.join('; ');
  
  // Create minimal request-like object for iron-session
  const req = {
    headers: {
      cookie: cookieHeader,
    },
  };
  
  // Create minimal response-like object
  const res = {
    getHeader: () => undefined,
    setHeader: () => {},
  };
  
  try {
    // Verify admin session server-side
    const session = await getIronSession<SessionData>(
      req as any,
      res as any,
      getSessionOptions()
    );
    
    if (!session.isAdmin) {
      redirect('/admin/login');
    }
  } catch (error) {
    // If session is invalid/expired, redirect to login
    redirect('/admin/login');
  }
  
  return <>{children}</>;
}
