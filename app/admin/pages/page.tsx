'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Edit, Trash2, Eye } from 'lucide-react';

export default function PagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPages = () => {
    fetch('/api/pages').then(r => r.json()).then(data => {
      setPages(data || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPages(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/pages?id=${id}`, { method: 'DELETE' });
    fetchPages();
  };

  const handleToggleStatus = async (page: any) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    await fetch('/api/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: page.id, status: newStatus }),
    });
    fetchPages();
  };

  const filtered = pages.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Pages</h1>
          <p className="text-stone-500 text-sm mt-0.5">{pages.length} pages</p>
        </div>
        <Link href="/admin/pages/new" className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all">
          <Plus size={16} />New Page
        </Link>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search pages…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-sage-400 focus:outline-none text-stone-700 placeholder:text-stone-300" />
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText size={40} className="text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No pages yet</p>
            <Link href="/admin/pages/new" className="text-sm text-sage-600 font-medium mt-2 inline-block">Create your first page →</Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {filtered.map((page) => (
              <div key={page.id} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/50 transition-colors">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 flex-shrink-0">
                  <FileText size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{page.title}</p>
                  <p className="text-xs text-stone-400 truncate">/pages/{page.slug} · {(page.content?.length || 0)} sections</p>
                </div>
                <button onClick={() => handleToggleStatus(page)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${page.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'}`}>
                  {page.status}
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={`/pages/${page.slug}`} target="_blank" className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all">
                    <Eye size={15} />
                  </a>
                  <Link href={`/admin/pages/${page.id}`} className="p-1.5 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDelete(page.id, page.title)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
