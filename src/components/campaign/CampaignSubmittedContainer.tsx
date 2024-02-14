"use client";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import Submitted from "@/images/icons/Icon_submitted.png";
import Link from "next/link";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/campagin/campagin.scss";

const CampaignSubmittedContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <main className="campaignSubmittedMainContainer">
      <h1 className="">{translate("campaignPage.homePageTitle")}</h1>
      <section className="wrapper">
        <div className=" campaignSubmittedWhiteBgDiv ">
          <div className="campaignSubmittedIconDiv">
            <Image
              src={Submitted}
              width={0}
              height={0}
              alt="You have submitted successfully"
              className="campaignSubmittedIcon"
            />
          </div>
          <article className={`campaignSubmittedContentContainer ${lang === "tc" ? "gap-4" : "gap-2"}`}>
            <h2 className="">{translate("campaignSubmitted.successfulSubmitted")}</h2>
            <p className="">
              {translate("campaignSubmitted.content")}
              <span className={`${lang === "tc" ? "block" : "hidden"}`}></span>
              {translate("campaignSubmitted.content2")}
            </p>
          </article>
          <MobileButtonContainer>
            <Link href={`/${lang}/index`} className="campaignSubmittedBtnMobile">
              {translate("campaignSubmitted.backToHome")}
            </Link>
          </MobileButtonContainer>
          <Link href={`/${lang}/index`} className="campaignSubmittedBtnDesktop">
            {translate("campaignSubmitted.backToHome")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default CampaignSubmittedContainer;
