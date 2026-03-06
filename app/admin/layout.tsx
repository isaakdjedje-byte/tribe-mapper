import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getIronSession } from 'iron-session';
import { getSessionOptions, SessionData } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  
  // Verify admin session server-side
  const session = await getIronSession<SessionData>(
    { cookies: () => cookieStore } as any,
    {} as any,
    getSessionOptions()
  );
  
  if (!session.isAdmin) {
    redirect('/admin/login');
  }
  
  return <>{children}</>;
}
