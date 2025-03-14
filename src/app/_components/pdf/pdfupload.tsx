"use client"
import { useRef, useState } from "react"
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
import { pdfFormSchema } from "~/utils/schema";
import PDFDownload from "~/app/_components/pdf/pdfdownload";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { extractFromPDF } from "~/utils/findPersonalInformation";
import createDownloadURL from "~/utils/createDownloadURL";
import { useTranslations } from 'next-intl';

const MTBU = 30000;

export default function PDFUploadForm() {

    const t = useTranslations("PDFUpload");
    const [file, setFile ] = useState<File | null>(null);
    const [whiteList, setWhiteList] = useState<string[]>([]);
    const [pdfLink, setPdfLink] = useState<string>("");
    
    const lastUpload= useRef(0);



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
            
            setFile(selectedFile);  // Stellt sicher, dass die Datei richtig gesetzt ist
        }
    };
    

    const onSubmit = async () => {
        if (!file) {
            toast.error(t("noFile"));
            return;
        }
        const now = Date.now();
        if(now - lastUpload.current < MTBU){
            toast.error(t("wait"));
            return;
        }
        lastUpload.current = now;
        try {
            const redactedFile = await extractFromPDF(file, whiteList);
            const url = await createDownloadURL(redactedFile);
            setPdfLink(url);
            toast.success(t("success"));
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
        } catch (error) {
            toast.error(t("error"));
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
    };

    return (
        <Card className="w-full max-w-md p-6 shadow-lg rounded-xl bg-white">
        <CardHeader>
            <CardTitle className="text-center text-lg font-semibold text-gray-800">
             {t("title")}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Whitelist Eingabe */}
                <FormField
                control={form.control}
                name="whiteList"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-gray-600">Whitelist</FormLabel>
                    <FormControl>
                        <Input
                        type="text"
                        placeholder="Mustermann, Müller"
                        value={whiteList.join(",")}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            const newWhiteList = value ? value.split(",") : [];
                            setWhiteList(newWhiteList);
                            field.onChange(newWhiteList);
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* PDF Upload */}
                <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-gray-600">{t("file")}</FormLabel>
                    <FormControl>
                        <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            handleFileChange(e);
                            field.onChange(e.target.files?.[0]);
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                {/* Hochladen-Button */}
                <Button className="w-full mt-4" type="submit" disabled={!file}>
                {t("upload")}
                </Button>
            </form>
            </Form>
            <div className="mt-4">
                <PDFDownload url={pdfLink}></PDFDownload>
            </div>
        </CardContent>
    </Card>
    );
}