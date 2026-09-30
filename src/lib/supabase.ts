import { createClient as createBrowserClient } from '@/lib/supabase/client';

// Client for public/anon access and authenticated client components
// This automatically picks up the session from cookies in the browser.
export const supabase = createBrowserClient();
