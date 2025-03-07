import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getSupabaseUser } from "~/app/utils/trpchelper";
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
            
            
            await ctx.db.document.create({
                data: {
                    userid: authUser.id,
                    filename: input.name,
                    storagepath: input.path
                }
            })
            
            

            return {success: true};


        })


})