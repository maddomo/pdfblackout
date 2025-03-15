import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Footer from "./_components/footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import LanguageSwitcher from "./_components/cookieSwitcher";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const siteUrl = "https://pdfblackout.moritzfoglia.dev";

  return {
    title: "PDF Blackout - Securely Redact Personal Data",
    description: "Easily blackout sensitive data in PDFs without uploading them to a server. 100% privacy-focused PDF redaction tool.",
    keywords: "PDF blackout, redact PDF, remove personal data, PDF privacy, secure PDF tool",
    authors: [{ name: "Moritz Foglia", url: siteUrl }],
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: "PDF Blackout - Secure Redaction Tool",
      description: "Remove sensitive data from PDFs directly in your browser. No uploads, 100% private.",
      url: siteUrl,
      siteName: "PDF Blackout",
      images: [
        {
          url: "/og-image.jpg", // Make sure you have this image in your public folder
          width: 1200,
          height: 630,
          alt: "PDF Blackout Tool Screenshot",
        },
      ],
      type: "website",
      locale,
    },
    robots: "index, follow",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${GeistSans.variable}`}>
      <body>
        <NextIntlClientProvider>
          <LanguageSwitcher />
          {children}
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

