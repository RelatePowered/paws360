import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/** Routes that don't require authentication. */
const PUBLIC_ROUTES = ['/login', '/auth/callback', '/marketing', '/api/early-access'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase must be configured — if not, block protected routes
  if (!supabaseUrl || !supabaseKey) {
    // Allow public routes and the root marketing page through
    if (pathname === '/' || PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
      return NextResponse.next();
    }
    // Everything else redirects to root (marketing) when Supabase isn't set up
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow public routes and root marketing page through without auth
  if (pathname === '/' || PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Create a response we can mutate (to refresh session cookies)
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refresh the session (important: call getUser, not getSession, for security)
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
