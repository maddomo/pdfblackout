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
import PDFDownload from "~/app/_components/pdf/pdfdownload";
import { toast } from "sonner";

export default function PDFUploadForm() {

    const [file, setFile ] = useState<File | null>(null);
    const [error, setError ] = useState("");
    const [note, setNote ] = useState("");
    const [whiteList, setWhiteList] = useState<string[]>([]);
    const [pdfLink, setPdfLink] = useState<string>("");
    
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
         setPdfLink(result.signedUrl);
        
        upload.mutate({name: result.filename, path: result.signedUrl}, {
                onSuccess: () => {
                    toast.success("PDF wurde geschwärzt und ist zum Download bereit");
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
                onError: () => {
                    toast.error("Fehler beim Hochladen der PDF");
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
                }
            }
        );
    };

    return (
        <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="whiteList" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Whitelist</FormLabel>
                        <FormControl>
                        <Input
                            type="text"
                            value={whiteList.join(",")} // Stellt sicher, dass der Wert korrekt angezeigt wird
                            onChange={(e) => {
                                const value = e.target.value.trim();
                                const newWhiteList = value ? value.split(",") : []; // Falls leer, leeres Array setzen
                                setWhiteList(newWhiteList);
                                field.onChange(newWhiteList);
                            }}
                            />
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
                
                <Button className="mt-2" type="submit" disabled={!file}>Pdf Hochladen</Button>
            </form>
        </Form>
        <PDFDownload url={pdfLink} />
        </div>
    )
}