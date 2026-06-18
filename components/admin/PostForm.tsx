'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Globe } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { createSlug } from '@/lib/utils';

export default function PostForm({ post, isNew }: { post?: any; isNew?: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image_url: post?.image_url || '',
    status: post?.status || 'draft',
    author: post?.author || 'Admin',
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    keywords: (post?.keywords || []).join(', '),
  });

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
      id: post?.id,
      keywords: form.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
    };
    const res = await fetch('/api/posts', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      router.push('/admin/blog');
    } else {
      const err = await res.json();
      alert(err.error || 'Save failed');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-all">
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-display text-2xl font-semibold text-stone-800 flex-1">
          {isNew ? 'New Post' : 'Edit Post'}
        </h1>
        <div className="flex items-center gap-2">
          {!isNew && (
            <a href={`/blog/${form.slug}`} target="_blank" className="flex items-center gap-1.5 px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50 transition-all">
              <Eye size={15} /> Preview
            </a>
          )}
          <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
            <Save size={15} />{saving ? 'Saving…' : 'Save Post'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Post Title *</label>
            <input
              type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} required
              placeholder="e.g. 5 Tips for Productive Budgeting"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-100 text-stone-800 placeholder:text-stone-300 text-sm"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 bg-stone-50 px-3 py-2.5 rounded-l-xl border border-r-0 border-stone-200">/blog/</span>
                <input type="text" value={form.slug} onChange={e => set('slug', e.target.value)} className="flex-1 px-4 py-2.5 rounded-r-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Author</label>
              <input type="text" value={form.author} onChange={e => set('author', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm bg-white sm:w-48">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex border-b border-stone-100">
            {(['content', 'seo'] as const).map(tab => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3.5 text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50/50' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                {tab === 'seo' ? 'SEO' : tab}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {activeTab === 'content' && (
              <>
                <ImageUpload value={form.image_url} onChange={v => set('image_url', v)} folder="blog" label="Cover Image" />
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Excerpt</label>
                  <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
                    placeholder="A short summary shown in blog listing…"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Content</label>
                  <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={16}
                    placeholder="Write your post content here. You can use basic HTML tags like <h2>, <p>, <ul>, <li>, <strong>, <a> for formatting."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none font-mono leading-relaxed"
                  />
                  <p className="text-xs text-stone-400 mt-1.5">
                    Supports HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;/&lt;li&gt;, &lt;strong&gt;, &lt;a href=""&gt;, &lt;img src=""&gt;
                  </p>
                </div>
              </>
            )}

            {activeTab === 'seo' && (
              <>
                <div className="bg-stone-50 rounded-xl p-4 text-xs text-stone-500 space-y-0.5">
                  <p className="font-medium text-stone-600 flex items-center gap-1"><Globe size={12}/> SEO Preview</p>
                  <p className="text-blue-600 text-sm">{form.meta_title || form.title || 'Post Title'}</p>
                  <p className="text-green-700">yourdomain.com/blog/{form.slug || 'post-slug'}</p>
                  <p className="text-stone-400 line-clamp-2">{form.meta_description || form.excerpt || 'Add a meta description below…'}</p>
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
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Keywords</label>
                  <input type="text" value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="budgeting tips, finance, planner"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
