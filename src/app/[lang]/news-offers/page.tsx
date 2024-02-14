import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import "@/style/general-information/general-information.scss";
import NewsOffersContainer from "@/components/general/NewsOffersContainer";

export const metadata: Metadata = {
  title: "News & Offers",
};

export default function NewsOffersPage({ params }: { params: { lang: LocaleKeysType } }) {
  return <NewsOffersContainer lang={params.lang} />;
}
