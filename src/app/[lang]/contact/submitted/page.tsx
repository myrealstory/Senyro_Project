import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import ContactSubmittedContainer from "@/components/contact/ContactSubmittedContainer";

export const metadata: Metadata = {
  title: "Thank you for contacting us",
};

export default function ContactSubmittedPage({ params }: { params: { lang: LocaleKeysType } }) {
  return <ContactSubmittedContainer lang={params.lang} />;
}
