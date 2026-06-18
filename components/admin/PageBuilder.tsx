'use client';

import { useState } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical, Trash2, Plus, ChevronDown, ChevronUp,
  Layout, Image as ImageIcon, Type, Grid3x3, MessageSquare, Mail
} from 'lucide-react';
import ImageUpload from './ImageUpload';

export type Section = {
  id: string;
  type: 'hero' | 'text' | 'image' | 'cta' | 'features' | 'gallery' | 'testimonial' | 'spacer';
  data: any;
};

const sectionTypes = [
  { type: 'hero', label: 'Hero Banner', icon: Layout, defaults: { title: 'New Section Title', subtitle: 'Add a subtitle here', buttonText: '', buttonLink: '', image_url: '' } },
  { type: 'text', label: 'Text Block', icon: Type, defaults: { heading: 'Heading', content: 'Add your text content here.' } },
  { type: 'image', label: 'Image', icon: ImageIcon, defaults: { image_url: '', caption: '' } },
  { type: 'cta', label: 'Call to Action', icon: MessageSquare, defaults: { title: 'Ready to get started?', buttonText: 'Shop Now', buttonLink: '/products' } },
  { type: 'features', label: 'Feature Grid', icon: Grid3x3, defaults: { heading: 'Why Choose Us', items: [
    { title: 'Feature 1', description: 'Description here' },
    { title: 'Feature 2', description: 'Description here' },
    { title: 'Feature 3', description: 'Description here' },
  ] } },
  { type: 'testimonial', label: 'Testimonial', icon: MessageSquare, defaults: { quote: 'This product changed everything for me!', author: 'Happy Customer' } },
  { type: 'spacer', label: 'Spacer', icon: Layout, defaults: { height: 'medium' } },
];

function SortableSection({ section, onUpdate, onDelete }: { section: Section; onUpdate: (data: any) => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(true);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const typeInfo = sectionTypes.find(t => t.type === section.type);
  const Icon = typeInfo?.icon || Layout;

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="flex items-center gap-3 p-4 bg-stone-50/50">
        <button {...attributes} {...listeners} className="text-stone-300 hover:text-stone-500 cursor-grab">
          <GripVertical size={16} />
        </button>
        <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center text-sage-600 flex-shrink-0">
          <Icon size={15} />
        </div>
        <span className="text-sm font-medium text-stone-700 flex-1">{typeInfo?.label || section.type}</span>
        <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-stone-400 hover:text-stone-600">
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        <button onClick={onDelete} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
          <Trash2 size={15} />
        </button>
      </div>

      {expanded && (
        <div className="p-4 space-y-3 border-t border-stone-100">
          <SectionEditor section={section} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function SectionEditor({ section, onUpdate }: { section: Section; onUpdate: (data: any) => void }) {
  const data = section.data;
  const set = (key: string, value: any) => onUpdate({ ...data, [key]: value });

  switch (section.type) {
    case 'hero':
      return (
        <>
          <Field label="Title">
            <input type="text" value={data.title || ''} onChange={e => set('title', e.target.value)} className="input" />
          </Field>
          <Field label="Subtitle">
            <textarea value={data.subtitle || ''} onChange={e => set('subtitle', e.target.value)} rows={2} className="input resize-none" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Button Text">
              <input type="text" value={data.buttonText || ''} onChange={e => set('buttonText', e.target.value)} className="input" />
            </Field>
            <Field label="Button Link">
              <input type="text" value={data.buttonLink || ''} onChange={e => set('buttonLink', e.target.value)} placeholder="/products" className="input" />
            </Field>
          </div>
          <ImageUpload value={data.image_url || ''} onChange={v => set('image_url', v)} folder="pages" label="Background Image (optional)" />
        </>
      );

    case 'text':
      return (
        <>
          <Field label="Heading">
            <input type="text" value={data.heading || ''} onChange={e => set('heading', e.target.value)} className="input" />
          </Field>
          <Field label="Content">
            <textarea value={data.content || ''} onChange={e => set('content', e.target.value)} rows={5} className="input resize-none" />
          </Field>
        </>
      );

    case 'image':
      return (
        <>
          <ImageUpload value={data.image_url || ''} onChange={v => set('image_url', v)} folder="pages" label="Image" />
          <Field label="Caption (optional)">
            <input type="text" value={data.caption || ''} onChange={e => set('caption', e.target.value)} className="input" />
          </Field>
        </>
      );

    case 'cta':
      return (
        <>
          <Field label="Title">
            <input type="text" value={data.title || ''} onChange={e => set('title', e.target.value)} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Button Text">
              <input type="text" value={data.buttonText || ''} onChange={e => set('buttonText', e.target.value)} className="input" />
            </Field>
            <Field label="Button Link">
              <input type="text" value={data.buttonLink || ''} onChange={e => set('buttonLink', e.target.value)} className="input" />
            </Field>
          </div>
        </>
      );

    case 'features':
      return (
        <>
          <Field label="Section Heading">
            <input type="text" value={data.heading || ''} onChange={e => set('heading', e.target.value)} className="input" />
          </Field>
          {(data.items || []).map((item: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl">
              <input type="text" value={item.title} placeholder="Title"
                onChange={e => {
                  const items = [...data.items];
                  items[i] = { ...items[i], title: e.target.value };
                  set('items', items);
                }}
                className="input text-xs" />
              <input type="text" value={item.description} placeholder="Description"
                onChange={e => {
                  const items = [...data.items];
                  items[i] = { ...items[i], description: e.target.value };
                  set('items', items);
                }}
                className="input text-xs" />
            </div>
          ))}
          <button type="button" onClick={() => set('items', [...(data.items || []), { title: 'New Feature', description: 'Description' }])}
            className="text-xs text-sage-600 font-medium hover:text-sage-700">
            + Add feature
          </button>
        </>
      );

    case 'testimonial':
      return (
        <>
          <Field label="Quote">
            <textarea value={data.quote || ''} onChange={e => set('quote', e.target.value)} rows={3} className="input resize-none" />
          </Field>
          <Field label="Author">
            <input type="text" value={data.author || ''} onChange={e => set('author', e.target.value)} className="input" />
          </Field>
        </>
      );

    case 'spacer':
      return (
        <Field label="Height">
          <select value={data.height || 'medium'} onChange={e => set('height', e.target.value)} className="input">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </Field>
      );

    default:
      return null;
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

export default function PageBuilder({ sections, onChange }: { sections: Section[]; onChange: (sections: Section[]) => void }) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    onChange(arrayMove(sections, oldIndex, newIndex));
  };

  const addSection = (type: string) => {
    const typeInfo = sectionTypes.find(t => t.type === type);
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: type as Section['type'],
      data: JSON.parse(JSON.stringify(typeInfo?.defaults || {})),
    };
    onChange([...sections, newSection]);
    setShowAddMenu(false);
  };

  const updateSection = (id: string, data: any) => {
    onChange(sections.map(s => s.id === id ? { ...s, data } : s));
  };

  const deleteSection = (id: string) => {
    onChange(sections.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-3">
      <style>{`.input { width: 100%; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border: 1px solid #e7e5e4; font-size: 0.8125rem; color: #44403c; outline: none; } .input:focus { border-color: #7d8e7d; }`}</style>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onUpdate={(data) => updateSection(section.id, data)}
                onDelete={() => deleteSection(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
          <Layout size={32} className="text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-400">No sections yet — add your first one below</p>
        </div>
      )}

      {/* Add section menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50/50 transition-all text-sm font-medium"
        >
          <Plus size={16} />Add Section
        </button>

        {showAddMenu && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-card border border-stone-100 p-2 z-10 grid grid-cols-2 gap-1">
            {sectionTypes.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => addSection(t.type)}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-sage-50 text-left transition-all"
                >
                  <div className="w-7 h-7 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500 flex-shrink-0">
                    <Icon size={13} />
                  </div>
                  <span className="text-xs font-medium text-stone-700">{t.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
