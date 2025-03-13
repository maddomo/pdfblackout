/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signupSchema, loginSchema } from "~/utils/schema";
import { AuthError } from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import { zxcvbn } from "@zxcvbn-ts/core";

export const authRouter = createTRPCRouter({
    signup: publicProcedure
        .input(signupSchema)
        .mutation(async ({  ctx, input }) => {
            const existingUser = (await ctx.db.authUser.count({
                where: { email: input.email.toLowerCase() },
              })) > 0;
              const { error, data } = await ctx.supabase.auth.signUp(input);
              const passwordStrength = zxcvbn(input.password);
              console.log(passwordStrength.score);
              if (passwordStrength.score < 3) {
                  throw new TRPCError({
                  code: "BAD_REQUEST",
                  message: "Password is too weak",
                  });
              }
              if (error)
                  throw new TRPCError({
                  code: "UNAUTHORIZED",
                  cause: error,
                  message: error.code,
                  });
              if (data.user && !data.session) {
                  if (!existingUser) {
                  const authUser = data.user;

                  await ctx.db.user.create({
                      data: {
                      firstname: input.firstName,
                      lastname: input.lastName,
                      id: authUser.id,
                      },
                  });
                  }
                  return "confirm_mail";
                }
            }),
            isSignedUp: publicProcedure.query(async ({ ctx }) => {
                const user = (await ctx.supabase.auth.getUser()).data.user;
                if (!user) return { supabase: false, own: false };
                return {
                  supabase: !!user,
                  own: (await ctx.db.user.count({ where: { id: user.id } })) > 0,
                };
              }),

            signIn: publicProcedure
              .input(loginSchema)
              .mutation(async ({ ctx, input }) => {
                const { data, error } = await ctx.supabase.auth.signInWithPassword({
                    email: input.email,
                    password: input.password,
                });
                if(error){
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        cause: error,
                        message: error.code
                    })
                }
              }),
              getUserInfo2: publicProcedure.query(async ({ ctx }) => {
                const authUser = (await ctx.supabase.auth.getUser()).data.user;
                if (!authUser) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED"
                    })
                }
                return authUser;
              })
});