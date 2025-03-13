"use client"

import { useState } from "react"
import { type z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "~/components/ui/form";
import { useZodForm } from "~/utils/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { loginSchema } from "~/utils/schema";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useRevalidation } from "~/utils/revalidation";
import Link from "next/link";


export function SignInForm(){

    const [error, setError ] = useState("");
    const [note, setNote ] = useState("");
    const router = useRouter();
    const revalidate = useRevalidation();
    const login = api.auth.signIn.useMutation();

    const form = useZodForm<typeof loginSchema>({
        schema: loginSchema,
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>){
        setNote("");
        setError("");

        login.mutate(values, {
            onSuccess: () => {
                setNote("Login erfolgreich, sie werden weitergeleitet ")
                void revalidate().then(() => {
                    void router.push("/home");
                  });
            },
            onError: (e) => {
                setError(e.message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700 font-medium">E-Mail</FormLabel>
                        <FormControl>
                            <Input placeholder="maxmustermann@web.de" {...field} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"></Input>
                        </FormControl>
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Passwort</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="•••••••••" {...field} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"></Input>
                        </FormControl>
                    </FormItem>
                )}
                />

                <p>{error}</p>
                <p>{note}</p>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg mt-2" type="submit">Login</Button>
                <Link href="/auth/signup">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg mt-2" type="button">Noch kein Account?</Button>
                </Link>
            </form>


        </Form>
    )
}