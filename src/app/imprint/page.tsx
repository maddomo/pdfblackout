import Head from "next/head";

import { useTranslations } from "next-intl";

export default function Imprint() {
  const t = useTranslations("imprint");

  return (
    <>
      <Head>
        <title>{t("title")} | Deine Webseite</title>
        <meta name="description" content={t("metaDescription")} />
      </Head>

      <main className="max-w-3xl mx-auto p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("section1Title")}</h2>
          <p>
            <strong>{t("name")}</strong> <br />
            {t("address")} <br />
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("section2Title")}</h2>
          <p>
            📧{" "}
            <a href="mailto:moritz-10@web.de" className="text-blue-500">
              {t("email", { email: "moritz-10@web.de" })}
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("section3Title")}</h2>
          <p>
            <strong>{t("name")}</strong> <br />
            {t("address")}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("section4Title")}</h2>
          <p>{t("section4Desc")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("section5Title")}</h2>
          <p>
            {t("section5Desc")}{" "}
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

        <p className="text-sm text-gray-500 mt-4">
          {t("lastUpdated", { date: new Date().toLocaleDateString() })}
        </p>
      </main>
    </>
  );
}
