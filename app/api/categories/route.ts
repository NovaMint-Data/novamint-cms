export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/auth';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('site_settings')
    .select('value')
    .eq('key', 'general')
    .single();

  if (error) return NextResponse.json({});
  return NextResponse.json(data?.value ?? {});
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = supabaseAdmin();
  const body = await request.json();

  const { error } = await db
    .from('site_settings')
    .upsert({ key: 'general', value: body });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}