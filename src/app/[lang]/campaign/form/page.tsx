import React from "react";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/campagin/campagin.scss";
import { Metadata } from "next";
import CampaignFormContainer from "@/components/campaign/CampaignFormContainer";

export const metadata: Metadata = {
  title: "Campaign Form",
};

const page = ({ params }: { params: { lang: LocaleKeysType } }) => {
  return (
    <>
      <CampaignFormContainer lang={params.lang} />
    </>
  );
};

export default page;
