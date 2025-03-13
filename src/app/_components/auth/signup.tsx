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
import { signupSchema } from "~/utils/schema";
import { api } from "~/trpc/react";
import Link from "next/link";

export function SignupForm(){
    const registration = api.auth.signup.useMutation();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [note, setNote] = useState("");
    
    const form = useZodForm<typeof signupSchema>({
        schema: signupSchema,
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
        },
    })

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    }

    async function onSubmit(values: z.infer<typeof signupSchema>){
        if (values.password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        setNote("");
        setError("");
        registration.mutate(values, {
            onSuccess: (e) => {
                if(e === "confirm_mail"){
                    setNote("Please confirm your email");
                }
            },
            onError: (e) => {
                setError(e.message);
            }

        })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto">
                {/* Vorname */}
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Vorname</FormLabel>
                        <FormControl>
                            <Input placeholder="Max" {...field} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Nachname */}
                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Nachname</FormLabel>
                        <FormControl>
                            <Input placeholder="Mustermann" {...field} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Email */}
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700 font-medium">E-Mail</FormLabel>
                        <FormControl>
                            <Input placeholder="max.mustermann@web.de" {...field} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Passwort */}
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Passwort</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••••" {...field} onChange={(e) => {handlePasswordChange(e.target.value); field.onChange(e)}} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                {/* Passwort bestätigen */}
                <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Passwort bestätigen</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="••••••••••" onChange={(e) => {setConfirmPassword(e.target.value)}} className="border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md" />
                    </FormControl>
                    <FormMessage />
                </FormItem>

                {/* Fehler- und Hinweisnachrichten */}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {note && <p className="text-gray-500 text-sm text-center">{note}</p>}

                {/* Registrieren-Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg mt-2">
                    Sign up
                </Button>
                <Link href="/auth/signin">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg mt-2" type="button">Zum Login</Button>
                </Link>
            </form>
        </Form>

    )
}