'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Globe, Layout } from 'lucide-react';
import { createSlug } from '@/lib/utils';
import PageBuilder, { Section } from '@/components/admin/PageBuilder';

export default function PageForm({ page, isNew }: { page?: any; isNew?: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'seo'>('builder');

  const [form, setForm] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    status: page?.status || 'draft',
    meta_title: page?.meta_title || '',
    meta_description: page?.meta_description || '',
  });

  const [sections, setSections] = useState<Section[]>(
    page?.content?.length ? page.content : [
      { id: `section-${Date.now()}`, type: 'hero', data: { title: 'New Page', subtitle: 'Add a subtitle here', buttonText: '', buttonLink: '', image_url: '' } }
    ]
  );

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleTitleChange = (title: string) => {
    setForm(f => ({ ...f, title, slug: isNew ? createSlug(title) : f.slug, meta_title: isNew ? title : f.meta_title }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, content: sections, id: page?.id };
    const res = await fetch('/api/pages', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push('/admin/pages');
    } else {
      const err = await res.json();
      alert(err.error || 'Save failed');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-2xl font-semibold text-stone-800 flex-1">
          {isNew ? 'New Page' : 'Edit Page'}
        </h1>
        <div className="flex items-center gap-2">
          {!isNew && (
            <a href={`/pages/${form.slug}`} target="_blank" className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50 transition-all">
              <Eye size={15} /> Preview
            </a>
          )}
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
            <Save size={15} />{saving ? 'Saving…' : 'Save Page'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Page Title *</label>
              <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} required placeholder="e.g. About Us"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100 text-stone-800 placeholder:text-stone-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm bg-white">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">URL Slug</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 bg-stone-50 px-3 py-2.5 rounded-l-xl border border-r-0 border-stone-200">/pages/</span>
              <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className="flex-1 px-4 py-2.5 rounded-r-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex border-b border-stone-100">
            <button type="button" onClick={() => setActiveTab('builder')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all ${activeTab === 'builder' ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50/50' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}>
              <Layout size={15} />Page Builder
            </button>
            <button type="button" onClick={() => setActiveTab('seo')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-all ${activeTab === 'seo' ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50/50' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}>
              <Globe size={15} />SEO
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'builder' ? (
              <PageBuilder sections={sections} onChange={setSections} />
            ) : (
              <div className="space-y-5">
                <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-500 space-y-0.5">
                  <p className="font-medium text-stone-600">SEO Preview</p>
                  <p className="text-blue-600 text-sm">{form.meta_title || form.title || 'Page Title'}</p>
                  <p className="text-green-700">yourdomain.com/pages/{form.slug || 'page-slug'}</p>
                  <p className="text-stone-400 line-clamp-2">{form.meta_description || 'Add a meta description below…'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Meta Title</label>
                  <input type="text" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder={form.title} maxLength={70}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Meta Description</label>
                  <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={3} maxLength={160}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none" />
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
