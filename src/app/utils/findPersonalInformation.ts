/* eslint-disable */

import { PDFDocument, rgb } from 'pdf-lib';
import nlp from "compromise";
import * as pdfjsLib from "pdfjs-dist";

// Initialisiere den PDF-Worker
export function initializePdfWorker() {
    if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    }
}

// Extrahiere Text und erstelle eine neue, redigierte PDF
export async function extractFromPDF(file: File) {
    initializePdfWorker();

    // Lese die Datei als ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Lade die PDF mit pdf-lib und pdfjs-dist
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Erstelle eine neue PDF
    const newPdfDoc = await PDFDocument.create();
    const fullText = [];

    // Gehe jede Seite im Dokument durch
    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();

        // Holen der Seitenmaße
        const pageWidth = page.getViewport({ scale: 1 }).width;
        const pageHeight = page.getViewport({ scale: 1 }).height;

        // Erstelle eine neue Seite in der neuen PDF
        const newPage = newPdfDoc.addPage([pageWidth, pageHeight]);

        // Iteriere durch alle Text-Items auf der Seite
        textContent.items.forEach((item: any) => {
            const text = item.str;
            const position = item.transform;
            const x = position[4];
            const y = position[5];
            const width = item.width;
            const height = item.height;

            // Verarbeite den Text mit NLP (z.B. um Namen zu erkennen)
            const doc = nlp(text);
            const detectedNames = doc.people().out('array') || [];

            // Muster für vertrauliche Daten (z.B. E-Mails, Telefonnummern)
            const regexPatterns = {
                email: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g,
                phone: /\b(\+?\s?(\d{1,3})[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4,}\b/g,
                birthdate: /\b(?:0[1-9]|[12][0-9]|3[01])[-/.](?:0[1-9]|1[0-2])[-/.](\d{4})\b/g,
                address: /\b[A-Za-zÄÖÜäöüß]+\s*(?:straße|gasse|weg|platz|allee|ring|hof|chaussee|damm|ufer|steig|stieg|graben|markt|park|promenade|brücke|hang|zeile|hügel|bogen|pfad|reihe|land|kamp|horst|kai|winkel)\s+\d{1,5},?\s*\d{5}\s+[A-Za-zÄÖÜäöüß-]+\b/g
            };

            // Vertrauliche Daten erkennen und durch Balken ersetzen
            const regexResults = Object.values(regexPatterns).map((regex) => [...text.matchAll(regex)]);
            let shouldDrawRectangle = false;
            let matchX = 0, matchY = 0, matchWidth = 0, matchHeight = 0;
            let currentX = x; // Start X-Position für den Text

            // Wenn vertrauliche Daten gefunden werden, markiere sie
            regexResults.forEach((matches: RegExpMatchArray[]) => {
                matches.forEach((match) => {
                    const matchText = match[0];
                    const matchIndex = match.index!;
                    const charWidth = width / text.length;

                    // Text vor dem vertraulichen Text
                    const beforeMatch = text.slice(0, matchIndex);
                    newPage.drawText(beforeMatch, {
                        x: currentX,
                        y: y,
                        size: height,
                    });
                    currentX += beforeMatch.length * charWidth;

                    // Rechteck für den vertraulichen Text
                    matchX = x + (matchIndex * charWidth);
                    matchWidth = matchText.length * charWidth;
                    matchY = y;
                    matchHeight = height;

                    newPage.drawRectangle({
                        x: matchX,
                        y: matchY - 1,  // Korrektur der Y-Position
                        width: matchWidth,
                        height: matchHeight + 2,
                        color: rgb(0, 0, 0),  // Schwarzes Rechteck
                    });

                    // Text nach dem vertraulichen Text
                    const afterMatch = text.slice(matchIndex + matchText.length);
                    newPage.drawText(afterMatch, {
                        x: currentX + matchWidth,
                        y: y,
                        size: height,
                    });

                    currentX += matchText.length * charWidth + afterMatch.length * charWidth;

                    shouldDrawRectangle = true;
                });
            });

            detectedNames.forEach((name: string) => {
              if (text.includes(name)) {
                  const matchIndex = text.indexOf(name);
                  const charWidth = width / text.length;
                  const matchX = x +(matchIndex * charWidth);
                  const matchWidth = name.length * charWidth;
                  console.log(name.length, charWidth, matchWidth);

             

                  // Schwärzen des Bereichs
                  newPage.drawRectangle({
                      x: matchX,
                      y: y,
                      width: matchWidth,
                      height: height + 1,
                      color: rgb(0, 0, 0), // Schwarze Rechtecke
                  });
                  console.log(`Gefundener Name: "${name}" auf Seite ${i + 1}`);
              }
          });

            // Wenn keine vertraulichen Daten gefunden wurden, füge den gesamten Text hinzu
            if (!shouldDrawRectangle) {
                newPage.drawText(text, {
                    x: x,
                    y: y,  // Korrigiere die Y-Koordinate
                    size: height,
                });
            }
    });
  }

    // Speichern der neuen PDF
    const pdfBytes = await newPdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const fileName = 'redacted_pdf.pdf';
    return new File([pdfBlob], fileName, { type: 'application/pdf' });
}



