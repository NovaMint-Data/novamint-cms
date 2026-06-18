import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const db = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  const [products, posts, pages] = await Promise.all([
    db.from('products').select('slug, updated_at').eq('status', 'published'),
    db.from('posts').select('slug, updated_at').eq('status', 'published'),
    db.from('pages').select('slug, updated_at').eq('status', 'published'),
  ]);

  const entries = [
    `<url><loc>${siteUrl}</loc><priority>1.0</priority><changefreq>daily</changefreq></url>`,
    `<url><loc>${siteUrl}/products</loc><priority>0.9</priority><changefreq>daily</changefreq></url>`,
    `<url><loc>${siteUrl}/blog</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>`,
    ...(products.data?.map(p =>
      `<url><loc>${siteUrl}/products/${p.slug}</loc><lastmod>${p.updated_at?.split('T')[0]}</lastmod><priority>0.8</priority></url>`
    ) || []),
    ...(posts.data?.map(p =>
      `<url><loc>${siteUrl}/blog/${p.slug}</loc><lastmod>${p.updated_at?.split('T')[0]}</lastmod><priority>0.7</priority></url>`
    ) || []),
    ...(pages.data?.map(p =>
      `<url><loc>${siteUrl}/pages/${p.slug}</loc><priority>0.6</priority></url>`
    ) || []),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;
  
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
