import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types' // We will generate this later, use any for now if not available

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
