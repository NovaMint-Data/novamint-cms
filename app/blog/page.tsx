import { supabaseAdmin } from '@/lib/supabase';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import Link from 'next/link';
import { Newspaper } from 'lucide-react';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const db = supabaseAdmin();
  const { data } = await db.from('settings').select('value').eq('key', 'site_name').single();
  const siteName = data?.value || 'NovaMint Creative';
  return {
    title: `Blog | ${siteName}`,
    description: 'Tips, guides, and inspiration from our team.',
  };
}

export default async function BlogPage() {
  const db = supabaseAdmin();
  const { data: posts } = await db.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold tracking-widest text-sage-600 uppercase">Our Blog</span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-800 mt-2">Tips, Guides & Inspiration</h1>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-24">
            <Newspaper size={40} className="text-stone-200 mx-auto mb-3" />
            <p className="text-stone-400">No posts yet — check back soon</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="aspect-[4/3] rounded-2xl bg-stone-100 overflow-hidden mb-4">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Newspaper size={28} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-stone-400 mb-1.5">{format(new Date(post.created_at), 'MMM d, yyyy')} · {post.author}</p>
                <h2 className="font-semibold text-stone-800 group-hover:text-sage-700 transition-colors leading-snug text-lg">{post.title}</h2>
                {post.excerpt && <p className="text-sm text-stone-500 mt-2 line-clamp-2">{post.excerpt}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
