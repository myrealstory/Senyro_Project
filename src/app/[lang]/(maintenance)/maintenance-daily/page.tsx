"use client";

import Image from "next/image";
import geerWheels from "@/images/icons/TwoGearWheel.png";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import "@/style/Maintenance-page/maintenancePage.scss";

export default function MaintenancePageDaily() {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  return (
    <main className="maintenancePageMainContainer">
      {/* mb-64 xl:mb-[23.8125rem] */}
      <div className=" mx-6 mt-44  flex h-[20.18rem] w-[20.18rem] flex-col items-center justify-center text-center md:mt-[12rem] md:w-[30rem] lg:mt-[13rem]  xl:mt-[14.125rem] xl:w-[52.7rem]">
        <div className="maintenancePageIconContainer">
          <Image
            src={geerWheels}
            width={0}
            height={0}
            alt="geerWheelIcon"
            placeholder="blur"
            loading="lazy"
            className="maintenancePageIcon"
          />
        </div>

        <h1
          className={`
                        ${
                          lang === "tc"
                            ? "tracking-[6.5px] xl:tracking-[9.75px]"
                            : "tracking-[-0.4px] xl:tracking-[-0.6px]"
                        }`}
        >
          {translate("maintenancePage.title")}
        </h1>
        <div className="w-full">
          <p
            className={`maintenancePagePTag
                        ${lang === "tc" ? "font-semibold xl:hidden" : "font-medium xl:leading-[32px] "}`}
          >
            {translate("maintenancePage.dailyMaintaienceContent")}
          </p>

          {lang === "tc" && (
            <p className={"maintenancePagePTagTC"}>
              {translate("maintenancePage.dailyMaintaienceContent1")} <br />
              {translate("maintenancePage.dailyMaintaienceContent2")}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
