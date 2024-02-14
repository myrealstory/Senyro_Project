"use client";

import Image from "next/image";
import geerWheels from "@/images/icons/TwoGearWheel.png";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import "@/style/Maintenance-page/maintenancePage.scss";

export default function MaintenancePage() {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  return (
    <main className="maintenancePageMainContainer">
      {/* mb-64 xl:mb-[23.8125rem] */}
      <div className="maintenancePageContentContainer">
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
            {translate("maintenancePage.content")}
          </p>

          {lang === "tc" && (
            <p className={"maintenancePagePTagTC"}>
              {translate("maintenancePage.content1")} <br />
              {translate("maintenancePage.content2")}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
