import { createBrowserClient } from "@supabase/ssr";
/**
 * This function creates the supabase client for the browser.
 * This client should be used when making requests to supabase from client components.
 * @returns supabase client
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}