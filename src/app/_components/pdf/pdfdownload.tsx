"use client"
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Label } from "~/components/ui/label";
import { toast } from "sonner";

export default function PDFDownload({ url }: { url: string }) {
  const [validUrl, setValidUrl] = useState(url);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (url) {
      setValidUrl(url);
      setIsExpired(false);
      setTimeLeft(60);
      
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [url]);

  const handleDownload = async () => {
    if (!validUrl || isExpired) {
      toast.error("Der Download-Link ist abgelaufen. Bitte laden Sie die Datei erneut hoch.");
      return;
    }
    try {
      const response = await fetch(validUrl);
      if (!response.ok) throw new Error("Fehler beim Abrufen der Datei.");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "dokument.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Fehler beim Herunterladen der PDF:", error);
    }
  };

  return (
    <>
      {url && (
        <div className="mt-5 flex flex-col justify-center items-center">
          <Label htmlFor="download">Dieser Link ist {timeLeft} Sekunden gültig</Label>
          <div id="download" className="mt-2 flex flex-row justify-center items-center gap-2">
            <Button disabled={isExpired}>
              <Link href={url} target="_blank" rel="noopener noreferrer">
                PDF Anzeigen
              </Link>
            </Button>
            <Button onClick={handleDownload} disabled={isExpired}>
              PDF Herunterladen
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
