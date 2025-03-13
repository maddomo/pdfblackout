"use client"
import { Button } from "~/components/ui/button";
import { Card} from "~/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function Landing() {
  const router = useRouter();
  const { data } = api.auth.getUserInfo2.useQuery();

  useEffect(() => {
    if (data) {
      router.push("/home");
    }
  }, [data]);

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
        
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
            Schwärze deine PDFs – <span className="text-blue-600">sicher & schnell</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Schwärze personenbezogene Daten in deinen PDFs. Das alles ohne KI und in weniger als 5 Sekunden.
          </p>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Registriere dich um loszulegen.
          </p>
          {/* Login & Registrierung Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg">
                Registrieren
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg text-lg">
                Einloggen
              </Button>
            </Link>
          </div>
        </section>

        

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
          {[
            { title: "Automatische Texterkennung", desc: "Finde sensible Inhalte in Sekunden. Ohne KI.", icon: <CheckCircle className="text-blue-600 w-8 h-8" /> },
            { title: "100% Datenschutz", desc: "Nur die geschwärzte PDF wird für Maximal 24 Stunden gespeichert.", icon: <CheckCircle className="text-blue-600 w-8 h-8" /> },
            { title: "Kostenlos", desc: "Schwärze bis zu fünf PDF's am Tag.", icon: <CheckCircle className="text-blue-600 w-8 h-8" /> },
          ].map((feature, index) => (
            <Card key={index} className="p-6 flex flex-col items-center text-center shadow-md rounded-xl">
              {feature.icon}
              <h3 className="text-lg font-semibold mt-3">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.desc}</p>
            </Card>
          ))}
        </section>

        {/* PDF Upload Section */}
        <section className="">

        </section>

      </main>
  );
}

