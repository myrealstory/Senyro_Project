import Image from "next/image";
import faqIcon from "@/images/icons/Icon_faq-black.png";
import faqDetailsEN from "@/images/membership/Remarks_EN_NO_ BG@3x.png";
import faqDetailsTC from "@/images/membership/Remarks_TC_NO_BG@3x.png";
import { LocaleKeysType } from "@/app/i18n";

import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";

export const FaqsCard = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);
  const getImageSrc = (lang: LocaleKeysType) => {
    const images = {
      en: faqDetailsEN,
      tc: faqDetailsTC,
    };

    return images[lang];
  };

  const getImageAlt = (lang: LocaleKeysType) => {
    const alts = {
      en: "Remarks",
      tc: "備註",
    };

    return alts[lang];
  };
  return (
    <div id="faqs">
      <div id="faq" className="memberUpgradePrivilegesTitles">
        <Image src={faqIcon} width={0} height={0} alt="icon" className="" />
        <h2>{t("membershipProgram.details")}</h2>
      </div>
      <div>
        <Image src={getImageSrc(lang)} width={0} height={0} alt={getImageAlt(lang)} className="h-auto w-full" />
      </div>
    </div>
  );
};
