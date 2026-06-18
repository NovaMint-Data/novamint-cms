import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import MobileNav from './MobileNav';
import { ShoppingBag } from 'lucide-react';

export default async function Header() {
  const db = supabaseAdmin();
  const [{ data: navItems }, { data: settingsRows }] = await Promise.all([
    db.from('navigation').select('*').order('sort_order'),
    db.from('settings').select('*').in('key', ['site_name', 'logo_url']),
  ]);

  const settings: Record<string, any> = {};
  settingsRows?.forEach(row => { settings[row.key] = row.value; });

  const siteName = settings.site_name || 'NovaMint Creative';
  const logoUrl  = settings.logo_url;

  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-lg border-b border-stone-100/80">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
            ) : (
              <div className="w-8 h-8 bg-sage-gradient rounded-xl flex items-center justify-center shadow-glow/50">
                <span className="text-white text-sm font-bold font-display">N</span>
              </div>
            )}
            <span className="font-display text-base font-bold text-stone-800 tracking-tight">
              {siteName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {(navItems || []).map((item: any) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.open_in_new_tab ? '_blank' : undefined}
                className="text-sm font-medium text-stone-600 hover:text-sage-600 transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-sage-500 rounded-full group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-sage-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-glow hover:shadow-hover transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag size={14} /> Shop
            </Link>
          </div>

          {/* Mobile */}
          <MobileNav navItems={navItems || []} />
        </div>
      </div>
    </header>
  );
}
