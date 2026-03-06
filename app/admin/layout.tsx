import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { getSessionOptions, SessionData } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // In Next.js 16 App Router, cookies() is async and must be awaited
  const cookieStore = await cookies();
  
  // Create minimal request-like object for iron-session
  // This wraps the Next.js 16 cookie store in the format iron-session expects
  const req = {
    headers: {
      cookie: cookieStore.toString(),
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
