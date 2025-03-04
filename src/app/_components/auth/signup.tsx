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
import { signupSchema, loginSchema } from "~/app/utils/schema";
import { api } from "~/trpc/react";

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
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="text-lg">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vorname</FormLabel>
                        <FormControl>
                            <Input placeholder="Max" {...field}/>
                        </FormControl>
                        <FormMessage />                                  
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nachname</FormLabel>
                        <FormControl>
                            <Input placeholder="Mustermann" {...field}/>
                        </FormControl>
                        <FormMessage />                                  
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Maxmustermann@web.de" {...field}/>
                        </FormControl>
                        <FormMessage />                                  
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••••" {...field} onChange={(e) => {handlePasswordChange(e.target.value); field.onChange(e)}}/>
                        </FormControl>
                        <FormMessage />                                  
                    </FormItem>
                )}
                />
                <FormItem>
                        <FormLabel>Passwort Bestätigen</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="••••••••••" onChange={(e) => {setConfirmPassword(e.target.value)}}/>
                        </FormControl>
                        <FormMessage />                                  
                </FormItem>

                <p>{error}</p>
                <p>{note}</p>

                <Button className="mt-2"type="submit">Sign up</Button>
                

            </form>
        </Form>
    )
}