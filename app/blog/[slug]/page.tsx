import { supabaseAdmin } from '@/lib/supabase';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

async function getPost(slug: string) {
  const db = supabaseAdmin();
  const { data } = await db.from('posts').select('*').eq('slug', slug).eq('status', 'published').single();
  return data;
}

export async function generateStaticParams() {
  const db = supabaseAdmin();
  const { data } = await db.from('posts').select('slug').eq('status', 'published');
  return (data || []).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.image_url ? [post.image_url] : [],
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
    },
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.image_url,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-10 lg:py-14">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-sage-600 transition-colors mb-8">
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <p className="text-xs text-stone-400 mb-2">{format(new Date(post.created_at), 'MMMM d, yyyy')} · {post.author}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-800 leading-tight mb-6">{post.title}</h1>

        {post.image_url && (
          <div className="aspect-[16/9] rounded-2xl bg-stone-100 overflow-hidden mb-8">
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-stone" dangerouslySetInnerHTML={{ __html: post.content }} />
      </main>
      <Footer />
    </>
  );
}
