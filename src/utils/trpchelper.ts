import { type SupabaseClient } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";

export async function getSupabaseUser(client: SupabaseClient) {
    const user = (await client.auth.getUser()).data.user;
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return user;
  }