import { supabaseAdmin } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const db = supabaseAdmin();
  const { data: product } = await db.from('products').select('*').eq('id', id).single();
  
  if (!product) notFound();
  
  return <ProductForm product={product} />;
}