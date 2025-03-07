/* eslint-disable */
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb } from 'pdf-lib';

export function initializePdfWorker() {
    // Prüfe, ob es im Browser läuft
    if (typeof window !== "undefined") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";  // Worker aus public laden
    }
  }

const regexPatterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /(?:\+?\d{1,3}[-.\s]?)?(?:\(\d{1,4}\)[-\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
    birthdate: /\b(?:0[1-9]|1[0-9]|2[0-9]|3[01])[-/.](?:0[1-9]|1[0-2])[-/.](?:\d{4})\b/g, // z.B. 01.01.1990 oder 01/01/1990
    address: /\d{1,5}\s[\w\s,.-]+/g  // einfache Adresse (z.B. "123 Main St")
};

export async function extractFromPDF(file: File) {

    initializePdfWorker();
    const arrayBuffer = await file.arrayBuffer();

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";

    for(let i = 0; i < pdf.numPages; i++){
        const page = await pdf.getPage(i + 1 );
        const textContent = await page.getTextContent();
      


        textContent.items.forEach((item: any) => {
            const text = item.str;
            const position = item.transform;
            const x = position[4];
            const y = position[5];
            const width = item.width;
            const height = item.height;
            
            (Object.keys(regexPatterns) as (keyof typeof regexPatterns)[]).forEach((key) => {
                const regex = regexPatterns[key];
                const match = text.match(regex);

                if (match) {
                    // Daten erkannt, Rechteck darüber zeichnen
                    const pdfPage = pdfDoc.getPages()[i];
                    pdfPage?.drawRectangle({
                        x: x,
                        y: y,
                        width: width,
                        height: height + 1,
                        color: rgb(0, 0, 0), // Schwarzes Rechteck für Schwärzen
                    });
                    console.log(`Gefundenes ${key}: "${match.join(', ')}" auf Seite ${i + 1}`);
                }
            });
            
        })

        

        
    }
    
    const pdfBytes = await pdfDoc.save();

  // Blob aus den Bytes erstellen
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

  // Blob in File umwandeln
    const fileName = 'redacted_pdf.pdf'; // Den Dateinamen nach Bedarf anpassen
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

    return pdfFile;  // Die File-Instanz, die hochgeladen werden kann

    
}