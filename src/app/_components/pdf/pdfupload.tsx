"use client"
import { useState } from "react"
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
import { pdfFormSchema } from "~/app/utils/schema";
import { api } from "~/trpc/react";
import { uploadToStorage } from "./uploadToStorage";

export default function PDFUploadForm() {

    const [file, setFile ] = useState<File | null>(null);
    const [error, setError ] = useState("");
    const [note, setNote ] = useState("");
    const [whiteList, setWhiteList] = useState<string[]>([]);
    
    const upload = api.pdf.pdfUpload.useMutation();

    const form = useZodForm<typeof pdfFormSchema>({
        schema: pdfFormSchema,
        defaultValues: {
            whiteList: [], 
            file: undefined
        }
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] ?? null;
        if (selectedFile) {
            console.log("Datei ausgewählt:", selectedFile);
            setFile(selectedFile);  // Stellt sicher, dass die Datei richtig gesetzt ist
        }
    };
    

    const onSubmit = async () => {
        if (!file) {
            setError("Keine Datei ausgewählt!");
            return;
          }
        setNote("");
        setError("");
          
         const result = await uploadToStorage(file, whiteList);
        
        upload.mutate({name: result.filename, path: result.signedUrl}, {
                onSuccess: () => {
                    setNote("Ihre PDF wurde geschwärzt!")
                    console.log(whiteList);
                    form.reset({
                        whiteList: [],
                        file: undefined,
                    });
                    setWhiteList([]);
                    setFile(null);

                    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
                    if (fileInput) {
                        fileInput.value = ""; 
                    }

                },
                onError: (e) => {
                    setError(e.message);
                    setWhiteList([]);
                }
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="whiteList" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Whitelist</FormLabel>
                        <FormControl>
                            <Input type="whiteList" onChange={(e) => {setWhiteList(e.target.value.split(",")); field.onChange(e.target.value.split(","));}}>
                            </Input>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <FormField control={form.control} name="file" render={({ field }) => (
                    <FormItem>
                        <FormLabel>PDF</FormLabel>
                        <FormControl>
                            <Input type="file" accept="application/pdf" onChange={(e) => {handleFileChange(e); field.onChange(e.target.files?.[0]);}}>
                            </Input>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <p>{note}</p>
                <p>{error}</p>
                <Button type="submit" disabled={!file}>Pdf Hochladen</Button>
            </form>
        </Form>
    )
}