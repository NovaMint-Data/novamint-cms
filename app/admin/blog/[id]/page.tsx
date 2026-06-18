import { supabaseAdmin } from '@/lib/supabase';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const db = supabaseAdmin();
  const { data: post } = await db.from('posts').select('*').eq('id', params.id).single();
  if (!post) notFound();
  return <PostForm post={post} />;
}
