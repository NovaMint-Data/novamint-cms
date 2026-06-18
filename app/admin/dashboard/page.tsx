'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Newspaper, FileText, FolderOpen, TrendingUp, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ products: 0, posts: 0, pages: 0, categories: 0 });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/pages').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([products, posts, pages, categories]) => {
      setStats({
        products: products.length || 0,
        posts: posts.length || 0,
        pages: pages.length || 0,
        categories: categories.length || 0,
      });
      setRecentProducts((products || []).slice(0, 5));
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-sage-50 text-sage-600', href: '/admin/products' },
    { label: 'Blog Posts', value: stats.posts, icon: Newspaper, color: 'bg-blue-50 text-blue-600', href: '/admin/blog' },
    { label: 'Pages', value: stats.pages, icon: FileText, color: 'bg-purple-50 text-purple-600', href: '/admin/pages' },
    { label: 'Categories', value: stats.categories, icon: FolderOpen, color: 'bg-amber-50 text-amber-600', href: '/admin/categories' },
  ];

  const quickActions = [
    { label: 'Add Product', href: '/admin/products/new', icon: Package },
    { label: 'New Blog Post', href: '/admin/blog/new', icon: Newspaper },
    { label: 'Create Page', href: '/admin/pages/new', icon: FileText },
    { label: 'Site Settings', href: '/admin/settings', icon: TrendingUp },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-stone-800">Dashboard</h1>
        <p className="text-stone-500 mt-1">Welcome back — manage your digital store</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}
              className="bg-white rounded-2xl p-5 shadow-soft hover:shadow-card transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <div className="text-2xl font-semibold text-stone-800">
                {loading ? '—' : card.value}
              </div>
              <div className="text-sm text-stone-500 mt-0.5 flex items-center gap-1">
                {card.label}
                <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-all group"
                >
                  <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center text-sage-600 flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-stone-700">{action.label}</span>
                  <div className="ml-auto w-5 h-5 bg-stone-100 rounded-full flex items-center justify-center">
                    <Plus size={12} className="text-stone-500" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-stone-800">Recent Products</h2>
            <Link href="/admin/products" className="text-xs text-sage-600 hover:text-sage-700 font-medium">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />)}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package size={32} className="text-stone-200 mx-auto mb-2" />
              <p className="text-sm text-stone-400">No products yet</p>
              <Link href="/admin/products/new" className="text-sm text-sage-600 font-medium mt-2 inline-block">
                Add your first product →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((product) => (
                <Link key={product.id} href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <Package size={14} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">{product.title}</p>
                    <p className="text-xs text-stone-400">${product.price}</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    product.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {product.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
