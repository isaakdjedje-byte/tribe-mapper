import { getIronSession, SessionOptions } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';

export interface SessionData {
  isAdmin?: boolean;
}

// Check if we're in the build/static generation phase
const isBuildPhase = typeof process.env.NEXT_PHASE !== 'undefined' && 
  process.env.NEXT_PHASE === 'phase-production-build';

const isProduction = process.env.NODE_ENV === 'production';

// Get the session password with validation
// During build: allow placeholder
// In production runtime: require explicit secret >= 32 chars
// In development: allow fallback
function getSessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  
  // During Next.js build/static generation, we can't validate
  // The actual validation happens at server runtime
  if (isBuildPhase) {
    return secret || 'build-time-placeholder-will-be-validated-at-runtime';
  }
  
  // In production runtime, require explicit secret
  if (isProduction) {
    if (!secret) {
      console.error('FATAL: SESSION_SECRET environment variable is required in production');
      console.error('Generate one with: openssl rand -base64 32');
      throw new Error(
        'SESSION_SECRET environment variable is required in production. ' +
        'Generate one with: openssl rand -base64 32'
      );
    }
    if (secret.length < 32) {
      throw new Error(
        `SESSION_SECRET must be at least 32 characters long in production. Current length: ${secret.length}. ` +
        'Generate one with: openssl rand -base64 32'
      );
    }
    return secret;
  }
  
  // Development: use provided secret or fallback
  return secret || 'dev-session-secret-not-for-production-32chars!';
}

// Create session options dynamically
function createSessionOptions(): SessionOptions {
  return {
    cookieName: 'tribe_mapper_session',
    password: getSessionPassword(),
    cookieOptions: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'strict' as const,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  };
}

// Cached options - but recreated each access to allow runtime validation
let cachedOptions: SessionOptions | null = null;

export function getSessionOptions(): SessionOptions {
  // In production runtime, always recreate to validate
  // In build/development, can cache
  if (!isProduction || isBuildPhase) {
    if (!cachedOptions) {
      cachedOptions = createSessionOptions();
    }
    return cachedOptions;
  }
  
  // In production runtime, validate every time (ensures secret is checked)
  return createSessionOptions();
}

// Legacy export for backward compatibility
export const sessionOptions: SessionOptions = {
  get password() {
    return getSessionPassword();
  },
  cookieName: 'tribe_mapper_session',
  cookieOptions: {
    secure: isProduction,
    httpOnly: true,
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession(req: NextRequest, res: NextResponse) {
  return getIronSession<SessionData>(req, res, getSessionOptions());
}

export function requireAdmin(session: SessionData): boolean {
  return session.isAdmin === true;
}

// Server-side helper for API routes
export async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  const res = NextResponse.json({});
  const session = await getIronSession<SessionData>(request, res, getSessionOptions());
  return session.isAdmin === true;
}
