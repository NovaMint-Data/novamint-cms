'use client';

import { useEffect, useState } from 'react';
import { Save, Layout } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function HomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    homepage_hero_title: '',
    homepage_hero_subtitle: '',
    homepage_hero_image: '',
    homepage_hero_button_text: '',
    homepage_hero_button_link: '',
    homepage_sections: ['hero', 'featured_products', 'categories', 'latest_posts'],
  });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings((s: any) => ({ ...s, ...data }));
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: any) => setSettings((s: any) => ({ ...s, [key]: value }));

  const toggleSection = (id: string) => {
    const current: string[] = settings.homepage_sections || [];
    if (current.includes(id)) {
      set('homepage_sections', current.filter(s => s !== id));
    } else {
      set('homepage_sections', [...current, id]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        homepage_hero_title: settings.homepage_hero_title,
        homepage_hero_subtitle: settings.homepage_hero_subtitle,
        homepage_hero_image: settings.homepage_hero_image,
        homepage_hero_button_text: settings.homepage_hero_button_text,
        homepage_hero_button_link: settings.homepage_hero_button_link,
        homepage_sections: settings.homepage_sections,
      }),
    });
    setSaving(false);
  };

  const availableSections = [
    { id: 'hero', label: 'Hero Banner', desc: 'Large header with title and call-to-action' },
    { id: 'featured_products', label: 'Featured Products', desc: 'Grid of products marked as "Featured"' },
    { id: 'categories', label: 'Category Showcase', desc: 'Visual grid of product categories' },
    { id: 'latest_posts', label: 'Latest Blog Posts', desc: 'Recent articles from your blog' },
    { id: 'newsletter', label: 'Newsletter Signup', desc: 'Email capture section' },
  ];

  if (loading) return <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Homepage</h1>
          <p className="text-stone-500 text-sm mt-0.5">Manage your homepage hero and section order</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
          <Save size={15} />{saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
              <textarea value={settings.homepage_hero_title} onChange={e => set('homepage_hero_title', e.target.value)} rows={2}
                placeholder="Beautifully Crafted&#10;Digital Products"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none font-display" />
              <p className="text-xs text-stone-400 mt-1">Use a line break for a two-line headline</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Subtitle</label>
              <textarea value={settings.homepage_hero_subtitle} onChange={e => set('homepage_hero_subtitle', e.target.value)} rows={2}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Button Text</label>
                <input type="text" value={settings.homepage_hero_button_text} onChange={e => set('homepage_hero_button_text', e.target.value)} placeholder="Shop Now"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Button Link</label>
                <input type="text" value={settings.homepage_hero_button_link} onChange={e => set('homepage_hero_button_link', e.target.value)} placeholder="/products"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
            </div>
            <ImageUpload value={settings.homepage_hero_image || ''} onChange={v => set('homepage_hero_image', v)} folder="homepage" label="Hero Image (optional)" />
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-stone-800 mb-1">Homepage Sections</h2>
          <p className="text-xs text-stone-400 mb-4">Toggle which sections appear on your homepage</p>
          <div className="space-y-2">
            {availableSections.map((section) => {
              const active = (settings.homepage_sections || []).includes(section.id);
              return (
                <label key={section.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-all">
                  <div className={`w-10 h-5 rounded-full transition-colors ${active ? 'bg-sage-500' : 'bg-stone-200'} relative flex-shrink-0`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${active ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400 flex-shrink-0">
                    <Layout size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-700">{section.label}</p>
                    <p className="text-xs text-stone-400">{section.desc}</p>
                  </div>
                  <input type="checkbox" checked={active} onChange={() => toggleSection(section.id)} className="sr-only" />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
