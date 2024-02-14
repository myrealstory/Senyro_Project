import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import "@/style/campagin/campagin.scss";
import CampaignSubmittedContainer from "@/components/campaign/CampaignSubmittedContainer";

export const metadata: Metadata = {
  title: "Campaign Submitted",
};

export default function CampaignSubmittedPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <>
      <CampaignSubmittedContainer lang={params.lang} />
    </>
  );
}
