'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter,
  AlignRight, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
  Heading1, Heading2, Heading3, Pilcrow
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const COLORS = ['#1c1917', '#44403c', '#78716c', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-stone max-w-none min-h-[320px] px-4 py-3 focus:outline-none text-sm text-stone-700 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // sync external value
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value]);

  const addLink = useCallback(() => {
    const url = window.prompt('URL:');
    if (!url) return;
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-1.5 rounded-lg text-sm transition-all ${active
      ? 'bg-sage-500 text-white'
      : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'}`;

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden focus-within:border-sage-400 focus-within:ring-2 focus-within:ring-sage-100">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-2 bg-stone-50 border-b border-stone-200">

        {/* Headings */}
        <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={btn(editor.isActive('heading', { level: 1 }))}>
          <Heading1 size={15} />
        </button>
        <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btn(editor.isActive('heading', { level: 2 }))}>
          <Heading2 size={15} />
        </button>
        <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btn(editor.isActive('heading', { level: 3 }))}>
          <Heading3 size={15} />
        </button>
        <button type="button" title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()}
          className={btn(editor.isActive('paragraph'))}>
          <Pilcrow size={15} />
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Format */}
        <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive('bold'))}>
          <Bold size={15} />
        </button>
        <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive('italic'))}>
          <Italic size={15} />
        </button>
        <button type="button" title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive('underline'))}>
          <UnderlineIcon size={15} />
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Alignment */}
        <button type="button" title="Align Left" onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={btn(editor.isActive({ textAlign: 'left' }))}>
          <AlignLeft size={15} />
        </button>
        <button type="button" title="Align Center" onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={btn(editor.isActive({ textAlign: 'center' }))}>
          <AlignCenter size={15} />
        </button>
        <button type="button" title="Align Right" onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={btn(editor.isActive({ textAlign: 'right' }))}>
          <AlignRight size={15} />
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Lists */}
        <button type="button" title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive('bulletList'))}>
          <List size={15} />
        </button>
        <button type="button" title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive('orderedList'))}>
          <ListOrdered size={15} />
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Link & Image */}
        <button type="button" title="Add Link" onClick={addLink}
          className={btn(editor.isActive('link'))}>
          <LinkIcon size={15} />
        </button>
        <button type="button" title="Add Image" onClick={addImage}
          className={btn(false)}>
          <ImageIcon size={15} />
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Colors */}
        <div className="flex items-center gap-0.5">
          {COLORS.map(color => (
            <button key={color} type="button" title={color}
              onClick={() => editor.chain().focus().setColor(color).run()}
              className="w-4 h-4 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  );
}