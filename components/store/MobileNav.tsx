'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileNav({ navItems }: { navItems: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 text-stone-600 hover:text-sage-600 transition-colors"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-cream z-50 md:hidden">
          <div className="flex items-center justify-between h-16 px-5 border-b border-stone-100">
            <span className="font-display text-lg font-semibold text-stone-800">Menu</span>
            <button onClick={() => setOpen(false)} className="p-2 text-stone-500">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col px-5 py-6 gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-lg font-medium text-stone-700 py-3 border-b border-stone-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="mt-6 bg-sage-500 text-white text-center font-medium py-3 rounded-full"
            >
              Shop Now
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
