import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for admin operations)
export const supabaseAdmin = () => createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          price: number;
          compare_price: number | null;
          image_url: string | null;
          images: string[];
          category_id: string | null;
          status: 'published' | 'draft';
          featured: boolean;
          payhip_link: string | null;
          meta_title: string | null;
          meta_description: string | null;
          keywords: string[];
          schema_markup: any;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          image_url: string | null;
          status: 'published' | 'draft';
          meta_title: string | null;
          meta_description: string | null;
          keywords: string[];
          author: string;
          created_at: string;
          updated_at: string;
        };
      };
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: any; // JSON sections for drag & drop
          meta_title: string | null;
          meta_description: string | null;
          status: 'published' | 'draft';
          created_at: string;
          updated_at: string;
        };
      };
      settings: {
        Row: {
          key: string;
          value: any;
          updated_at: string;
        };
      };
      navigation: {
        Row: {
          id: string;
          label: string;
          href: string;
          parent_id: string | null;
          sort_order: number;
          open_in_new_tab: boolean;
        };
      };
    };
  };
};
