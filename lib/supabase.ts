import { createBrowserClient } from '@supabase/ssr'

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Client-only data pages may be prerendered by Next.js. Do not crash the
    // build before the browser has a chance to use the configured Supabase env.
    if (typeof window === 'undefined') return null as any
    throw new Error('Supabase environment variables are missing')
  }

  return createBrowserClient(url, key)
}
