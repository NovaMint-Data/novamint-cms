import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const db = supabaseAdmin();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  // Check for custom robots.txt in settings
  const { data } = await db.from('settings').select('value').eq('key', 'robots_txt').single();
  
  if (data?.value && typeof data.value === 'string') {
    return new Response(data.value, { headers: { 'Content-Type': 'text/plain' } });
  }

  const defaultRobots = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml`;

  return new Response(defaultRobots, { headers: { 'Content-Type': 'text/plain' } });
}
