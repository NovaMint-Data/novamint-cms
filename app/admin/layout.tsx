'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, FileText, FolderOpen,
  Newspaper, Settings, Menu, X, LogOut, ExternalLink,
  Navigation, Home, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-100 z-30
        transform transition-transform duration-300 lg:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-stone-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sage-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="font-display text-sm font-semibold text-stone-800">NovaMint CMS</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-stone-600 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${active
                      ? 'bg-sage-50 text-sage-700 font-semibold'
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                    }
                  `}
                >
                  <Icon size={17} className={active ? 'text-sage-600' : 'text-stone-400'} />
                  {item.label}
                  {active && <ChevronRight size={14} className="ml-auto text-sage-400" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-stone-100 space-y-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-all"
          >
            <ExternalLink size={17} className="text-stone-400" />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={17} className="text-stone-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-stone-100 flex items-center px-4 lg:px-6 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-stone-500 hover:text-stone-700 mr-3"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">Admin</span>
            <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center">
              <span className="text-sage-700 text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
