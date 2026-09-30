import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*, resource_providers(name, domain)')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
  return data;
}

export async function getResourceBySlug(slug: string) {
  const { data, error } = await supabase
    .from('resources')
    .select('*, resource_providers(*)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}
