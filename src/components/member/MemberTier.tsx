import { LocaleKeysType } from "@/app/i18n";
import basicEN from "@/images/icons/memberTier/Badge_Basic_EN@2x.png";
import basicTC from "@/images/icons/memberTier/Badge_Basic_TC@2x.png";
import eliteEN from "@/images/icons/memberTier/Badge_Elite_EN@2x.png";
import eliteTC from "@/images/icons/memberTier/Badge_Elite_TC@2x.png";
import prestigeEN from "@/images/icons/memberTier/Badge_Prestige_EN@2x.png";
import prestigeTC from "@/images/icons/memberTier/Badge_Prestige_TC@2x.png";

import Image, { StaticImageData } from "next/image";

export const MemberTier = ({
  tierCode,
  lang,
  containerClass,
}: {
  tierCode?: string;
  lang: LocaleKeysType;
  containerClass?: string;
}) => {
  const images: {
    [key: string]: { src: StaticImageData; width: number; height: number; alt: string; className: string };
  } = {
    "1": {
      src: lang === "en" ? basicEN : basicTC,
      width: 0,
      height: 0,
      alt: lang === "en" ? "Membership is basic" : "百両會員",
      className: ` ${containerClass ? containerClass : "w-auto h-[26px] lg:h-[31px]"} `,
    },
    "2": {
      src: lang === "en" ? eliteEN : eliteTC,
      width: 0,
      height: 0,
      alt: lang === "en" ? "Membership is Elite" : "千両會員",
      className: ` ${containerClass ? containerClass : "w-auto h-[26px] lg:h-[31px]"} `,
    },
    "3": {
      src: lang === "en" ? prestigeEN : prestigeTC,
      width: 0,
      height: 0,
      alt: lang === "en" ? "Membership is Prestige" : "万両會員",
      className: ` ${containerClass ? containerClass : "w-auto h-[26px] lg:h-[31px]"} `,
    },
  };
  const imageProps = images[tierCode || "1"];

  return imageProps ? (
    <div>
      <Image {...imageProps} alt={imageProps.alt} />
    </div>
  ) : null;
};
