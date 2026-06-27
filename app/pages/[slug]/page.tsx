import { supabaseAdmin } from '@/lib/supabase';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import SectionRenderer from '@/components/store/SectionRenderer';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

async function getPage(slug: string) {
  const db = supabaseAdmin();
  const { data } = await db.from('pages').select('*').eq('slug', slug).eq('status', 'published').single();
  return data;
}

export async function generateStaticParams() {
  const db = supabaseAdmin();
  const { data } = await db.from('pages').select('slug').eq('status', 'published');
  return (data || []).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);  // ✅ slug وليس params.slug
  if (!page) return {};
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || '',
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);  // ✅ slug وليس params.slug
  if (!page) notFound();

  return (
    <>
      <Header />
      <main>
        {(page.content || []).map((section: any) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
      <Footer />
    </>
  );
}