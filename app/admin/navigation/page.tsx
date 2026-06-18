'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, Save, ExternalLink } from 'lucide-react';

export default function NavigationPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/navigation').then(r => r.json()).then(data => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  const addItem = () => {
    setItems([...items, { id: `tmp-${Date.now()}`, label: 'New Link', href: '/', open_in_new_tab: false }]);
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const next = [...items];
    const [moved] = next.splice(draggedIdx, 1);
    next.splice(idx, 0, moved);
    setDraggedIdx(idx);
    setItems(next);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  const handleSave = async () => {
    setSaving(true);
    const payload = items.map(item => ({
      id: item.id?.startsWith('tmp-') ? undefined : item.id,
      label: item.label,
      href: item.href,
      open_in_new_tab: item.open_in_new_tab || false,
    }));
    await fetch('/api/navigation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // Refetch to get real IDs
    const res = await fetch('/api/navigation');
    setItems(await res.json());
    setSaving(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Navigation Menu</h1>
          <p className="text-stone-500 text-sm mt-0.5">Drag to reorder. Changes apply to the header menu.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-6 mt-6">
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50 transition-all ${draggedIdx === idx ? 'dragging-item' : ''}`}
              >
                <GripVertical size={16} className="text-stone-300 cursor-grab flex-shrink-0" />
                <input
                  type="text" value={item.label}
                  onChange={e => updateItem(idx, 'label', e.target.value)}
                  placeholder="Label"
                  className="w-32 px-3 py-2 rounded-lg border border-stone-200 focus:border-sage-400 focus:outline-none text-sm text-stone-700"
                />
                <input
                  type="text" value={item.href}
                  onChange={e => updateItem(idx, 'href', e.target.value)}
                  placeholder="/path"
                  className="flex-1 px-3 py-2 rounded-lg border border-stone-200 focus:border-sage-400 focus:outline-none text-sm text-stone-700"
                />
                <label className="flex items-center gap-1.5 text-xs text-stone-500 flex-shrink-0">
                  <input type="checkbox" checked={item.open_in_new_tab || false} onChange={e => updateItem(idx, 'open_in_new_tab', e.target.checked)} className="rounded" />
                  <ExternalLink size={12} />
                </label>
                <button onClick={() => removeItem(idx)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {items.length === 0 && (
              <p className="text-sm text-stone-400 text-center py-6">No menu items yet</p>
            )}

            <button onClick={addItem} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50/50 transition-all text-sm font-medium">
              <Plus size={16} />Add Menu Item
            </button>
          </div>
        )}

        <button onClick={handleSave} disabled={saving} className="mt-6 flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
          <Save size={15} />{saving ? 'Saving…' : 'Save Menu'}
        </button>
      </div>

      <div className="bg-sage-50 rounded-2xl p-4 mt-4 text-sm text-sage-700">
        <p className="font-medium mb-1">💡 Tip</p>
        <p className="text-sage-600 text-xs leading-relaxed">
          Use relative paths like <code className="bg-white px-1 py-0.5 rounded">/products</code>, <code className="bg-white px-1 py-0.5 rounded">/blog</code>, or <code className="bg-white px-1 py-0.5 rounded">/pages/about</code>. For categories, use <code className="bg-white px-1 py-0.5 rounded">/products?category=templates</code>.
        </p>
      </div>
    </div>
  );
}
