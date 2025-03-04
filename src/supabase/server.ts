/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable */
import { createServerClient } from "@supabase/ssr";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { cookies } from "next/headers";
import { getCookies, setCookie } from "~/app/utils/cookiehelper";

/**
 * This function creates the supabase client for RSC.
 * @returns The supabase client on the server for RSC requests.
 */
export async function createRSCClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * This function creates the supabase client for HTTP requests with tRPC.
 * @returns The supabase client on the server for HTTP requests with tRPC.
 */
export async function createTRPCSupabaseClient(
  trpcOptions: FetchCreateContextFnOptions
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return getCookies(trpcOptions.req);
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              setCookie(trpcOptions.resHeaders, name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
