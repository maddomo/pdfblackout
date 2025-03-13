import PDFUploadForm from "~/app/_components/pdf/pdfupload";
import { HydrateClient } from "~/trpc/server";


export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
        
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
            Schwärze deine PDFs – <span className="text-blue-600">sicher & schnell</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Lade ein PDF hoch, gebe in die Whitelist ein welche Daten nicht geschwärzt werden sollen  und lade die bearbeitete Datei in Sekunden wieder herunter.
          </p>
        </section>


        {/* PDF Upload Section */}
        <section className="">
          
          <PDFUploadForm />
          <p className="text-gray-500 text-sm mt-2">Bis zu 3 Dateien täglich kostenlos.</p>

        </section>

      </main>
    </HydrateClient>
  );
}
