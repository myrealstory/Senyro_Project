"use client";

import { OpeningTimeREMAPPED } from "@/types/api/store";
import { useTranslation } from "@/app/i18n/client";
import "@/style/general-information/general-information.scss";
import { getLangFromString } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";

export const TimeTable = ({ openingHours }: { openingHours: OpeningTimeREMAPPED }) => {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate: t } = useTranslation(lang);
  return (
    <div className="StoreLocationTimeTableContainer">
      <div className="StoreLocationTimeTableContainertbody w-full">
        {Object.keys(openingHours).map((day, index) => (
          <div key={index} className="StoreLocationTimeTableContainertr">
            <div className=" StoreLocationTimeTableContainerth">{day}</div>
            <div
              className={`StoreLocationTimeTableContainertd ${
                openingHours[day] === "" ? "w-[68px] text-center lg:w-[95px]" : "text-left"
              }`}
            >
              {openingHours[day] === "" ? t("storeLocator.closed") : openingHours[day]?.replace("-", " - ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
