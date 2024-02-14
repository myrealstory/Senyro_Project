import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import "@/style/general-information/general-information.scss";
import ContactHomeContainer from "@/components/contact/ContactHomeContainer";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <>
      <ContactHomeContainer lang={params.lang} />
    </>
  );
}
