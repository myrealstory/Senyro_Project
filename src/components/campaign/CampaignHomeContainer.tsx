"use client";
import { LocaleKeysType } from "@/app/i18n";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import Image from "next/image";
import CaterPic1 from "@/images/event-cater-1.png";
import CaterPic2 from "@/images/event-cater-2.png";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import Link from "next/link";
import "@/style/campagin/campagin.scss";
import { useTranslation } from "@/app/i18n/client";

const CampaignHomeContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <>
      <ScrollToTopBtn />
      <main className="campaignMainContainer">
        <h1 className=" ">{translate("campaignPage.homePageTitle")}</h1>
        <p className="">{translate("campaignPage.homePageContent")}</p>
        <section className="">
          <div className="">
            <Image src={CaterPic1} alt="promotion" className="campaignImage" />
          </div>

          <div className="">
            <Image src={CaterPic2} alt="promotion" className="campaignImage" />
          </div>
        </section>

        <MobileButtonContainer>
          <Link href={"/campaign/form"} className="campaignBtnMobile">
            {translate("campaignPage.homePageCtaBtn")}
          </Link>
        </MobileButtonContainer>

        <Link href={"/campaign/form"} className="campaignBtnDesktop">
          {translate("campaignPage.homePageCtaBtn")}
        </Link>
      </main>
    </>
  );
};

export default CampaignHomeContainer;
