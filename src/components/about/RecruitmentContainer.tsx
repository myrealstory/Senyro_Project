"use client";
import React from "react";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import Image from "next/image";
import Link from "next/link";
import { LocaleKeysType } from "@/app/i18n";
import IconPhone from "@/images/icons/WhatsApp.png";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";

const RecruitmentContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);

  return (
    <main className="wrapper jobApplicationMainContainer">
      <article className="">
        <h1 className="">{translate("jobApplication.jobApplication")}</h1>
        <p className="">
          {translate("jobApplication.contentBeforeNumber")}
          <span className="text-primaryGold">
            <a href="tel:852-9449-6777">9449 6777</a>
          </span>
          {translate("jobApplication.contentTcComma")}
          <span className={`${lang === "tc" && "xl:block"}`}></span>
          {translate("jobApplication.contentAfterNumber")}
        </p>

        <span className="jobApplicationPrivacySpan"> {translate("jobApplication.contentForPrivacy")}</span>

        <MobileButtonContainer>
          <Link href={`/${lang}/index`} className="jobApplicationBtnCommonClass flex gap-3">
            <Image width={0} height={0} src={IconPhone} className="jobApplicationIcon" alt={"IconPhone"} />
            {translate("jobApplication.CTABtn")}
          </Link>
        </MobileButtonContainer>

        <Link href={`/${lang}/index`} className="jobApplicationBtnDesktop">
          <Image width={0} height={0} src={IconPhone} className="jobApplicationIcon" alt={"IconPhone"} />
          {translate("jobApplication.CTABtn")}
        </Link>
      </article>
    </main>
  );
};

export default RecruitmentContainer;
