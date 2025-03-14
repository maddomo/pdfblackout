import { useTranslations } from "next-intl"
export default function Footer(){
    const t = useTranslations("Footer");
    return(
        <footer className="w-full flex flex-row gap-2 justify-center bg-gray-800 text-white text-center p-4">
            <a href={"/imprint"} className="text-gray-400 hover:text-white"> {t("imprint")} </a>
            <a href={"/"}> ©2025 PDF Blackout</a>
            
            <a href={"/policy"} className="text-gray-400 hover:text-white"> {t("privacy")} </a>
        </footer>
    )
}