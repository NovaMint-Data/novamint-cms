import { supabaseAdmin } from '@/lib/supabase';
import PageForm from '@/components/admin/PageForm';
import { notFound } from 'next/navigation';

export default async function EditPageRoute({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data: page } = await db.from('pages').select('*').eq('id', params.id).single();
  if (!page) notFound();
  return <PageForm page={page} />;
}
