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

    // Gehe jede Seite im Dokument durch
    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();
        const pageWidth = page.getViewport({ scale: 1 }).width;
        const pageHeight = page.getViewport({ scale: 1 }).height;

        const newPage = newPdfDoc.addPage([pageWidth, pageHeight]);

        textContent.items.forEach((item: any) => {
            const text = item.str;
            const position = item.transform;
            const x = position[4];
            const y = position[5];
            const width = item.width;
            const height = item.height;
            const charWidth = width / text.length;

            const doc = nlp(text);
            const detectedNames = doc.people().out('array') || [];

            const regexPatterns = {
                email: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g,
                phone: /\b(\+?\s?(\d{1,3})[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4,}\b/g,
                birthdate: /\b(?:0[1-9]|[12][0-9]|3[01])[-/.](?:0[1-9]|1[0-2])[-/.](\d{4})\b/g,
                address: /\b[A-Za-zÄÖÜäöüß]+\s*(?:straße|gasse|weg|platz|allee|ring|hof|chaussee|damm|ufer|steig|stieg|graben|markt|park|promenade|brücke|hang|zeile|hügel|bogen|pfad|reihe|land|kamp|horst|kai|winkel)\s+\d{1,5},?\s*\d{5}\s+[A-Za-zÄÖÜäöüß-]+\b/g,
                iban: /\bDE\d{2}\s*(?:[0-9a-zA-Z]{4}\s*){4}[0-9a-zA-Z]{2}\b/g,
                bic: /\b[A-Z]{4}DE[A-Z0-9]{2}(?:[A-Z0-9]{3})?\b/g,
                titleAndName: /\b(Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß]+)\b/g
            };

            let matches: { index: number; text: string }[] = [];

            let whitelist: string[] = ["Frau Lisa Müller", "Mustermann"];

            // Funktion, um zu prüfen, ob der neue Match bereits enthalten ist
            function isDuplicateOrContained(newMatch: { index: number; text: string }) {
                return matches.some(existingMatch => 
                    existingMatch.text.includes(newMatch.text) || newMatch.text.includes(existingMatch.text)
                );
            }

            // Prüfen, ob ein Name auf der Whitelist steht
            function isWhitelisted(text: string) {
                return whitelist.some(allowed => allowed.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(allowed.toLowerCase()));
            }
            

            detectedNames.forEach((name: string) => {
                let index = text.indexOf(name);
                if (index !== -1) {
                    let newMatch = { index, text: name };
                    if (!isDuplicateOrContained(newMatch) && !isWhitelisted(name)) {
                        matches.push(newMatch);
                    }
                }
            });

            Object.values(regexPatterns).forEach((regex) => {
                [...text.matchAll(regex)].forEach((match) => {
                    const matchText = match[0];

                    let newMatch = { index: match.index!, text: matchText };

                    if (!isDuplicateOrContained(newMatch) && !isWhitelisted(matchText)) {
                        matches.push(newMatch);
                    }
                });
            });

            matches.sort((a, b) => a.index - b.index);

            let currentX = x;
            let lastIndex = 0;

            matches.forEach(({ index, text: matchText }) => {
                const beforeMatch = text.slice(lastIndex, index);
                const matchWidth = matchText.length * charWidth;

                newPage.drawText(beforeMatch, {
                    x: currentX,
                    y: y,
                    size: height,
                });

                currentX += beforeMatch.length * charWidth;

                newPage.drawRectangle({
                    x: currentX,
                    y: y - 1,
                    width: matchWidth,
                    height: height + 2,
                    color: rgb(0, 0, 0),
                });

                currentX += matchWidth;
                lastIndex = index + matchText.length;
            });
            matches.forEach((match, index) => {
                console.log(`Match ${index + 1}:`, match);
            });

            const afterMatch = text.slice(lastIndex);
            newPage.drawText(afterMatch, {
                x: currentX,
                y: y,
                size: height,
            });
        });
    }

    const pdfBytes = await newPdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    return new File([pdfBlob], 'redacted_pdf.pdf', { type: 'application/pdf' });
}




