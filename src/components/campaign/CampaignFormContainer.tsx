"use client";
import { useTranslation } from "@/app/i18n/client";
import React from "react";
// import { EnquiryForm } from "@/components/campaign/EnquiryForm";
import { LocaleKeysType } from "@/app/i18n";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { CampaignForm } from "@/components/campaign/CampaignForm";
import "@/style/campagin/campagin.scss";

const CampaignFormContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <>
      <ScrollToTopBtn />
      <main className="campaignFormMainContainer">
        <h1 className="">{translate("campaignPage.homePageTitle")}</h1>
        <div className="campaignFormWhiteBGContainer">
          <div className="campaignFormContentContainer">
            <h2 className="">{translate("campaignPage.title")}</h2>
            <p className="campaignFormWhiteBgP1">{translate("campaignPage.content")}</p>
            {/* <p className="campaignFormWhiteBgP2">
              Should you have any enquiry, <span className="block"> </span>
              please contact us.
            </p> */}
          </div>
          <CampaignForm lang={lang} />
        </div>
      </main>
    </>
  );
};

export default CampaignFormContainer;
