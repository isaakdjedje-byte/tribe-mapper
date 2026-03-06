import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Create response that iron-session will modify with session cookie
    const res = NextResponse.json({});
    const session = await getIronSession<SessionData>(request, res, sessionOptions);
    session.destroy();
    // IMPORTANT: Copy the Set-Cookie header from the modified response
    // iron-session sets the cleared session cookie header on res
    const setCookieHeader = res.headers.get('set-cookie');
    const successRes = NextResponse.json({ success: true });
    if (setCookieHeader) {
      successRes.headers.set('Set-Cookie', setCookieHeader);
    }
    return successRes;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
