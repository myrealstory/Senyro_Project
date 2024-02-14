import Image from "next/image";
import ElitePrivilegeEN from "@/images/membership/Member_privilege_Elite_EN.png";
import ElitePrivilegeTC from "@/images/membership/Member_privilege_Elite_TC.png";
import PrestigePrivilegeEN from "@/images/membership/Member_privilege_Prestige_EN.png";
import PrestigePrivilegeTC from "@/images/membership/Member_privilege_Prestige_TC.png";
import { LocaleKeysType } from "@/app/i18n";

import "@/style/member/member.scss";

export const BenefitItems = ({ lang, nextTier }: { lang: LocaleKeysType; nextTier?: string }) => {
  const renderPrivileges = (lang: LocaleKeysType, nextTier?: string) => {
    if (lang === "tc" && nextTier === "elite") {
      return <Image src={ElitePrivilegeTC} width={0} height={0} alt="升級成千兩會員可享有的優惠項目" loading="lazy" />;
    }
    if (lang === "en" && nextTier === "elite") {
      return <Image src={ElitePrivilegeEN} width={0} height={0} alt="Privileges for Elite Members" loading="lazy" />;
    }
    if (lang === "tc" && nextTier === "prestige") {
      return (
        <Image src={PrestigePrivilegeTC} width={0} height={0} alt="升級成萬兩會員可享有的優惠項目" loading="lazy" />
      );
    }
    if (lang === "en" && nextTier === "prestige") {
      return (
        <Image src={PrestigePrivilegeEN} width={0} height={0} alt="Privileges for Prestige Members" loading="lazy" />
      );
    }
  };

  return <div className="benefitItemsContainer">{renderPrivileges(lang, nextTier)}</div>;
};
