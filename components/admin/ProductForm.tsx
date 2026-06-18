'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Globe, Tag, DollarSign, Link as LinkIcon, Star, Eye } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { createSlug } from '@/lib/utils';

interface ProductFormProps {
  product?: any;
  isNew?: boolean;
}

export default function ProductForm({ product, isNew }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'pricing'>('general');

  const [form, setForm] = useState({
    title: product?.title || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    compare_price: product?.compare_price || '',
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
    status: product?.status || 'draft',
    featured: product?.featured || false,
    payhip_link: product?.payhip_link || '',
    meta_title: product?.meta_title || '',
    meta_description: product?.meta_description || '',
    keywords: (product?.keywords || []).join(', '),
  });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleTitleChange = (title: string) => {
    setForm(f => ({
      ...f,
      title,
      slug: isNew ? createSlug(title) : f.slug,
      meta_title: isNew ? title : f.meta_title,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      id: product?.id,
      keywords: form.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
    };

    const res = await fetch('/api/products', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/admin/products');
    } else {
      const err = await res.json();
      alert(err.error || 'Save failed');
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Package2 },
    { id: 'pricing', label: 'Pricing & Links', icon: DollarSign },
    { id: 'seo', label: 'SEO', icon: Globe },
  ];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()}
          className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-stone-800">
            {isNew ? 'New Product' : 'Edit Product'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <a href={`/products/${form.slug}`} target="_blank"
              className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50 transition-all"
            >
              <Eye size={15} /> Preview
            </a>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title + Slug */}
        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Product Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              required
              placeholder="e.g. Premium Budget Planner 2026"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100 text-stone-800 placeholder:text-stone-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 bg-stone-50 px-3 py-2.5 rounded-l-xl border border-r-0 border-stone-200">
                /products/
              </span>
              <input
                type="text"
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-r-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex border-b border-stone-100">
            {(['general', 'pricing', 'seo'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3.5 text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50/50'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                {tab === 'pricing' ? 'Pricing & Links' : tab}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {/* General Tab */}
            {activeTab === 'general' && (
              <>
                <div className="grid lg:grid-cols-2 gap-6">
                  <ImageUpload
                    value={form.image_url}
                    onChange={v => set('image_url', v)}
                    folder="products"
                    label="Product Image"
                  />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
                      <select
                        value={form.category_id}
                        onChange={e => set('category_id', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm bg-white"
                      >
                        <option value="">No category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
                      <select
                        value={form.status}
                        onChange={e => set('status', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm bg-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-stone-50 transition-all">
                      <div className={`w-10 h-5 rounded-full transition-colors ${form.featured ? 'bg-sage-500' : 'bg-stone-200'} relative`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${form.featured ? 'left-5' : 'left-0.5'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-700">Featured product</p>
                        <p className="text-xs text-stone-400">Show on homepage</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={e => set('featured', e.target.checked)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    rows={8}
                    placeholder="Describe your product in detail — what's included, who it's for, why it's valuable…"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none leading-relaxed"
                  />
                </div>
              </>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Price (USD) *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={e => set('price', e.target.value)}
                        required
                        placeholder="9.99"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Compare-at Price</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.compare_price}
                        onChange={e => set('compare_price', e.target.value)}
                        placeholder="14.99"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                      />
                    </div>
                    <p className="text-xs text-stone-400 mt-1">Shown as strikethrough original price</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Payhip Purchase Link</label>
                  <div className="relative">
                    <LinkIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="url"
                      value={form.payhip_link}
                      onChange={e => set('payhip_link', e.target.value)}
                      placeholder="https://payhip.com/b/xxxxx"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-1">Customers will be redirected here to purchase</p>
                </div>
              </>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <>
                <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-500 space-y-0.5">
                  <p className="font-medium text-stone-600">SEO Preview</p>
                  <p className="text-blue-600 text-sm">{form.meta_title || form.title || 'Product Title'}</p>
                  <p className="text-green-700">yourdomain.com/products/{form.slug || 'product-slug'}</p>
                  <p className="text-stone-400 line-clamp-2">{form.meta_description || 'Add a meta description below…'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Meta Title</label>
                  <input
                    type="text"
                    value={form.meta_title}
                    onChange={e => set('meta_title', e.target.value)}
                    placeholder={form.title}
                    maxLength={70}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                  />
                  <p className="text-xs text-stone-400 mt-1">{form.meta_title.length}/70 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Meta Description</label>
                  <textarea
                    value={form.meta_description}
                    onChange={e => set('meta_description', e.target.value)}
                    rows={3}
                    placeholder="A brief description for search engines…"
                    maxLength={160}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none"
                  />
                  <p className="text-xs text-stone-400 mt-1">{form.meta_description.length}/160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    <Tag size={14} className="inline mr-1" />
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={form.keywords}
                    onChange={e => set('keywords', e.target.value)}
                    placeholder="budget planner, digital download, spreadsheet template"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                  />
                  <p className="text-xs text-stone-400 mt-1">Separate with commas</p>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// Dummy icon (replaced by lucide)
function Package2({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
}
