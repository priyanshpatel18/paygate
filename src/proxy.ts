import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const config = {
  matcher: [
    '/api/apis/:path*',
  ],
};

export async function proxy(req: NextRequest) {
  const token = req.cookies.get('privy-token')?.value;

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Just redirect (no redirect_uri param)
    return NextResponse.redirect(new URL('/refresh', req.url));
  }

  try {
    // Decode (can replace with jwtVerify for stronger auth)
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded.sub !== 'string') {
      throw new Error('Invalid token');
    }

    // Clone headers and add privy user ID
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('privy-token', decoded.sub);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (err) {
    console.error('Middleware auth error:', err);

    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Redirect without redirect_uri
    return NextResponse.redirect(new URL('/refresh', req.url));
  }
}
