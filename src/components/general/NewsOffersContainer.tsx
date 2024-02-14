"use client";
import { LocaleKeysType } from "@/app/i18n";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import { Carousel } from "@/components/carousel/Carousel";
// import { dineInMenu } from "@/constants/menu/dineInMenu";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { useGetNewsListQuery, useGetPromotinoalMsgNewsQuery } from "@/redux/api/generalApi";
import { NewsOffersListType } from "@/types/api/apiTypes";

const NewsOffersContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  const { data: newsData, isSuccess: isNewsListSuceess } = useGetNewsListQuery({ lang });
  const { data: promotionalMsgData, isSuccess: isPromotionalMsgSuccess } = useGetPromotinoalMsgNewsQuery({ lang });
  const promotionalMsg = promotionalMsgData?.data.message[0];

  return (
    <main className="NewsOffersPageMainContainer">
      <ScrollToTopBtn />
      <h1 className="NewsOffersPageH1">{translate("newsoffers.title")}</h1>
      {isPromotionalMsgSuccess && promotionalMsg && (
        <div className="px-[30px]">
          <div className="NewsOffersPromotionBarContainer wrapper">
            <p className="" dangerouslySetInnerHTML={{ __html: promotionalMsg as string }}></p>
          </div>
        </div>
      )}
      {isNewsListSuceess && newsData.data.length > 0 && (
        <Carousel slides={newsData?.data as NewsOffersListType[]} lang={lang} page={"news-offers"} />
      )}
    </main>
  );
};

export default NewsOffersContainer;
