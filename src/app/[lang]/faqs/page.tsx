import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { FaqContainer } from "@/components/faq/FaqContainer";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";

export default function FAQs({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <main className=" FAQMainContainer">
      <ScrollToTopBtn />
      <h1 className="FAQMainTitle">{`${params.lang === "en" ? "FAQ" : "常見問題"}`}</h1>
      <FaqContainer lang={params.lang} />
    </main>
  );
}
