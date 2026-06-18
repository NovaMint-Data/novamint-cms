'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Newspaper, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    fetch('/api/posts').then(r => r.json()).then(data => {
      setPosts(data || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleToggleStatus = async (post: any) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await fetch('/api/posts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, status: newStatus }),
    });
    fetchPosts();
  };

  const filtered = posts.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-stone-800">Blog</h1>
          <p className="text-stone-500 text-sm mt-0.5">{posts.length} posts total</p>
        </div>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 bg-sage-500 hover:bg-sage-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={16} />New Post
        </Link>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:border-sage-400 focus:outline-none text-stone-700 placeholder:text-stone-300"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-sage-400 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Newspaper size={40} className="text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">No posts yet</p>
            <Link href="/admin/blog/new" className="text-sm text-sage-600 font-medium mt-2 inline-block">Write your first post →</Link>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {filtered.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Newspaper size={14} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{post.title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {post.author} · {format(new Date(post.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => handleToggleStatus(post)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    post.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {post.status}
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <a href={`/blog/${post.slug}`} target="_blank" className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-all">
                    <Eye size={15} />
                  </a>
                  <Link href={`/admin/blog/${post.id}`} className="p-1.5 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => handleDelete(post.id, post.title)} className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
