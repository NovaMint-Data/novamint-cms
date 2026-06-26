import { supabaseAdmin } from '@/lib/supabase';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: post } = await db.from('posts').select('*').eq('id', id).single();
  if (!post) notFound();
  return <PostForm post={post} />;
}