'use client';

import { useEffect, useState } from 'react';
import { Plus, FolderOpen, Edit, Trash2, X, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { createSlug } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = () => {
  fetch('/api/categories')
    .then(async (r) => {
      const data = await r.json();

      return Array.isArray(data)
        ? data
        : Array.isArray(data?.categories)
        ? data.categories
        : Array.isArray(data?.data)
        ? data.data
        : [];
    })
    .then((categories) => {
      setCategories(categories);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Categories fetch error:', err);
      setCategories([]);
      setLoading(false);
    });
};

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return;
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
    fetchCategories();
  };

  const openNew = () => {
    setEditing({ name: '', slug: '', description: '', image_url: '', sort_order: categories.length });
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setEditing({ ...cat });
    setShowForm(true);
  };

  const handleSave = async () => {
    const isNew = !editing.id;
    const payload = { ...editing, slug: editing.slug || createSlug(editing.name) };
    await fetch('/api/categories', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    setEditing(null);
    fetchCategories();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Categories</h1>
          <p className="text-stone-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={16} />Add Category
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft p-16 text-center">
          <FolderOpen size={40} className="text-stone-200 mx-auto mb-3" />
          <p className="text-stone-500 font-medium">No categories yet</p>
          <button onClick={openNew} className="text-sm text-sage-600 font-medium mt-2 hover:text-sage-700">Create your first category →</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-soft p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <FolderOpen size={18} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800">{cat.name}</p>
                <p className="text-xs text-stone-400">/products?category={cat.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all">
                  <Edit size={15} />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-stone-800">{editing.id ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Name *</label>
                <input
                  type="text" value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : createSlug(e.target.value) })}
                  placeholder="e.g. Templates"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Slug</label>
                <input
                  type="text" value={editing.slug}
                  onChange={e => setEditing({ ...editing, slug: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                <textarea
                  value={editing.description || ''}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-700 text-sm resize-none"
                />
              </div>
              <ImageUpload value={editing.image_url || ''} onChange={v => setEditing({ ...editing, image_url: v })} folder="categories" label="Image" />
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={!editing.name} className="flex-1 flex items-center justify-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                <Save size={15} />Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
