import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import ProductCard from '@/components/store/ProductCard';
import { ArrowRight, Package, Sparkles, Download, Shield, Zap, Newspaper, CheckCircle2, Infinity, Pencil } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 60;

export default async function HomePage() {
  const db = supabaseAdmin();

  const [{ data: settingsRows }, { data: featured }, { data: categories }, { data: posts }, { data: allProducts }] = await Promise.all([
    db.from('settings').select('*'),
    db.from('products').select('*, categories(name,slug)').eq('status', 'published').eq('featured', true).limit(6),
    db.from('categories').select('*').order('sort_order').limit(4),
    db.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    db.from('products').select('id').eq('status', 'published'),
  ]);

  const settings: Record<string, any> = {};
  settingsRows?.forEach(row => { settings[row.key] = row.value; });

  const sections: string[] = settings.homepage_sections || ['hero', 'featured_products', 'categories', 'latest_posts'];
  const heroImage    = settings.homepage_hero_image;
  const heroBtn      = settings.homepage_hero_button_text || 'Explore Products';
  const heroBtnLink  = settings.homepage_hero_button_link || '/products';
  const productCount = allProducts?.length || 0;

  const benefits = [
    {
      icon: Download,
      title: 'Instant Download',
      desc: 'Get your files immediately after purchase. No waiting, no shipping — ready to use in seconds.',
    },
    {
      icon: Sparkles,
      title: 'Premium Quality',
      desc: 'Every product is carefully designed with attention to detail, aesthetics, and real-world usability.',
    },
    {
      icon: Pencil,
      title: 'Fully Editable',
      desc: 'Customize everything in Canva, Excel, Notion, or PDF editors to match your exact needs.',
    },
    {
      icon: Infinity,
      title: 'Lifetime Access',
      desc: 'Buy once, use forever. Your downloads are always available — no subscriptions, no expiry.',
    },
  ];

  return (
    <>
      <Header />
      <main className="overflow-x-hidden">

        {/* ── HERO ────────────────────────────────── */}
        {sections.includes('hero') && (
          <section className="relative bg-hero-gradient noise min-h-[88vh] flex items-center">
            <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-sage-100/40 blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-parchment blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-20 lg:py-28 w-full">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* Left — text */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-sage-50 border border-sage-100 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                    <span className="text-xs font-semibold text-sage-700 tracking-wider uppercase">
                      {settings.site_tagline || 'Premium Digital Products'}
                    </span>
                  </div>

                  <h1
                    className="font-display font-bold text-stone-900 leading-[1.05] animate-fade-in-up"
                    style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', animationDelay: '0.07s' }}
                  >
                    <span className="block">Tools & Templates</span>
                    <span className="gradient-text block">Built for Creators</span>
                  </h1>

                  <p className="text-lg text-stone-500 mt-5 max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.14s' }}>
                    Download ready-to-use planners, AI tools, and digital templates — designed to save you time and help your work look its best.
                  </p>

                  {/* Trust micro-list */}
                  <ul className="flex flex-col gap-2 mt-6 animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
                    {['Instant digital delivery', 'Editable in Canva, Excel & more', 'One-time purchase, lifetime access'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                        <CheckCircle2 size={15} className="text-sage-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <Link href={heroBtnLink}
                      className="group inline-flex items-center gap-2 bg-sage-gradient text-white font-semibold px-8 py-4 rounded-full shadow-glow hover:shadow-hover transition-all hover:-translate-y-0.5"
                    >
                      {heroBtn}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/blog"
                      className="inline-flex items-center gap-2 text-stone-600 hover:text-sage-600 font-medium text-sm transition-colors"
                    >
                      Read the Blog <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Stat row */}
                  {productCount > 0 && (
                    <div className="flex items-center gap-6 mt-10 pt-8 border-t border-stone-100 animate-fade-in-up" style={{ animationDelay: '0.28s' }}>
                      <div>
                        <p className="font-display text-2xl font-bold text-stone-800">{productCount}+</p>
                        <p className="text-xs text-stone-400 mt-0.5">Digital Products</p>
                      </div>
                      <div className="w-px h-8 bg-stone-200" />
                      <div>
                        <p className="font-display text-2xl font-bold text-stone-800">100%</p>
                        <p className="text-xs text-stone-400 mt-0.5">Instant Delivery</p>
                      </div>
                      <div className="w-px h-8 bg-stone-200" />
                      <div>
                        <p className="font-display text-2xl font-bold text-stone-800">★ 5.0</p>
                        <p className="text-xs text-stone-400 mt-0.5">Customer Rating</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right — image or decorative grid */}
                <div className="relative animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
                  {heroImage ? (
                    <div className="rounded-4xl overflow-hidden shadow-card animate-float">
                      <img src={heroImage} alt="Hero" className="w-full h-auto object-cover" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { bg: 'bg-sage-100',   label: 'Canva Templates',    icon: '🎨', delay: '0s' },
                        { bg: 'bg-parchment',  label: 'Budget Planners',    icon: '📊', delay: '0.1s' },
                        { bg: 'bg-stone-100',  label: 'PDF Guides',         icon: '📄', delay: '0.2s' },
                        { bg: 'bg-sage-50',    label: 'AI Tools',           icon: '⚡', delay: '0.3s' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`${item.bg} rounded-3xl p-6 flex flex-col gap-3 animate-fade-in-up`}
                          style={{ animationDelay: item.delay }}
                        >
                          <span className="text-3xl">{item.icon}</span>
                          <span className="text-sm font-semibold text-stone-700 leading-tight">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 shadow-card hidden lg:flex items-center gap-3 animate-float" style={{ animationDelay: '0.5s' }}>
                    <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center text-xl">✨</div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">New this week</p>
                      <p className="text-[11px] text-stone-400">Fresh designs added</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── TRUST STRIP ───────────────────────── */}
        <section className="py-6 border-y border-stone-100 bg-white">
          <div className="max-w-5xl mx-auto px-5 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Download, label: 'Instant Download' },
                { icon: Shield,   label: 'Secure Payment' },
                { icon: Zap,      label: 'Ready to Use' },
                { icon: Sparkles, label: 'Premium Quality' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-center gap-2.5 py-2">
                  <Icon size={17} className="text-sage-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-stone-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCTS ─────────────────── */}
        {sections.includes('featured_products') && featured && featured.length > 0 && (
          <section className="py-20 lg:py-28">
            <div className="max-w-6xl mx-auto px-5 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-sage-600 uppercase mb-3">
                    <Sparkles size={12} className="text-sage-500" /> Featured Collection
                  </span>
                  <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-900">
                    Best Sellers
                  </h2>
                  <p className="text-stone-500 mt-2 text-sm">Hand-picked products our customers love most.</p>
                </div>
                <Link href="/products"
                  className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sage-600 hover:text-sage-700 transition-colors"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
                {featured.map((product: any) => (
                  <div key={product.id} className="animate-fade-in-up">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="text-center mt-10 sm:hidden">
                <Link href="/products"
                  className="inline-flex items-center gap-2 border border-stone-200 text-stone-700 font-medium px-6 py-3 rounded-full hover:bg-stone-50 transition-all"
                >
                  View all products <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── WHY NOVAMINT — 4 BENEFITS ─────────── */}
        <section className="py-20 lg:py-24 bg-parchment">
          <div className="max-w-6xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">Why NovaMint</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-900 mt-2">
                Everything You Need, Nothing You Don't
              </h2>
              <p className="text-stone-500 mt-3 max-w-md mx-auto text-sm leading-relaxed">
                Every product is built with one goal: save your time and make your work look effortlessly good.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-3xl p-7 shadow-soft hover:shadow-card transition-all hover:-translate-y-1 group">
                  <div className="w-12 h-12 bg-sage-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-sage-100 transition-colors">
                    <Icon size={22} className="text-sage-600" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold text-stone-800 text-base mb-2">{title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────── */}
        {sections.includes('categories') && categories && categories.length > 0 && (
          <section className="py-20 lg:py-28">
            <div className="max-w-6xl mx-auto px-5 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">Browse</span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-900 mt-2">
                  Shop by Category
                </h2>
                <p className="text-stone-500 mt-3 max-w-md mx-auto text-sm">
                  Everything you need to grow, organize, and create — in one place.
                </p>
              </div>

              <div className={`grid gap-5 ${categories.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                {categories.map((cat: any, i: number) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="group relative overflow-hidden rounded-3xl bg-stone-200 animate-fade-in-up"
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      aspectRatio: i === 0 && categories.length === 4 ? '1 / 1.1' : '4 / 3',
                    }}
                  >
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                        <Package size={40} className="text-sage-400" strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-dark-gradient" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-display font-bold text-xl leading-tight">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-white/70 text-xs mt-1 line-clamp-1">{cat.description}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-white/80 text-xs font-medium mt-2 group-hover:text-white transition-colors">
                        Shop now <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── ABOUT NOVAMINT ────────────────────── */}
        <section className="py-20 bg-sage-gradient">
          <div className="max-w-5xl mx-auto px-5 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold tracking-widest text-sage-200 uppercase">About NovaMint</span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mt-3 mb-5 leading-tight">
                  Created by a Creator,<br />for Creators
                </h2>
                <p className="text-sage-100 leading-relaxed text-sm mb-4">
                  NovaMint Creative was born from a simple frustration: spending hours creating documents, reports, and templates that should take minutes. So I built the tools I wished existed.
                </p>
                <p className="text-sage-100 leading-relaxed text-sm mb-8">
                  Every product here — from AI-powered report generators to beautifully designed planners — is crafted to solve a real problem and respect your time.
                </p>
                <Link
                  href="/pages/about"
                  className="inline-flex items-center gap-2 bg-white text-sage-700 font-semibold px-7 py-3.5 rounded-full hover:bg-sage-50 transition-all text-sm"
                >
                  Learn more about us <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: '⚡', title: 'Built for Speed',    desc: 'From download to done in minutes.' },
                  { emoji: '🎨', title: 'Designed with Care', desc: 'Every pixel placed with purpose.' },
                  { emoji: '💡', title: 'Practical First',    desc: 'Real tools for real workflows.' },
                  { emoji: '🌍', title: 'Made for Everyone',  desc: 'English, French & Arabic supported.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-colors">
                    <span className="text-2xl">{item.emoji}</span>
                    <h3 className="text-white font-semibold text-sm mt-3 mb-1">{item.title}</h3>
                    <p className="text-sage-200 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LATEST BLOG ───────────────────────── */}
        {sections.includes('latest_posts') && posts && posts.length > 0 && (
          <section className="py-20 lg:py-28 bg-parchment">
            <div className="max-w-6xl mx-auto px-5 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">From the Blog</span>
                  <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-900 mt-2">
                    Tips & Inspiration
                  </h2>
                </div>
                <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-sage-600 hover:text-sage-700 transition-colors">
                  All articles <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-7">
                {posts.map((post: any, i: number) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-all hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="aspect-[16/10] bg-parchment overflow-hidden">
                      {post.image_url ? (
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <Newspaper size={28} strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-semibold text-sage-600 uppercase tracking-wider mb-2">
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </p>
                      <h3 className="font-display font-semibold text-stone-800 group-hover:text-sage-700 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-stone-500 text-sm mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sage-600 text-xs font-semibold mt-4 group-hover:gap-2 transition-all">
                        Read more <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── NEWSLETTER ────────────────────────── */}
        {sections.includes('newsletter') && (
          <section className="py-20 bg-white">
            <div className="max-w-xl mx-auto px-5 text-center">
              <span className="text-2xl mb-4 block">💌</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                Join the Creative Circle
              </h2>
              <p className="text-stone-500 mb-7 text-sm leading-relaxed">
                Get new products, exclusive discounts, and creative tips — straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-4 rounded-full border border-stone-200 bg-stone-50 focus:border-sage-400 focus:outline-none text-sm shadow-soft"
                />
                <button
                  className="bg-sage-gradient text-white font-semibold px-7 py-4 rounded-full shadow-glow hover:shadow-hover transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </div>
              <p className="text-xs text-stone-400 mt-3">No spam. Unsubscribe anytime.</p>
            </div>
          </section>
        )}

        {/* ── CTA BAND ──────────────────────────── */}
        <section className="py-20 bg-hero-gradient">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <span className="text-xs font-bold tracking-widest text-sage-600 uppercase">Ready to start?</span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-stone-900 mt-3 mb-4">
              Find your next favourite tool
            </h2>
            <p className="text-stone-500 mb-8 max-w-md mx-auto text-sm">
              Browse our full collection — planners, AI tools, templates, and more. Built for people who value their time.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-sage-gradient text-white font-semibold px-9 py-4 rounded-full shadow-glow hover:shadow-hover transition-all hover:-translate-y-0.5 text-base"
              >
                Browse All Products <ArrowRight size={16} />
              </Link>
              <Link href="/pages/about"
                className="inline-flex items-center gap-2 border border-stone-200 text-stone-700 font-medium px-7 py-4 rounded-full hover:bg-white transition-all text-sm"
              >
                About NovaMint
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}