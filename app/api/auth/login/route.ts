import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Create response that iron-session will modify with session cookie
    const res = NextResponse.json({});
    const session = await getIronSession<SessionData>(request, res, sessionOptions);
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (password === adminPassword) {
      (session as SessionData).isAdmin = true;
      await session.save();
      // IMPORTANT: Copy the Set-Cookie header from the modified response
      // iron-session sets the session cookie header on res
      const setCookieHeader = res.headers.get('set-cookie');
      const successRes = NextResponse.json({ success: true });
      if (setCookieHeader) {
        successRes.headers.set('Set-Cookie', setCookieHeader);
      }
      return successRes;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
