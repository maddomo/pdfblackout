import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Footer from "./_components/footer";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale} from 'next-intl/server';
import LanguageSwitcher from "./_components/cookieSwitcher";

export const metadata: Metadata = {
  title: "PDF Blackout",
  description: "Blacksout personal data from PDFs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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
