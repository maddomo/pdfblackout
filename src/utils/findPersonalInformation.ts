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
export async function extractFromPDF(file: File, whiteList: string[] = [], blackList: string[] = [], checkedItems: Record<string, boolean> ) {
    // Initialisiere den PDF-Worker
    initializePdfWorker();

    // Lese die Datei als ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Lade die PDF mit pdf-lib und pdfjs-dist
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Erstelle eine neue PDF
    const newPdfDoc = await PDFDocument.create();

    let shouldNameBeRedacted: boolean = false;
    const regexPatterns: Record<string, RegExp> = {}
    //Regexauswahl setzen
    for(const key in checkedItems){
        if(checkedItems[key]){
            switch(key){
                case "name":
                    regexPatterns["name"] = /\b(Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß]+)\b/g;
                    shouldNameBeRedacted = true;
                    break;
                case "email":
                    regexPatterns["email"] = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}\b/g;
                    break;
                case "birthdate":
                    regexPatterns["birthdate"] = /\b(Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß]+)\b/g;
                    break;
                case "adresse":
                    regexPatterns["adresse"] = /\b(Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß]+)\b/g;
                    regexPatterns["strasseMitNummer"] = /\b[A-ZÄÖÜa-zäöüß]+(?:straße|str\.?|weg|allee|platz|gasse|ring|damm|ufer|chaussee|steig|berg|hang|pfad|bogen|graben|hafen|markt|hof|brücke)\s\d+[a-zA-Z]?\b/gi;
                    regexPatterns["plzStadt"] = /\b\d{5}\s+[A-ZÄÖÜ][a-zäöüß]+\b/g;
                    regexPatterns["stadtPLz"] = /\b[A-ZÄÖÜ][a-zäöüß]+\s+\d{5}\b/g;
                    break;
                case "iban":
                    regexPatterns["iban"] = /\b(Herr|Frau)\s+([A-ZÄÖÜ][a-zäöüß]+)\b/g;
                    regexPatterns["bic"] = /\b[A-Z]{4}DE[A-Z0-9]{2}(?:[A-Z0-9]{3})?\b/g;
                    break;
                case "phone":
                    regexPatterns["phone"] = /\b(\+?\s?(\d{1,3})[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4,}\b/g;
                default:
                    break;

            }

        }
    }

    console.log(regexPatterns);

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


            let matches: { index: number; text: string }[] = [];
            let whitelist: string[] = whiteList;
            let blacklist: string[] = blackList;

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
            
            if(shouldNameBeRedacted){
                detectedNames.forEach((name: string) => {
                    let index = text.indexOf(name);
                    if (index !== -1) {
                        let newMatch = { index, text: name };
                        console.log("Name", newMatch);
                        if (!isDuplicateOrContained(newMatch) && !isWhitelisted(name)) {
                            matches.push(newMatch);
                        }
                    }
                });
            }

            Object.values(regexPatterns).forEach((regex) => {
                [...text.matchAll(regex)].forEach((match) => {
                    if (match.index !== undefined) {
                        const matchText = match[0];
            
                        let newMatch = { index: match.index, text: matchText };
                        console.log("Erkanntes Muster:", newMatch);
            
                        if (!isDuplicateOrContained(newMatch) && !isWhitelisted(matchText)) {
                            matches.push(newMatch);
                        }
                    }
                });
            });

            // Prüfe zusätzlich, ob Wörter aus der Blacklist geschwärzt werden müssen
            blacklist.forEach((blacklistWord) => {
                let regex = new RegExp(`\\b${blacklistWord}\\b`, "gi");
                [...text.matchAll(regex)].forEach((match) => {
                    if (match.index !== undefined) {
                        let newMatch = { index: match.index, text: match[0] };
                        console.log("Blacklisted Word erkannt:", newMatch);

                        if (!isDuplicateOrContained(newMatch)) {
                            matches.push(newMatch);
                        }
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




