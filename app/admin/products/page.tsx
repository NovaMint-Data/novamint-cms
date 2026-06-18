'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, Edit, Trash2, Eye, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleToggleStatus = async (product: any) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, status: newStatus }),
    });
    fetchProducts();
  };

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Products</h1>
          <p className="text-stone-500 text-sm mt-0.5">{products.length} products total</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-sage-400 focus:outline-none text-stone-700 placeholder:text-stone-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Package size={40} className="text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No products found</p>
            <Link href="/admin/products/new"
              className="text-sm text-sage-600 font-medium mt-2 inline-block hover:text-sage-700"
            >
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-stone-400 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-stone-400 uppercase tracking-wider hidden md:table-cell">Price</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-stone-400 uppercase tracking-wider hidden lg:table-cell">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-medium text-stone-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-medium text-stone-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <Package size={14} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-stone-800 truncate flex items-center gap-1.5">
                            {product.title}
                            {product.featured && <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                          </p>
                          <p className="text-xs text-stone-400 truncate">/products/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-stone-700">{formatPrice(product.price)}</span>
                      {product.compare_price && (
                        <span className="text-xs text-stone-400 line-through ml-1.5">{formatPrice(product.compare_price)}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-stone-500">
                        {product.categories?.name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                          product.status === 'published'
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/products/${product.slug}`} target="_blank"
                          className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all"
                          title="View"
                        >
                          <Eye size={15} />
                        </a>
                        <Link href={`/admin/products/${product.id}`}
                          className="p-1.5 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
