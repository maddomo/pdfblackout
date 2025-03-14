"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState("de");

  useEffect(() => {
    const storedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];

    setCurrentLocale(storedLocale ?? "de");
  }, []);

  const toggleLocale = () => {
    const newLocale = currentLocale === "de" ? "en" : "de";

    // Setze das Cookie mit einem kurzen Ablaufdatum für Tests (z. B. 1 Tag)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=86400`;

    // Aktualisiere den Zustand, damit der Button direkt umschaltet
    setCurrentLocale(newLocale);

    // Aktualisiere die Seite, damit die richtige Sprachdatei geladen wird
    router.refresh();
  };

  return (
    <Button variant={"secondary"} onClick={toggleLocale} className="fixed top-4 right-4">
      {currentLocale === "de" ? "🇬🇧 " : "🇩🇪 "}
    </Button>
  );
}

