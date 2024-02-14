"use Client";

import Image from "next/image";
import dineInEn from "@/images/icons/Dine-in@3x.png";
import dineInTc from "@/images/icons/Dine-in_TC@3x.png";
import walkinEn from "@/images/icons/Walk-in Takeaway@3x.png";
import walinTc from "@/images/icons/Walkin-Takeaway_TC@3x.png";
import onlineEn from "@/images/icons/Online-Ordering@3x.png";
import onlineTc from "@/images/icons/Online-Ordering_TC@3x.png";
import { usePathname } from "next/navigation";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";

export const Tags = ({ tags, lang, path }: { tags: string[]; lang: LocaleKeysType; path?: string }) => {
  const validCouponPath = usePathname().split("/")[2] === "valid-coupon";
  const expiredCouponPath = usePathname().split("/")[2] === "expired-coupon";
  const renderTagText = (txt: string, lang: LocaleKeysType) => {
    if (lang === "en") {
      if (txt === "dineIn")
        return (
          <Image
            src={dineInEn}
            width={0}
            height={0}
            alt="Dine In"
            className={` ${
              path === "generalPage" ? "h-auto w-[90px] self-center  xl:w-[100px]" : "h-auto w-[90px] self-center"
            }`}
          />
        );
      if (txt === "walkInTakeaway")
        return (
          <Image
            src={walkinEn}
            width={0}
            height={0}
            alt="Walkin takeaway"
            className={`${
              path === "generalPage" ? "h-auto w-[149px] self-center xl:w-[164px]" : " h-auto  w-[149px]  self-center "
            }`}
          />
        );
      if (txt === "onlineTakeaway")
        return (
          <Image
            src={onlineEn}
            width={0}
            height={0}
            alt="Online takeaway"
            className={` ${
              path === "generalPage" ? "h-auto w-[140px] self-center xl:w-[137px]" : " h-auto  w-[140px] self-center "
            }`}
          />
        );
    } else if (lang === "tc") {
      if (txt === "dineIn")
        return (
          <Image
            src={dineInTc}
            width={0}
            height={0}
            alt="堂食"
            className={`${
              path === "generalPage"
                ? "h-auto w-[70px] self-center sm:w-[81px] xl:w-[100px]"
                : " h-auto  w-[70px] self-center "
            }`}
          />
        );
      if (txt === "walkInTakeaway")
        return (
          <Image
            src={walinTc}
            width={0}
            height={0}
            alt="外賣自取"
            className={`${
              path === "generalPage"
                ? "h-auto  w-[94px] self-center sm:w-[114px] xl:w-[134px]"
                : " h-auto  w-[94px] self-center"
            }`}
          />
        );
      if (txt === "onlineTakeaway")
        return (
          <Image
            src={onlineTc}
            width={0}
            height={0}
            alt="網上訂購"
            className={`${
              path === "generalPage"
                ? "h-auto w-[97px] self-center sm:w-[117px] xl:w-[137px]"
                : " h-auto  w-[97px] self-center"
            }`}
          />
        );
    }
  };

  if (!tags || !tags.length) {
    return <></>;
  }

  return (
    <>
      <div
        className={`couponTagContainer w-full ${
          path === "generalPage" || validCouponPath || expiredCouponPath
            ? " justify-center gap-2 "
            : " justify-start gap-2 lg:px-0 "
        }`}
      >
        {tags.map((tag, index) => (
          <div
            className={`couponTag ${
              path === "generalPage" || validCouponPath || expiredCouponPath
                ? " justify-center"
                : " items-start justify-start xl:gap-5"
            }`}
            key={tag}
          >
            {renderTagText(tag, lang)}
            {index % 2 === 0 && index === tags.length - 1 && <br />}
          </div>
        ))}
      </div>
    </>
  );
};
