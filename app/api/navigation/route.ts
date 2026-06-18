import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/auth';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from('navigation').select('*').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const db = supabaseAdmin();
  const items = await request.json();

  // Replace all navigation items
  await db.from('navigation').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (items.length > 0) {
    const { error } = await db.from('navigation').insert(
      items.map((item: any, i: number) => ({
        id: item.id || undefined,
        label: item.label,
        href: item.href,
        sort_order: i,
        open_in_new_tab: item.open_in_new_tab || false,
      }))
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
