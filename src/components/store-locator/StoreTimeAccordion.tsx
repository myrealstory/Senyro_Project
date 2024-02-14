import Image from "next/image";
import Chevron from "@/images/icons/Icon_Chevron-gold@3x.png";
// import Opening from "@/images/icons/Icon_time.png";
import { TimeTable } from "./TimeTable";
import { OpeningTime } from "@/types/api/store";
import moment from "moment";
import { useTranslation } from "@/app/i18n/client";
import { getLangFromString } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";
import "@/style/general-information/general-information.scss";

export const StoreTimeAccordion = ({
  isOpen,
  openingHours,
  openTimeTable,
  handleOpenTimeTable,
}: {
  isOpen: boolean;
  openingHours: OpeningTime;
  openTimeTable: boolean;
  handleOpenTimeTable: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const today = moment().format("dddd");
  // console.log(today,"today")
  // console.log(openingHours,"openingHours")
  // console.log(openTimeTable,"openTimeTable")

  const openingHoursRemapped = {
    [translate("storeLocator.Monday")]: openingHours["Monday"],
    [translate("storeLocator.Tuesday")]: openingHours["Tuesday"],
    [translate("storeLocator.Wednesday")]: openingHours["Wednesday"],
    [translate("storeLocator.Thursday")]: openingHours["Thursday"],
    [translate("storeLocator.Friday")]: openingHours["Friday"],
    [translate("storeLocator.Saturday")]: openingHours["Saturday"],
    [translate("storeLocator.Sunday")]: openingHours["Sunday"],
  };

  const getTodayOpeningHours = (dddd: string) => {
    switch (dddd) {
      case "Monday":
        return openingHours.Monday;
      case "Tuesday":
        return openingHours.Tuesday;
      case "Wednesday":
        return openingHours.Wednesday;
      case "Thursday":
        return openingHours.Thursday;
      case "Friday":
        return openingHours.Friday;
      case "Saturday":
        return openingHours.Saturday;
      case "Sunday":
        return openingHours.Sunday;
    }
  };
  // disabled={isOpen === true ? false : true}
  return (
    <>
      <section className="StoreTimeAccordionInnerSectionContainer">
        {/* indicate box for close or open */}
        <div className={`StoreTimeAccordionColorBoxContainer ${isOpen === true ? "bg-primaryGold" : "bg-[#818181]"}`}>
          <span
            className={`StoreTimeAccordionColorBoxCircle ${isOpen === true ? "bg-[#FAE18C]" : "bg-[#D9D9D9]"}`}
          ></span>
          <span
            className={`text-[12px] font-semibold leading-[12.106px] lg:text-[11px] lg:leading-[10px] lg:tracking-[1px] ${
              isOpen === true ? "text-secondaryLightGold2" : " text-primaryGold05"
            }`}
          >
            {isOpen === true ? `${translate("storeLocator.openNow")}` : `${translate("storeLocator.closeNow")}`}
          </span>
        </div>

        <div className=" flex w-[67%]">
          <div className="StoreTimeAccordionToggleDiv">
            {/* <Image src={Opening} width={0} height={0} alt="Opening" className="StoreTimeAccordionClockIcon" /> */}

            <span className="">{getTodayOpeningHours(today)?.replace("-", " - ")}</span>
            <button onClick={handleOpenTimeTable} className="z-[39] lg:ml-3">
              <Image
                src={Chevron}
                width={0}
                height={0}
                alt="Click to open timeline"
                className={`h-auto w-[15px]  self-center ${openTimeTable && "rotate-180"}`}
              />
            </button>
          </div>
        </div>
      </section>
      {openTimeTable === true && (
        <div className="StoreTimeAccordionTimeTableOutterDiv">
          <TimeTable openingHours={openingHoursRemapped} />
        </div>
      )}
    </>
  );
};
