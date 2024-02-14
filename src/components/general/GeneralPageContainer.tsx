"use client";

import AboutImage from "@/images/samplePic/generalSample.png";
import wineSamplePic from "@/images/samplePic/wine_pic_horizontal.png";
import Image from "next/image";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import "../../style/general-information/general-information.scss";

const GeneralPageContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <main className="wrapper generalPageMainLayOut">
      <ScrollToTopBtn />
      <h2 className="generalPageTitle"> General Page Title </h2>
      <p className="generalPageSubTitle">Subtitle demo subtitle demo</p>
      <article className="generalPageArticleContainer ">
        <p className="basicPTag pb-6">
          {translate("generalPage.p1")}
          <br />
          <br />
          {translate("generalPage.p2")}
        </p>
        <figure className="generalPagePictireContainer mb-7">
          <Image
            src={wineSamplePic}
            width={0}
            height={0}
            className="generalPagePicture"
            alt="wineSamplePic"
            placeholder="blur"
            loading="lazy"
          />
        </figure>
        <p className="basicPTag pb-6">
          {translate("generalPage.p1")}
          <br />
          <br />
          {translate("generalPage.p2")}
        </p>
        <p className=" basicPTag ">{translate("generalPage.p2")}</p>
        <figure className="generalPagePictireContainer my-7">
          <Image
            src={AboutImage}
            width={0}
            height={0}
            className="generalPagePicture"
            alt="About us, sen-ryo's store/ pic for mobile"
            placeholder="blur"
            loading="lazy"
          />
        </figure>
        <p className=" basicPTag pb-[4rem] xl:pb-[6rem] ">{translate("generalPage.p2")}</p>
      </article>
    </main>
  );
};

export default GeneralPageContainer;
