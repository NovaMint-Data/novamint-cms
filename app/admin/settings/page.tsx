'use client';

import { useEffect, useState } from 'react';
import { Save, Globe, Palette, Share2, Code } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'advanced'>('general');
  const [settings, setSettings] = useState<any>({
    site_name: '',
    site_tagline: '',
    site_description: '',
    logo_url: '',
    favicon_url: '',
    footer_text: '',
    social_links: { twitter: '', instagram: '', linkedin: '', youtube: '' },
    google_analytics_id: '',
    custom_head_code: '',
    robots_txt: '',
  });

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings((s: any) => ({ ...s, ...data, social_links: { ...s.social_links, ...(data.social_links || {}) } }));
      setLoading(false);
    });
  }, []);

  const set = (key: string, value: any) => setSettings((s: any) => ({ ...s, [key]: value }));
  const setSocial = (key: string, value: any) => setSettings((s: any) => ({ ...s, social_links: { ...s.social_links, [key]: value } }));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'advanced', label: 'Advanced', icon: Code },
  ];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Settings</h1>
          <p className="text-stone-500 text-sm mt-0.5">Global site configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
          <Save size={15} />{saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="flex border-b border-stone-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-sage-700 border-b-2 border-sage-500 bg-sage-50/50' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'}`}>
                <Icon size={15} />{tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-5">
          {activeTab === 'general' && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Site Name</label>
                <input type="text" value={settings.site_name} onChange={e => set('site_name', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Tagline</label>
                <input type="text" value={settings.site_tagline} onChange={e => set('site_tagline', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <ImageUpload value={settings.logo_url || ''} onChange={v => set('logo_url', v)} folder="branding" label="Logo" />
                <ImageUpload value={settings.favicon_url || ''} onChange={v => set('favicon_url', v)} folder="branding" label="Favicon" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Footer Text</label>
                <input type="text" value={settings.footer_text} onChange={e => set('footer_text', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
            </>
          )}

          {activeTab === 'seo' && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Default Meta Description</label>
                <textarea value={settings.site_description} onChange={e => set('site_description', e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none" />
                <p className="text-xs text-stone-400 mt-1">Used for pages that don't have their own meta description</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Robots.txt Override</label>
                <textarea value={settings.robots_txt} onChange={e => set('robots_txt', e.target.value)} rows={6}
                  placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://yourdomain.com/sitemap.xml`}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none font-mono" />
                <p className="text-xs text-stone-400 mt-1">Leave empty to use the default robots.txt. Visit <code className="bg-stone-100 px-1 rounded">/robots.txt</code> and <code className="bg-stone-100 px-1 rounded">/sitemap.xml</code> to verify.</p>
              </div>
            </>
          )}

          {activeTab === 'social' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Twitter / X</label>
                <input type="url" value={settings.social_links?.twitter || ''} onChange={e => setSocial('twitter', e.target.value)} placeholder="https://x.com/yourbrand"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Instagram</label>
                <input type="url" value={settings.social_links?.instagram || ''} onChange={e => setSocial('instagram', e.target.value)} placeholder="https://instagram.com/yourbrand"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">LinkedIn</label>
                <input type="url" value={settings.social_links?.linkedin || ''} onChange={e => setSocial('linkedin', e.target.value)} placeholder="https://linkedin.com/company/yourbrand"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">YouTube</label>
                <input type="url" value={settings.social_links?.youtube || ''} onChange={e => setSocial('youtube', e.target.value)} placeholder="https://youtube.com/@yourbrand"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Google Analytics ID</label>
                <input type="text" value={settings.google_analytics_id} onChange={e => set('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Custom Head Code</label>
                <textarea value={settings.custom_head_code} onChange={e => set('custom_head_code', e.target.value)} rows={5}
                  placeholder="<!-- Custom meta tags, verification codes, etc. -->"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none font-mono" />
                <p className="text-xs text-stone-400 mt-1">Injected into the &lt;head&gt; of every page</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
