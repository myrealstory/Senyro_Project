"use client";

import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { Tags } from "@/components/member/Tags";
import { dineInMenu } from "@/constants/menu/dineInMenu";
import Image from "next/image";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import videoPlaceHolder from "@/images/samplePic/video_Placeholder.png";

export default function NewsPage({ params }: { params: { lang: LocaleKeysType } }) {
  const { translate } = useTranslation(params.lang);
  const targetDetails = dineInMenu.find(item => item.id.toString() === "1");

  if (!targetDetails) {
    return <></>;
  }

  return (
    <main className="wrapper w-full pb-14 pt-3 md:pb-14 md:pt-7 xl:py-14 xl:pb-[4rem] 2xl:pb-[4.5rem]">
      <ScrollToTopBtn />
      <h1 className="block pb-3 text-center text-[22px] font-semibold md:text-[40px] ">
        {translate("newsoffers.title")}
      </h1>
      <article key={targetDetails.title} className="flex flex-col justify-center gap-5 md:gap-11">
        <div className="flex w-full justify-center">
          <figure className="relative max-h-[625px] max-w-[1110px]  ">
            <div
              style={{
                lineHeight: "26.25px",
                fontSize: 17,
                letterSpacing: "-2%",
                paddingLeft: "15.75px",
                paddingRight: "15.75px",
              }}
              className={`
                ${targetDetails.isNew ? "opacity-100" : "opacity-[0.00001]"}
                newsDetailPageNewTag  ${params.lang === "en" ? "w-[73.35px] " : "w-[65.26px] whitespace-nowrap"}
                `}
            >
              {translate("newsoffers.NEW")}
            </div>
            <Image
              src={videoPlaceHolder}
              width={0}
              height={0}
              alt="News"
              loading="lazy"
              placeholder="blur"
              blurDataURL={targetDetails.image}
              className="h-full w-full object-cover shadow-lg"
            />
          </figure>
        </div>
        <article className="mt-7 flex flex-col items-center justify-center gap-3 md:mt-0">
          <div className="newsDetailPageContentTitleContainer">
            <h2 className=""> {`${params.lang === "en" ? targetDetails.title : targetDetails.titleTC}`}</h2>
            <h3 className="">{`${params.lang === "en" ? targetDetails.subtitle : targetDetails.subtitleTC}`}</h3>
          </div>
          <div className="flex w-full justify-center gap-2 py-[10px] ">
            <Tags tags={targetDetails.tags} lang={params.lang} path={"generalPage"} />
          </div>
          <div className="flex max-w-[1110px] flex-col  gap-7">
            <p className="2xl:leading-9; text-[14px] font-normal leading-5 sm:leading-7 md:leading-5 lg:text-[18px] lg:leading-7 xl:leading-8 2xl:text-[22px]">{`${
              params.lang === "en" ? targetDetails.content : targetDetails.contentTC
            }`}</p>

            <p className="2xl:leading-9; text-[14px] font-normal leading-5 sm:leading-7 md:leading-5 lg:text-[18px] lg:leading-7 xl:leading-8 2xl:text-[22px]">{`${
              params.lang === "en" ? targetDetails.content : targetDetails.contentTC
            }`}</p>
            {/* <p className="">{targetDetails.content}</p> */}
          </div>

          <MobileButtonContainer>
            <button className="newsDetailPageBtnMobile ">{translate("newsoffers.learnMore")}</button>
          </MobileButtonContainer>

          <button
            className=" hidden h-[68px] w-full items-center justify-center rounded-full bg-primaryGold py-3 text-[16px] leading-5 text-white 
                      md:mt-8 md:flex md:w-[200px] md:justify-center md:font-medium lg:w-[300px] lg:text-[22px]"
          >
            {translate("newsoffers.learnMore")}
          </button>
        </article>
      </article>
    </main>
  );
}
