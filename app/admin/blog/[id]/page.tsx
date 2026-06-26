import { supabaseAdmin } from '@/lib/supabase';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';


export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. await لتفريغ قيمة المعاملات أولاً
  const { id } = await params; 
  
  const db = supabaseAdmin();
  
  // 2. استخدام المتغير id مباشرة في استعلام Supabase
  const { data: post } = await db.from('posts').select('*').eq('id', id).single();
  
  if (!post) notFound();
  
  return <PostForm post={post} />;
}