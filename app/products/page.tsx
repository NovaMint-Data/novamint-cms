import { supabaseAdmin } from '@/lib/supabase';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';
import Link from 'next/link';
import { Package, SlidersHorizontal } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const db = supabaseAdmin();
  const { data } = await db.from('settings').select('value').eq('key', 'site_name').single();
  return {
    title: `Shop | ${data?.value || 'NovaMint Creative'}`,
    description: 'Browse our full collection of premium digital products — templates, planners, tools and more.',
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const db = supabaseAdmin();

  const { data: categories } = await db.from('categories').select('*').order('sort_order');

  let query = db
    .from('products')
    .select('*, categories(name, slug)')
    .eq('status', 'published')
    .order('sort_order')
    .order('created_at', { ascending: false });

  if (searchParams.category) {
    const cat = categories?.find(c => c.slug === searchParams.category);
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data: products } = await query;
  const activeCategory = categories?.find(c => c.slug === searchParams.category);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        {/* ── Page header ── */}
        <div className="bg-hero-gradient border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14 lg:py-18">
            <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">
              {activeCategory ? activeCategory.name : 'All Products'}
            </span>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-stone-900 mt-2">
              {activeCategory ? activeCategory.name : 'Shop Our Collection'}
            </h1>
            {activeCategory?.description && (
              <p className="text-stone-500 mt-2 max-w-xl">{activeCategory.description}</p>
            )}
            <p className="text-stone-400 text-sm mt-3">
              {products?.length || 0} {products?.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10">
          {/* ── Category pills ── */}
          {categories && categories.length > 0 && (
            <div className="flex items-center gap-2 mb-10 flex-wrap">
              <SlidersHorizontal size={15} className="text-stone-400 mr-1 flex-shrink-0" />
              <Link
                href="/products"
                className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                  !searchParams.category
                    ? 'bg-sage-500 text-white shadow-glow'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-sage-300 hover:text-sage-600'
                }`}
              >
                All
              </Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
                    searchParams.category === cat.slug
                      ? 'bg-sage-500 text-white shadow-glow'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-sage-300 hover:text-sage-600'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* ── Grid ── */}
          {!products || products.length === 0 ? (
            <div className="text-center py-32">
              <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-stone-300" strokeWidth={1} />
              </div>
              <p className="text-stone-500 font-medium">No products found</p>
              {searchParams.category && (
                <Link href="/products" className="text-sm text-sage-600 font-semibold mt-2 inline-block hover:underline">
                  View all products →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {products.map((product: any) => (
                <div key={product.id} className="animate-fade-in-up">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
