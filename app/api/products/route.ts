import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminRequest } from '@/lib/auth';
import { createSlug, generateSchemaMarkup } from '@/lib/utils';

// GET - list all products or single product
export async function GET(request: NextRequest) {
  const db = supabaseAdmin();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');

  let query = db.from('products').select('*, categories(name, slug)').order('sort_order', { ascending: true }).order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category_id', category);
  if (featured === 'true') query = query.eq('featured', true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - create product
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const body = await request.json();
  
  const slug = body.slug || createSlug(body.title);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const schema = generateSchemaMarkup({ ...body, slug }, siteUrl);

  const { data, error } = await db.from('products').insert({
    title: body.title,
    slug,
    description: body.description || '',
    price: parseFloat(body.price) || 0,
    compare_price: body.compare_price ? parseFloat(body.compare_price) : null,
    image_url: body.image_url || null,
    images: body.images || [],
    category_id: body.category_id || null,
    status: body.status || 'draft',
    featured: body.featured || false,
    payhip_link: body.payhip_link || null,
    meta_title: body.meta_title || body.title,
    meta_description: body.meta_description || '',
    keywords: body.keywords || [],
    schema_markup: schema,
    sort_order: body.sort_order || 0,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT - update product
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  if (updates.price !== undefined)
    updates.price = updates.price === '' ? 0 : parseFloat(updates.price) || 0;
  if (updates.compare_price !== undefined)
    updates.compare_price = (updates.compare_price === '' || updates.compare_price === null)
      ? null : parseFloat(updates.compare_price) || null;
  if (updates.sort_order !== undefined)
    updates.sort_order = updates.sort_order === '' ? 0 : parseInt(updates.sort_order) || 0;

  if (updates.title) {
    updates.slug = updates.slug || createSlug(updates.title);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    updates.schema_markup = generateSchemaMarkup({ ...updates, slug: updates.slug }, siteUrl);
  }

  const { data, error } = await db.from('products').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - delete product
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { error } = await db.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
