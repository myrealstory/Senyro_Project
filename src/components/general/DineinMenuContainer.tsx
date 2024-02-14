"use client";
import { dineInMenu } from "@/constants/menu/dineInMenu";
import deliveroo from "@/images/icons/Deliveroo.png";
import Image from "next/image";
import { CarouselDineIn } from "@/components/carousel/CarouselDineIn";
import { LocaleKeysType } from "@/app/i18n";
import { ScrollToTopBtn } from "@/components/ScrollToTopBtn";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { useGetPromotinoalMsgDineInQuery } from "@/redux/api/generalApi";

const DineinMenuContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  const { data: promotionalMsgData, isSuccess: isPromotionalMsgSuccess } = useGetPromotinoalMsgDineInQuery({ lang });
  const promotionalMsg = promotionalMsgData?.data.message[0];
  return (
    <>
      <main className="menuPageMainContainer">
        <ScrollToTopBtn />
        <h1 className="menuPageH1">{translate("dineinMenu.title")}</h1>
        <div className="px-[30px]">
          <div className="NewsOffersPromotionBarContainer wrapper">
            {isPromotionalMsgSuccess && promotionalMsg && (
              <p className="" dangerouslySetInnerHTML={{ __html: promotionalMsg as string }}></p>
            )}
          </div>
        </div>
        <CarouselDineIn slides={dineInMenu} lang={lang} page={"dine-in-walking-in-menu"} />
      </main>
      <div className="menuPageDeliverServiceSection">
        <div>
          <h3 className="">{translate("dineinMenu.popupTitle")}</h3>
          {/* <h4 className="">Subtitle demo subtitle demo</h4> */}
        </div>
        <p className="">{translate("dineinMenu.deliverContent")}</p>
        <button className="menuPageDeliverServiceBtn">
          <Image
            src={deliveroo}
            alt="deliveroo"
            width={160}
            height={43}
            sizes="100vw"
            className="menuPageDeliverServiceIcon"
          />
        </button>
      </div>
    </>
  );
};

export default DineinMenuContainer;
