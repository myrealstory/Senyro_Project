import { mockTerms } from "@/app/mock/mockTerms";
import { TermsCard } from "@/components/terms/TermsCard";
import { Metadata } from "next";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsAndConditions({}: { params: { lang: LocaleKeysType } }) {
  return (
    <main className="TermsAndConditionsMainContainer wrapper">
      {mockTerms.map(items => (
        <TermsCard key={items.id} {...items} />
      ))}
    </main>
  );
}
