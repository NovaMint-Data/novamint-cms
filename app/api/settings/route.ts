import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/auth';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from('settings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const settings: Record<string, any> = {};
  data?.forEach(row => { settings[row.key] = row.value; });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = supabaseAdmin();
  const updates = await request.json();

  const upserts = Object.entries(updates).map(([key, value]) => ({
    key, value, updated_at: new Date().toISOString(),
  }));

  const { error } = await db.from('settings').upsert(upserts, { onConflict: 'key' });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
