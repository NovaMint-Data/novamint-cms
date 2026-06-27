import { supabaseAdmin } from '@/lib/supabase';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Download, ShieldCheck, Sparkles, Clock, Check, Star } from 'lucide-react';

export const revalidate = 60;

async function getProduct(slug: string) {
  const db = supabaseAdmin();
  const { data } = await db
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data;
}

export async function generateStaticParams() {
  const db = supabaseAdmin();
  const { data } = await db.from('products').select('slug').eq('status', 'published');
  return (data || []).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return {
    title: product.meta_title || product.title,
    description: product.meta_description || product.description?.slice(0, 160),
    keywords: product.keywords,
    openGraph: {
      title: product.meta_title || product.title,
      description: product.meta_description || product.description?.slice(0, 160),
      images: product.image_url ? [product.image_url] : [],
      url: `${siteUrl}/products/${product.slug}`,
      type: 'website',
    },
    alternates: { canonical: `${siteUrl}/products/${product.slug}` },
  };
}

const FEATURES = [
  'Instant digital download after purchase',
  'Compatible with Canva, PDF, Excel & more',
  'Lifetime access — yours forever',
  'Fully editable and customizable',
  'Works on desktop and mobile',
];

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const db = supabaseAdmin();
  const { data: related } = await db
    .from('products')
    .select('*, categories(name,slug)')
    .eq('status', 'published')
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .limit(3);

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0;

  return (
    <>
      {product.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product.schema_markup ?? {}) }}
        />
      )}
      <Header />

      <main className="bg-cream min-h-screen">
        {/* ── Breadcrumb ── */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-8 pb-2">
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Link href="/" className="hover:text-sage-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-sage-600 transition-colors">Products</Link>
            {product.categories?.name && (
              <>
                <span>/</span>
                <Link href={`/products?category=${product.categories.slug}`} className="hover:text-sage-600 transition-colors">
                  {product.categories.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-stone-600 truncate max-w-[180px]">{product.title}</span>
          </div>
        </div>

        {/* ── Main product area ── */}
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* ── LEFT: Image ── */}
            <div className="lg:sticky lg:top-24">
              <div className="relative rounded-4xl overflow-hidden bg-parchment shadow-card group">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full object-cover aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-700"
                  />
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center text-stone-300">
                    <Download size={56} strokeWidth={1} />
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-sage-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow">
                    Save {discountPct}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images?.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[product.image_url, ...product.images].filter(Boolean).slice(0, 4).map((img: string, i: number) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-parchment border-2 border-transparent hover:border-sage-400 transition-colors cursor-pointer">
                      <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Info ── */}
            <div>
              {/* Category */}
              {product.categories?.name && (
                <Link
                  href={`/products?category=${product.categories.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-sage-600 uppercase hover:text-sage-700 transition-colors mb-4"
                >
                  <Sparkles size={11} /> {product.categories.name}
                </Link>
              )}

              {/* Title */}
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-stone-900 leading-tight">
                {product.title}
              </h1>

              {/* Stars placeholder */}
              <div className="flex items-center gap-1.5 mt-3">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-stone-400 ml-1">5.0 (Digital Product)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mt-6 pb-6 border-b border-stone-100">
                <span className="font-display text-4xl font-bold text-stone-900">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-stone-400 line-through mb-0.5">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-sm font-bold text-sage-600 bg-sage-50 px-3 py-1 rounded-full mb-0.5">
                    You save {formatPrice(product.compare_price - product.price)}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="py-6 border-b border-stone-100 space-y-3">
                {product.payhip_link ? (
                  <a
                    href={product.payhip_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-sage-gradient text-white font-bold py-4.5 px-8 rounded-2xl shadow-glow hover:shadow-hover transition-all hover:-translate-y-0.5 text-base"
                    style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}
                  >
                    <Download size={20} />
                    Get Instant Access — {formatPrice(product.price)}
                  </a>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 bg-stone-100 text-stone-400 font-medium py-4 rounded-2xl text-sm cursor-not-allowed">
                    Coming Soon
                  </div>
                )}
                <p className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={13} className="text-sage-500" />
                  Secure checkout · Instant digital delivery
                </p>
              </div>

              {/* What's included / features */}
              <div className="py-6 border-b border-stone-100">
                <h3 className="font-display font-semibold text-stone-800 mb-4">What's Included</h3>
                <ul className="space-y-2.5">
                  {FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-stone-600">
                      <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check size={11} className="text-sage-600" strokeWidth={2.5} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust badges row */}
              <div className="flex flex-wrap gap-4 py-6">
                {[
                  { icon: Clock,       label: 'Instant Download' },
                  { icon: ShieldCheck, label: 'Secure Payment'   },
                  { icon: Sparkles,    label: 'Premium Quality'  },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-2 rounded-full">
                    <Icon size={13} className="text-sage-500" /> {label}
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div className="pt-2">
                  <h3 className="font-display font-semibold text-stone-800 mb-3">About This Product</h3>
                  <div className="prose text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                    {product.description}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Related products ── */}
          {related && related.length > 0 && (
            <section className="mt-24 pt-16 border-t border-stone-100">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-stone-900">
                  You Might Also Like
                </h2>
                <Link href="/products" className="text-sm font-semibold text-sage-600 hover:text-sage-700 transition-colors hidden sm:flex items-center gap-1">
                  View all <ArrowLeft size={13} className="rotate-180" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}