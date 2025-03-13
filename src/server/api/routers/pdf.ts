import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getSupabaseUser } from "~/utils/trpchelper";
import {  z } from "zod";

export const pdfRouter = createTRPCRouter({
    pdfUpload: protectedProcedure
        .input(z.object({
            name: z.string(),
            path: z.string(),
        }))
        .mutation(async ({ ctx, input}) => {
            const authUser = await getSupabaseUser(ctx.supabase)
            if(!authUser){
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "No access!",
                    
                })
            }

            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1);
            
            
            await ctx.db.document.create({
                data: {
                    userid: authUser.id,
                    filename: input.name,
                    storagepath: input.path,
                    expires_at: expiresAt,
                }
            })
            
            

            return {success: true};


        }),

})