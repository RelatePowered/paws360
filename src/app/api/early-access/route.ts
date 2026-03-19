import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

// Simple in-memory rate limiter keyed by IP — resets on cold start.
// For production, replace with a distributed store (e.g. Upstash Redis).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max submissions per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await request.json();

  const required = ['firstName', 'lastName', 'email', 'companyName', 'staffCount', 'animalsPerYear', 'role'] as const;
  for (const field of required) {
    if (!body[field]?.trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  // Validate email format
  const email = body.email.trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from('early_access_requests').insert({
    first_name: body.firstName.trim(),
    last_name: body.lastName.trim(),
    email,
    company_name: body.companyName.trim(),
    staff_count: body.staffCount.trim(),
    animals_per_year: body.animalsPerYear.trim(),
    role: body.role.trim(),
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
