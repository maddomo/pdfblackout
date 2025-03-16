"use client"
import { useRef, useState, useEffect } from "react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
import { Checkbox } from "~/components/ui/checkbox";

const MTBU = 3000;

export default function PDFUploadForm() {

    const t = useTranslations("PDFUpload");
    const [file, setFile ] = useState<File | null>(null);
    const [whiteList, setWhiteList] = useState<string[]>([]);
    const [blackList, setBlackList] = useState<string[]>([]);
    const [pdfLink, setPdfLink] = useState<string>("");
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: checked,
        }));
    };

    
    
    const lastUpload= useRef(0);

    const checkboxItems = [
        {
            id: "name",
            label: "Name",
        },
        {
            id: "email",
            label: "Email",
        },
        {
            id: "phone",
            label: "Handynummer",
        },
        {
            id: "birthdate",
            label: "Geburtstag",
        },
        {
            id: "adresse",
            label: "Adresse",
        },
        {
            id: "iban",
            label: "Iban/BIC",
        },
    ] as const;



    const form = useZodForm<typeof pdfFormSchema>({
        schema: pdfFormSchema,
        defaultValues: {
            whiteList: [], 
            file: undefined
        }
    })

    useEffect(() => {
        const selectedItems = Object.keys(checkedItems).filter((key) => checkedItems[key]);
        form.setValue("items", selectedItems); // Nur wenn `checkedItems` sich geändert hat
    }, [checkedItems, form]);

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
            const redactedFile = await extractFromPDF(file, whiteList, blackList, checkedItems);
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
                    <FormLabel className="text-base"> {t("whitelist")} </FormLabel>
                    <FormDescription>Tragen Sie Namen oder Adressen ein die nicht geschwärzt werden sollen (optional)</FormDescription>
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
                {/* BlackList Eingabe */}
                <FormField
                control={form.control}
                name="blackList"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base"> Blacklist </FormLabel>
                    <FormDescription>Tragen sie Worte ein, die extra geschwärzt werden sollen.</FormDescription>
                    <FormControl>
                        <Input
                        type="text"
                        placeholder="Mustermann, Müller"
                        value={blackList.join(",")}
                        onChange={(e) => {
                            const value = e.target.value.trim();
                            const newBlackList = value ? value.split(",") : [];
                            setBlackList(newBlackList);
                            field.onChange(newBlackList);
                        }}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                        control={form.control}
                        name="items"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Optionen</FormLabel>
                                <FormDescription>
                                Wähle mindestens eine Option aus, die geschwärzt werden soll.
                                </FormDescription>
                            </div>
                            {checkboxItems.map((item) => (
                                <FormField
                                key={item.id}
                                name="items"
                                render={({ }) => {
                                    return (
                                    <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={checkedItems[item.id]}
                                            onCheckedChange={(checked) => {
                                                handleCheckboxChange(item.id, checked as boolean)
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                        {item.label}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
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