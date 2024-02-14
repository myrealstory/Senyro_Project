import Image from "next/image";
import IconUpArrow from "@/images/icons/Arrow - Right Circle.png";
import IconBell from "@/images/icons/IconBellr-withGoldBG.png";
import IconChefHat from "@/images/icons/IconChefCap-withGoldBG.png";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";

export const CareerPathCard = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <section className="flex items-center justify-center">
      {/* left side - manager */}
      <div className="w-[623px] max-w-full">
        <div className="flex gap-5 lg:gap-10 ">
          <div className="CareerPathCardTextHalfContainerDiv">
            <div className="flex flex-col ">
              <Image width={0} height={0} src={IconBell} className="CareerPathCardBigIcon" alt={"IconBell"} />

              <div className="mt-5 flex w-full max-w-full flex-col items-center self-center">
                <div className="CareerPathCardTextTopContainerDiv bg-primaryGold4 ">
                  <p className="mb-0 ml-0.5">{translate("CareerPathCard.DistrictManager")}</p>
                </div>

                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />

                <div className="CareerPathCardTextLeftContainerDiv py-7">
                  <p className="mb-0 ml-px mt-0.5 justify-center ">{translate("CareerPathCard.ShopManager")}</p>
                </div>

                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />

                <div className="CareerPathCardTextLeftContainerDiv py-3.5">
                  <p className="-mb-0.5 mt-0.5 ">{translate("CareerPathCard.AssistantShopManager")}</p>
                </div>

                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />

                <div className="CareerPathCardTextLeftContainerDiv py-7">
                  <p className=" mb-0 ml-px mt-0.5 justify-center ">{translate("CareerPathCard.Supervisor")}</p>
                </div>

                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />

                <div className="CareerPathCardTextLeftContainerDiv py-8">
                  <p className="ml-px">{translate("CareerPathCard.Server")}</p>
                </div>
              </div>
            </div>
          </div>
          {/* right side -- chef */}
          <div className="CareerPathCardTextHalfContainerDiv">
            <div className="flex flex-col ">
              <Image width={0} height={0} src={IconChefHat} className="CareerPathCardBigIcon" alt={"IconChefHat"} />
              <div className="mt-5 flex w-full max-w-full flex-col items-center self-center">
                <div className="CareerPathCardTextTopContainerDiv bg-primaryGold">
                  <p className="mb-0 ml-0.5  ">{translate("CareerPathCard.KitchenDistrictManager")}</p>
                </div>
                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />
                <div className="CareerPathCardTextRightContainerDiv py-7">
                  <p className="mb-0 ml-px mt-0.5 ">{translate("CareerPathCard.KitchenManager")}</p>
                </div>
                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />
                <div className="CareerPathCardTextRightContainerDiv py-3.5">
                  <p className="-mb-0.5 mt-0.5">{translate("CareerPathCard.AssistantKitchenManager")}</p>
                </div>
                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />
                <div className="CareerPathCardTextRightContainerDiv py-7">
                  <p className="mb-0 ml-px mt-0.5 ">{translate("CareerPathCard.KitchenSupervisor")}</p>
                </div>
                <Image width={0} height={0} src={IconUpArrow} className="CareerPathCardArrowIcon" alt={"IconUpArrow"} />
                <div className="CareerPathCardTextRightContainerDiv py-8">
                  <p className="-mt-px ml-px">{translate("CareerPathCard.Cook")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
