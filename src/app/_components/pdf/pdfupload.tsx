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
import { useDropzone } from "react-dropzone";

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
            label: t("name"),
        },
        {
            id: "email",
            label: t("email"),
        },
        {
            id: "phone",
            label: t("phone"),
        },
        {
            id: "birthdate",
            label: t("birthdate"),
        },
        {
            id: "adresse",
            label: t("address"),
        },
        {
            id: "iban",
            label: t("iban"),
        },
    ] as const;



    const form = useZodForm<typeof pdfFormSchema>({
        schema: pdfFormSchema,
        defaultValues: {
            whiteList: [], 
            file: undefined,
            blackList: [],
            items: ["email"]
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
                blackList: [],
            });
            setWhiteList([]);
            setBlackList([]);
            setFile(null);


            const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
            if (fileInput) {
                fileInput.value = ""; 
            }
        } catch (error) {
            toast.error(t("error"));
            console.log(error)
            form.reset({
                whiteList: [],
                file: undefined,
                blackList: [],
            });
            setWhiteList([]);
            setBlackList([]);
            setFile(null);


            const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
            if (fileInput) {
                fileInput.value = ""; 
            }
        }
       
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if(!selectedFile){
                return;
            }
            setFile(selectedFile);
            form.setValue("file", selectedFile);
        }
    };
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        multiple: false,
    });



    return (
        <Card className="w-full max-w-3xl p-8 shadow-lg rounded-xl bg-white mb-5">
            <CardHeader>
                <CardTitle className="text-center text-xl font-semibold text-gray-800">
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Whitelist & Blacklist als Grid auf Desktop, Stack auf Mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="whiteList"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t("whitelist")}</FormLabel>
                                        <FormDescription className="min-h-[40px]">{t("whiteListDescription")}</FormDescription>
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
    
                            <FormField
                                control={form.control}
                                name="blackList"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base"> {t("blacklist")} </FormLabel>
                                        <FormDescription className="min-h-[40px]"> {t("blacklistDescription")} </FormDescription>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Beispielwort, Test"
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
                        </div>
    
                        {/* Checkboxen in zwei Spalten auf Desktop, eine Spalte auf Mobile */}
                        <FormField
                            control={form.control}
                            name="items"
                            render={() => (
                                <FormItem>
                                    <FormLabel className="text-base"> {t("optionen")} </FormLabel>
                                    <FormDescription>
                                        {t("optionenDescription")}
                                    </FormDescription>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {checkboxItems.map((item) => (
                                            <FormField
                                                key={item.id}
                                                name="items"
                                                render={() => (
                                                    <FormItem className="flex items-center space-x-3">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={checkedItems[item.id]}
                                                                onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
    
                        {/* Datei-Upload & Button in einer Zeile auf Desktop, untereinander auf Mobile */}
                        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
                            <FormField
                                control={form.control}
                                name="file"
                                render={({ field }) => (
                                    <div {...getRootProps()} className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-500 transition-all">
                                        <input {...getInputProps()} />
                                        {file ? (
                                            <p className="text-gray-700">{file.name}</p>
                                        ) : (
                                            <p className="text-gray-500">
                                                {isDragActive ? t("dropFile") : t("dragDropOrClick")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
    
                            <Button className=" w-full md:w-auto mt-4 md:mt-7" type="submit" disabled={!file}>
                                {t("upload")}
                            </Button>
                        </div>
                    </form>
                </Form>
    
                {/* PDF Download */}
                <div className="mt-6">
                    <PDFDownload url={pdfLink} />
                </div>
            </CardContent>
        </Card>
    );
}