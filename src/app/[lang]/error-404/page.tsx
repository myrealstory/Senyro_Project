"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import "@/style/Maintenance-page/maintenancePage.scss";
import { useTranslation } from "@/app/i18n/client";

export default function Error404() {
  const path = usePathname();
  const lang = getLangFromString(path);
  const router = useRouter();
  const { translate } = useTranslation(lang);

  // setTimeout(() => {
  //   router.push(`/${lang}/index`);
  // }, 2000);

  return (
    <main className="errorPageMainContainer">
      <div className="errorPage404Container">
        <h4 className="">404</h4>
      </div>
      <div className="errorPageTextContainer ">
        <h5 className="">{translate("404.title")}</h5>
      </div>

      <button className="errorPageBtn" onClick={() => router.push(`/${lang}/index`)}>
        {translate("404.button")}
      </button>
    </main>
  );
}
