import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung | Deine Webseite</title>
        <meta name="description" content="Datenschutzerklärung für die Nutzung der Web-App" />
      </Head>

      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">📜 Datenschutzerklärung</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p>
            <strong>Moritz Foglia</strong> <br />
            Leihgesterner Weg 36 35392 Gießen, Deutschland <br />
            E-Mail: <a href="mailto:moritz-10@web.de" className="text-blue-500">moritz-10@web.de</a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
          <p>
            Diese Web-App speichert oder verarbeitet keine personenbezogenen Daten auf Servern.
            Alle hochgeladenen PDFs werden lokal im Browser verarbeitet und nicht an externe Server gesendet.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Verarbeitung von Dateien (PDFs)</h2>
          <p>
            - Die hochgeladenen PDFs werden nur im Browser bearbeitet. <br />
            - Es erfolgt keine Speicherung auf unseren Servern. <br />
            - Nach der Verarbeitung kann die Datei heruntergeladen werden, danach wird sie nicht weiter gespeichert.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Rechtsgrundlage gemäß DSGVO</h2>
          <p>
            Da keine personenbezogenen Daten gespeichert werden, ist die DSGVO nur begrenzt anwendbar.
            Falls du uns per E-Mail kontaktierst, erfolgt die Verarbeitung deiner Daten gemäß
            <strong> Art. 6 Abs. 1 lit. f DSGVO </strong> (berechtigtes Interesse zur Beantwortung von Anfragen).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Verwendung von Cookies und Tracking</h2>
          <p>Diese Web-App:</p>
          <ul className="list-disc list-inside">
            <li>✅ Verwendet keine Cookies</li>
            <li>✅ Setzt kein Tracking oder Analyse-Tools (z. B. Google Analytics) ein</li>
            <li>✅ Speichert keine IP-Adressen oder andere Nutzerdaten</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Deine Rechte gemäß DSGVO</h2>
          <p>Als Nutzer hast du folgende Rechte:</p>
          <ul className="list-disc list-inside">
            <li>📩 <strong>Auskunftsrecht</strong> (Art. 15 DSGVO) – Welche Daten werden gespeichert? (Keine)</li>
            <li>❌ <strong>Recht auf Löschung</strong> (Art. 17 DSGVO) – Da keine Daten gespeichert werden, ist dies nicht notwendig.</li>
            <li>🚫 <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) – Nicht erforderlich, da kein Tracking oder Speicherung erfolgt.</li>
          </ul>
          <p>
            Falls du Fragen hast, kontaktiere uns unter
            <a href="mailto:moritz-10@web.de" className="text-blue-500"> moritz-10@web.de </a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Diese Datenschutzerklärung kann jederzeit aktualisiert werden.
            Die aktuelle Version ist immer unter <strong>/privacy</strong> verfügbar.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-4">Letzte Aktualisierung: {new Date().toLocaleDateString()}</p>
      </main>
    </>
  );
}
