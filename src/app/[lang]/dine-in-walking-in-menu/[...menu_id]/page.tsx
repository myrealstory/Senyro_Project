"use client";

import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { Tags } from "@/components/member/Tags";
import { dineInMenu } from "@/constants/menu/dineInMenu";
import Image from "next/image";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";

export default function MenuDetailPage({ params }: { params: { menu_id: string; lang: LocaleKeysType } }) {
  const { translate } = useTranslation(params.lang);
  const targetDetails = dineInMenu.find(item => item.id.toString() === params.menu_id[0]);

  if (!targetDetails) {
    return <></>;
  }

  return (
    <main className="wrapper newsDetailPageMainContainer">
      <ScrollToTopBtn />
      <h1 className="">{translate("dineinMenu.title")}</h1>

      <article key={targetDetails.title} className="newsDetailPageOtterAriticle">
        <figure className="">
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
            newsDetailPageNewTag ${params.lang === "en" ? "w-[73.35px] " : "w-[65.26px] whitespace-nowrap"}
          `}
          >
            {translate("newsoffers.NEW")}
          </div>
          <Image
            src={targetDetails.image}
            width={0}
            height={0}
            alt="News"
            loading="lazy"
            placeholder="blur"
            sizes="100vw"
            blurDataURL={targetDetails.image}
            className="newsDetailPageImage"
          />
        </figure>
        <article className="newsDetailPageContentAriticle">
          <div className="newsDetailPageContentTitleContainer">
            <h2 className="">{`${params.lang === "en" ? targetDetails.title : targetDetails.titleTC}`}</h2>
            <h3 className="">{`${params.lang === "en" ? targetDetails.subtitle : targetDetails.subtitleTC}`}</h3>
          </div>
          <div className="newsDetailPageTagsContainer">
            <Tags tags={targetDetails.tags} lang={params.lang} path={"generalPage"} />
          </div>
          <div className="newsDetailPageContentPTagContainer">
            <p className="">{`${params.lang === "en" ? targetDetails.content : targetDetails.contentTC}`}</p>
            {/* <p className="">{targetDetails.content}</p> */}
          </div>

          <MobileButtonContainer>
            <button className="newsDetailPageBtnMobile">
              <a href="#" download={"#"}>
                {translate("dineInOrNews.download")}
              </a>
            </button>
          </MobileButtonContainer>

          <button className="newsDetailPageBtnDesktop">
            <a href="#" download={"#"}>
              {translate("dineInOrNews.download")}
            </a>
          </button>
        </article>
      </article>
    </main>
  );
}
