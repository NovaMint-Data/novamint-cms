import { supabaseAdmin } from '@/lib/supabase';
import PageForm from '@/components/admin/PageForm';
import { notFound } from 'next/navigation';

export default async function EditPageRoute(props: any) {
  const { id } = await props.params;

  const db = supabaseAdmin();

  const { data: page } = await db
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (!page) {
    notFound();
  }

  return <PageForm page={page} />;
}