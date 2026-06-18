import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';

export default async function Footer() {
  const db = supabaseAdmin();
  const [{ data: settingsRows }, { data: navItems }, { data: categories }] = await Promise.all([
    db.from('settings').select('*').in('key', ['site_name', 'footer_text', 'social_links', 'site_tagline']),
    db.from('navigation').select('*').order('sort_order'),
    db.from('categories').select('name, slug').order('sort_order').limit(5),
  ]);

  const settings: Record<string, any> = {};
  settingsRows?.forEach(row => { settings[row.key] = row.value; });

  const siteName  = settings.site_name  || 'NovaMint Creative';
  const tagline   = settings.site_tagline || 'Premium Digital Products';
  const footerTxt = settings.footer_text  || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const social    = settings.social_links || {};

  const socials = [
    { key: 'twitter',   emoji: '𝕏',  url: social.twitter   },
    { key: 'instagram', emoji: '📸', url: social.instagram  },
    { key: 'linkedin',  emoji: 'in', url: social.linkedin   },
    { key: 'youtube',   emoji: '▶',  url: social.youtube    },
  ].filter(s => s.url);

  return (
    <footer className="bg-stone-900 text-stone-300 mt-0">
      {/* Top strip */}
      <div className="h-1 bg-sage-gradient" />

      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-sage-gradient rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold font-display">N</span>
              </div>
              <span className="font-display text-base font-bold text-white">{siteName}</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-5 max-w-xs">
              {tagline} — crafted with care for modern creators and entrepreneurs.
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-2">
                {socials.map(({ key, emoji, url }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-sage-600 flex items-center justify-center text-xs font-bold transition-all hover:-translate-y-0.5"
                  >
                    {emoji}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Navigate</h4>
            <ul className="space-y-3">
              {(navItems || []).map((item: any) => (
                <li key={item.id}>
                  <Link href={item.href} className="text-sm text-stone-400 hover:text-sage-400 transition-colors hover:translate-x-1 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div>
              <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Products</h4>
              <ul className="space-y-3">
                {categories.map((cat: any) => (
                  <li key={cat.slug}>
                    <Link href={`/products?category=${cat.slug}`} className="text-sm text-stone-400 hover:text-sage-400 transition-colors hover:translate-x-1 inline-block">
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products" className="text-sm text-sage-500 hover:text-sage-400 font-semibold transition-colors">
                    → View All
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Trust */}
          <div>
            <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Why Us</h4>
            <ul className="space-y-3">
              {[
                '⚡ Instant delivery',
                '🔒 Secure checkout',
                '♾️ Lifetime access',
                '✏️ Fully editable',
                '💬 Creator support',
              ].map(item => (
                <li key={item} className="text-sm text-stone-400">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">{footerTxt}</p>
          <p className="text-xs text-stone-600">Built with ❤️ for creators</p>
        </div>
      </div>
    </footer>
  );
}
