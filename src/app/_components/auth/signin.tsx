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
import { useZodForm } from "~/app/utils/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { loginSchema } from "~/app/utils/schema";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useRevalidation } from "~/app/utils/revalidation";


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
                    void router.push("/dashboard");
                  });
            },
            onError: (e) => {
                setError(e.message)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                            <Input placeholder="maxmustermann@web.de" {...field}></Input>
                        </FormControl>
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="•••••••••" {...field}></Input>
                        </FormControl>
                    </FormItem>
                )}
                />

                <p>{error}</p>
                <p>{note}</p>

                <Button className="mt-2" type="submit">Sign in</Button>
            </form>


        </Form>
    )
}