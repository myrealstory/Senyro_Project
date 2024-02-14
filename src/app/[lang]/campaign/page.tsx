import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import "@/style/campagin/campagin.scss";
import CampaignHomeContainer from "@/components/campaign/CampaignHomeContainer";

export const metadata: Metadata = {
  title: "Events & Catering",
};

export default function CampaignPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <>
      <CampaignHomeContainer lang={params.lang} />
    </>
  );
}
