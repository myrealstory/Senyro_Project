"use client";

import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import BasicMemberIcon from "@/images/icons/qr_code_basic@3x.png";
import EliteMemberIcon from "@/images/icons/qr_code_elite@3x.png";
import PrestigeMemberIcon from "@/images/icons/qr_code_prestige@3x.png";

export const MemberTierIcon = ({
  memberTier,
  lang,
  classStyle,
}: {
  memberTier: string;
  lang: LocaleKeysType;
  classStyle: string;
}) => {
  const { translate: t } = useTranslation(lang);
  if (!memberTier) {
    return <></>;
  }

  const lowerCaseMemberTier = memberTier.toLocaleLowerCase();
  let title, icon;

  if (lowerCaseMemberTier === "basic") {
    title = t("qrCode.basic");
    icon = BasicMemberIcon.src;
  } else if (lowerCaseMemberTier === "elite") {
    title = t("qrCode.elite");
    icon = EliteMemberIcon.src;
  } else if (lowerCaseMemberTier === "prestige") {
    title = t("qrCode.prestige");
    icon = PrestigeMemberIcon.src;
  } else {
    return <></>;
  }

  return (
    <div className={classStyle}>
      <Image width={30} height={0} src={icon} alt={`${title} icon`} className="h-auto self-center" />
    </div>
  );
};
