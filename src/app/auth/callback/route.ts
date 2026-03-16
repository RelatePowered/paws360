import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

/**
 * Handles the OAuth / magic-link callback from Supabase Auth.
 * Exchanges the code for a session, then redirects to the app.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If something went wrong, send back to login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
