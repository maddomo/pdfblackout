/* eslint-disable  */
import Head from "next/head";
import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <>
      <Head>
        <title>{t("privacyPolicy")} | Deine Webseite</title>
        <meta name="description" content={t("generalProcessingDesc")} />
      </Head>

      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{t("privacyPolicy")}</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("responsibleTitle")}</h2>
          <p>{t("responsibleDesc")}</p>
          <p>
            <strong>{t("name")}</strong> <br />
            {t("address")} <br />
            <a href="mailto:moritz-10@web.de" className="text-blue-500">
              {t("email", { email: "moritz-10@web.de" })}
            </a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("generalProcessingTitle")}</h2>
          <p>{t("generalProcessingDesc")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("fileProcessingTitle")}</h2>
          <ul className="list-disc list-inside">
            {t.raw("fileProcessingDesc").map((desc: string, index: number) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("legalBasisTitle")}</h2>
          <p>{t("legalBasisDesc")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("cookiesTrackingTitle")}</h2>
          <p>{t("cookiesTrackingDesc")}</p>
          <ul className="list-disc list-inside">
            {t.raw("cookiesTrackingList").map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("userRightsTitle")}</h2>
          <p>{t("userRightsDesc")}</p>
          <ul className="list-disc list-inside">
            {t.raw("userRightsList").map((right: string, index: number) => (
              <li key={index}>{right}</li>
            ))}
          </ul>
          <p>
            {t("contactUs", { email: "moritz-10@web.de" })}
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{t("changesTitle")}</h2>
          <p>{t("changesDesc")}</p>
        </section>

        <p className="text-sm text-gray-500 mt-4">
          {t("lastUpdated", { date: new Date().toLocaleDateString() })}
        </p>
      </main>
    </>
  );
}

