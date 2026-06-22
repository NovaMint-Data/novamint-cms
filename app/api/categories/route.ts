export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/auth';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = supabaseAdmin();
  const body = await request.json();
  const { id, ...payload } = body;
  const { data, error } = await db
    .from('categories')
    .insert(payload)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = supabaseAdmin();
  const body = await request.json();
  const { id, ...payload } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { data, error } = await db
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const db = supabaseAdmin();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await db.from('categories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}