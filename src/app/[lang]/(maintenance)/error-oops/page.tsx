"use client";

import Image from "next/image";
import oopsIcon from "@/images/icons/Icon-Oops.png";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import "@/style/Maintenance-page/maintenancePage.scss";

export default function ErrorOops() {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <main className="oopsPageMainContainer">
      <div className="oopsContentContainer">
        <div className="oopsPageIconContainer">
          <Image
            src={oopsIcon}
            width={0}
            height={0}
            alt="oopsIcon"
            placeholder="blur"
            loading="lazy"
            className="oopsContentIcon"
          />
        </div>

        <h5> Oops... </h5>
        <div className="h-auto w-full">
          <p
            className={`
                              ${lang === "tc" ? "oopsPTagConditionalTC" : "oopsPTagConditionalEN"}`}
          >
            {lang === "tc" &&
              `很抱歉，網頁發生錯誤。   
                      煩請刷新此頁或於稍後時間再瀏覽本網站，   
                      不便之處，敬請原諒！ 
                  `}

            {lang === "en" &&
              `Sorry, something went wrong.
                      Please try refreshing the page or visit us later.
                      `}
          </p>
        </div>
        <button
          className={`oopsPageBtnEn
                          ${lang === "tc" ? "xl:hidden" : ""}`}
          onClick={handleGoBack}
        >
          {translate("oops.button")}
        </button>

        {lang === "tc" && (
          <button className="oopsPageBtnTc" onClick={handleGoBack}>
            刷新頁面
          </button>
        )}
      </div>
    </main>
  );
}
