import Head from "next/head";

export default function Impressum() {
  return (
    <>
      <Head>
        <title>Impressum | Deine Webseite</title>
        <meta name="description" content="Impressum gemäß §5 TMG für die Web-App" />
      </Head>

      <main className="max-w-3xl mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">🏛️ Impressum</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Angaben gemäß § 5 TMG</h2>
          <p>
            <strong>Moritz Foglia</strong> <br />
            Leihgesterner Weg 36 <br />
            35392, Gießen <br />
            Deutschland
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Kontakt</h2>
          <p>
            📧 E-Mail: <a href="mailto:moritz-10@web.de" className="text-blue-500">moritz-10@web.de</a> <br />
            
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            <strong>Moritz Foglia</strong> <br />
            Leihgesterner Weg 36, 35392 Gießen <br />
            Deutschland
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Haftungsausschluss</h2>
          <p>
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
            Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-4">Letzte Aktualisierung: {new Date().toLocaleDateString()}</p>
      </main>
    </>
  );
}
