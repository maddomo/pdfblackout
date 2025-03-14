
import { Card} from "~/components/ui/card";
import { CheckCircle } from "lucide-react";
import PDFUploadForm from "~/app/_components/pdf/pdfupload";
import { useTranslations } from 'next-intl';
export default function Landing() {
  const t = useTranslations("HomePage");
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
        
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
            {t("title")} <span className="text-blue-600">{t("title2")}</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          
        </section>

        

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
          {[
            { title: t("boxtitle1"), desc: t("boxbody1"), icon: <CheckCircle className="text-blue-600 w-8 h-8" /> },
            { title: t("boxtitle2"), desc: t("boxbody2"), icon: <CheckCircle className="text-blue-600 w-8 h-8" /> },
            { title: t("boxtitle3"), desc: t("boxbody3"), icon: <CheckCircle className="text-blue-600 w-8 h-8" /> },            
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
          <PDFUploadForm />
        </section>

      </main>
  );
}

