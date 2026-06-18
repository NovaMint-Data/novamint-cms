'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = 'products', label = 'Image' }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();

    if (res.ok) {
      onChange(data.url);
    } else {
      setError(data.error || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      
      {value ? (
        <div className="relative group">
          <img src={value} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-stone-200" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <label className="cursor-pointer bg-white text-stone-800 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-all">
              Replace
              <input type="file" accept="image/*" onChange={handleChange} className="sr-only" />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragging ? 'border-sage-400 bg-sage-50' : 'border-stone-200 hover:border-sage-300 hover:bg-stone-50'}
          `}
        >
          <input type="file" accept="image/*" onChange={handleChange} className="sr-only" />
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <div className="w-8 h-8 border-2 border-sage-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
                <Upload size={18} className="text-stone-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-stone-600">
                {uploading ? 'Uploading…' : 'Click or drag image here'}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">PNG, JPG, WebP up to 10MB</p>
            </div>
          </div>
        </label>
      )}

      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      
      {/* URL input fallback */}
      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste image URL directly"
          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 focus:border-sage-400 focus:outline-none text-stone-600 placeholder:text-stone-300"
        />
      </div>
    </div>
  );
}
