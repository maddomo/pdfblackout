import Link from "next/link";
import PDFUploadForm from "~/app/_components/pdf/pdfupload"
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  

  

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        
          <PDFUploadForm></PDFUploadForm>
          

       
      </main>
    </HydrateClient>
  );
}
