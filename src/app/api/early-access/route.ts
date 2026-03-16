import { createClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const body = await request.json();

  const required = ['firstName', 'lastName', 'email', 'companyName', 'staffCount', 'animalsPerYear', 'role'] as const;
  for (const field of required) {
    if (!body[field]?.trim()) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from('early_access_requests').insert({
    first_name: body.firstName.trim(),
    last_name: body.lastName.trim(),
    email: body.email.trim(),
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
