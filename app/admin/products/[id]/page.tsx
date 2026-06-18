import { supabaseAdmin } from '@/lib/supabase';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data: product } = await db.from('products').select('*').eq('id', params.id).single();
  
  if (!product) notFound();
  
  return <ProductForm product={product} />;
}
