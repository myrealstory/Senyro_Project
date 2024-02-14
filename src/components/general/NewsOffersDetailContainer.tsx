"use client";

import { useEffect, useState } from "react";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { Tags } from "@/components/member/Tags";
import Image from "next/image";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { NewsOffersListDetailType } from "@/types/api/apiTypes";

const NewsOffersDetailContainer = ({
  newsDetail,
  lang,
}: {
  newsDetail: NewsOffersListDetailType;
  lang: LocaleKeysType;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { translate } = useTranslation(lang);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  console.log("newsDetail", newsDetail);

  const RenderIfImage = () => {
    return (
      <main className="wrapper newsDetailPageMainContainer">
        <ScrollToTopBtn />
        <h1 className="">{translate("newsoffers.title")}</h1>
        <article key={newsDetail?.title} className="newsDetailPageOtterAriticle">
          <figure>
            <div
              style={{
                lineHeight: "26.25px",
                fontSize: 17,
                letterSpacing: "-2%",
                paddingLeft: "15.75px",
                paddingRight: "15.75px",
              }}
              className={`
                  ${newsDetail?.isNew ? "opacity-100" : "opacity-[0.00001]"}
                  newsDetailPageNewTag  ${lang === "en" ? "w-[73.35px] " : "w-[65.26px] whitespace-nowrap"}
                `}
            >
              {translate("newsoffers.NEW")}
            </div>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsDetail?.image as string}`}
              width={0}
              height={0}
              alt={newsDetail?.thumbnailAlt as string}
              loading="lazy"
              placeholder="blur"
              sizes="100vw"
              blurDataURL={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsDetail?.image as string}`}
              className="newsDetailPageImage"
            />
          </figure>
          <article className="newsDetailPageContentAriticle">
            <div className="newsDetailPageContentTitleContainer">
              <h2 className=""> {`${newsDetail?.title}`}</h2>
              <h3 className="">{`${newsDetail?.subtitle}`}</h3>
            </div>
            <div className="newsDetailPageTagsContainer">
              <Tags tags={newsDetail?.tags} lang={lang} />
            </div>
            <div className="newsDetailPageContentPTagContainer">
              {/* <p className="">{`${newsDetailData.data.description }`}</p> */}
              <p className="" dangerouslySetInnerHTML={{ __html: newsDetail?.description as string }}></p>
              {/* <p className="">{targetDetails.content}</p> */}
            </div>
            {newsDetail?.ctaButtonName && newsDetail?.ctaUrl && (
              <MobileButtonContainer>
                <button
                  className="newsDetailPageBtnMobile "
                  onClick={() => router.push(newsDetail?.ctaUrl as string)}
                >{`${newsDetail?.ctaButtonName}`}</button>
              </MobileButtonContainer>
            )}
            {newsDetail?.ctaButtonName && newsDetail?.ctaUrl && (
              <a
                className=" newsDetailPageBtnDesktop "
                href={newsDetail?.ctaUrl}
                target={newsDetail.ctaUrlNewTab ? "_blank" : "_self"}
              >{`${newsDetail?.ctaButtonName}`}</a>
            )}
          </article>
        </article>
      </main>
    );
  };

  const RenderIfVideo = () => {
    return (
      <main className="wrapper w-full pb-14 pt-3 md:pb-14 md:pt-7 xl:py-14 xl:pb-[4rem] 2xl:pb-[4.5rem]">
        <ScrollToTopBtn />
        <h1 className="block pb-3 text-center text-[22px] font-semibold md:text-[40px] ">
          {translate("newsoffers.title")}
        </h1>
        <article key={newsDetail?.title} className="flex flex-col justify-center gap-5 md:gap-11">
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
                    ${newsDetail?.isNew ? "opacity-100" : "opacity-[0.00001]"}
                    newsDetailPageNewTag  ${lang === "en" ? "w-[73.35px] " : "w-[65.26px] whitespace-nowrap"}
                    `}
              >
                {translate("newsoffers.NEW")}
              </div>
              {/* todo: make here to be <iframe> to embed yt link */}
              <Image
                src={newsDetail?.thumbnail as string}
                width={0}
                height={0}
                alt="News"
                loading="lazy"
                placeholder="blur"
                blurDataURL={newsDetail?.thumbnail as string}
                className="h-full w-full object-cover shadow-lg"
              />
            </figure>
          </div>
          <article className="mt-7 flex flex-col items-center justify-center gap-3 md:mt-0">
            <div className="newsDetailPageContentTitleContainer">
              <h2 className=""> {`${newsDetail?.title}`}</h2>
              <h3 className="">{`${newsDetail?.subtitle}`}</h3>
            </div>
            <div className="flex w-full justify-center gap-2 py-[10px] ">
              <Tags tags={newsDetail?.tags} lang={lang} path={"generalPage"} />
            </div>
            <div className="flex max-w-[1110px] flex-col  gap-7">
              <p className="" dangerouslySetInnerHTML={{ __html: newsDetail?.description as string }}></p>
            </div>
            {newsDetail?.ctaButtonName && newsDetail?.ctaUrl && (
              <MobileButtonContainer>
                <button className="newsDetailPageBtnMobile " onClick={() => router.push(newsDetail?.ctaUrl as string)}>
                  {`${newsDetail?.ctaButtonName}`}
                </button>
              </MobileButtonContainer>
            )}
            {newsDetail?.ctaButtonName && newsDetail?.ctaUrl && (
              <a
                className=" hidden h-[68px] w-full items-center justify-center rounded-full bg-primaryGold py-3 text-[16px] leading-5 text-white 
                            md:mt-8 md:flex md:w-[200px] md:justify-center md:font-medium lg:w-[300px] lg:text-[22px]"
                // onClick={() => {
                //   if (newsDetail.ctaUrlNewTab) {
                //     window.
                //     router.push(newsDetail?.ctaUrl as string)
                //   }
                //   router.push(newsDetail?.ctaUrl as string)
                // }}
                href={newsDetail?.ctaUrl}
                target={newsDetail.ctaUrlNewTab ? "_blank" : "_self"}
              >
                {`${newsDetail?.ctaButtonName}`}
              </a>
            )}
          </article>
        </article>
      </main>
    );
  };

  const defaltRender = () => {
    if (newsDetail?.youtubeLink && !newsDetail?.image) {
      return RenderIfVideo();
    } else {
      return RenderIfImage();
    }
  };

  return <>{defaltRender()}</>;
};

export default NewsOffersDetailContainer;
