"use client";

import { OnlineOrdering } from "./online/OnlineOrdering";
import { Membership } from "./membership/Membership";
import { useState, useCallback } from "react";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import Image from "next/image";
import { useWindowSize } from "@/hook/useWindowSize";
import { useDispatch } from "react-redux";
import { setActiveIndexFaq } from "@/redux/slice/generalStateSlice";

// desktop
import onlineOrderingDesktopSeletedEn from "@/images/tag/FAQImagetab/Desktop/EN/Selected/Online Ordering@2x.png";
import membershipDesktopSeletedEn from "@/images/tag/FAQImagetab/Desktop/EN/Selected/Membership@2x.png";
import onlineOrderingDesktopUnseletedEn from "@/images/tag/FAQImagetab/Desktop/EN/Unselected/Online Ordering@2x.png";
import membershipDesktopUnseletedEn from "@/images/tag/FAQImagetab/Desktop/EN/Unselected/Membership@2x.png";

import onlineOrderingDesktopSeletedTc from "@/images/tag/FAQImagetab/Desktop/TC/Selected/Online Ordering_TC@2x.png";
import membershipDesktopSeletedTc from "@/images/tag/FAQImagetab/Desktop/TC/Selected/Membership_TC@2x.png";
import onlineOrderingDesktopUnseletedTc from "@/images/tag/FAQImagetab/Desktop/TC/Unselected/Online Ordering_TC@2x.png";
import membershipDesktopUnseletedTc from "@/images/tag/FAQImagetab/Desktop/TC/Unselected/Membership_TC@2x.png";

// mobile
import onlineOrderingMobileSeletedEn from "@/images/tag/FAQImagetab/Mob&APP/EN/Selected/Online Ordering@2x.png";
import membershipMobileSeletedEn from "@/images/tag/FAQImagetab/Mob&APP/EN/Selected/Membership@2x.png";
import onlineOrderingMobileUnseletedEn from "@/images/tag/FAQImagetab/Mob&APP/EN/Unselected/Online Ordering@2x.png";
import membershipMobileUnseletedEn from "@/images/tag/FAQImagetab/Mob&APP/EN/Unselected/Membership@2x.png";

import onlineOrderingMobileSeletedTc from "@/images/tag/FAQImagetab/Mob&APP/TC/Selected/Online Ordering_TC@2x.png";
import membershipMobileSeletedTc from "@/images/tag/FAQImagetab/Mob&APP/TC/Selected/Membership_TC@2x.png";
import onlineOrderingMobileUnseletedTc from "@/images/tag/FAQImagetab/Mob&APP/TC/Unselected/Online Ordering_TC@2x.png";
import membershipMobileUnseletedTc from "@/images/tag/FAQImagetab/Mob&APP/TC/Unselected/Membership_TC@2x.png";

export const FaqContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const [mode, setMode] = useState<"Online Ordering" | "Membership">("Online Ordering");
  // const [isHover, setIsHover] = useState(false);
  const [isOnlineOrderingHovered, setIsOnlineOrderingHovered] = useState(false);
  const [isMembershipHovered, setIsMembershipHovered] = useState(false);
  const { width } = useWindowSize();
  const dispatch = useDispatch();

  const renderContent = () => {
    if (mode === "Online Ordering") {
      return <OnlineOrdering lang={lang} />;
    } else if (mode === "Membership") {
      return <Membership lang={lang} />;
    }
  };

  const handleOnlineOrdering = () => {
    setMode("Online Ordering");
    dispatch(setActiveIndexFaq(-1));
  };

  const handleMembership = () => {
    setMode("Membership");
    dispatch(setActiveIndexFaq(-1));
  };

  const getMembershipImageSrc = useCallback(() => {
    // const isSelected = (mode === "Membership");
    const isMobile = width < 768;

    if (isMobile) {
      if (mode === "Membership") {
        return lang === "en" ? membershipMobileSeletedEn : membershipMobileSeletedTc;
      } else {
        return isMembershipHovered
          ? lang === "en"
            ? membershipMobileSeletedEn
            : membershipMobileSeletedTc
          : lang === "en"
          ? membershipMobileUnseletedEn
          : membershipMobileUnseletedTc;
      }
    } else {
      if (mode === "Membership") {
        return lang === "en" ? membershipDesktopSeletedEn : membershipDesktopSeletedTc;
      } else {
        return isMembershipHovered
          ? lang === "en"
            ? membershipDesktopSeletedEn
            : membershipDesktopSeletedTc
          : lang === "en"
          ? membershipDesktopUnseletedEn
          : membershipDesktopUnseletedTc;
      }
    }
  }, [lang, isMembershipHovered, width, mode]);

  const getOnlineOrderingImageSrc = useCallback(() => {
    const isMobile = width < 768;

    if (isMobile) {
      if (mode === "Online Ordering") {
        return lang === "en" ? onlineOrderingMobileSeletedEn : onlineOrderingMobileSeletedTc;
      } else {
        return isOnlineOrderingHovered
          ? lang === "en"
            ? onlineOrderingMobileSeletedEn
            : onlineOrderingMobileSeletedTc
          : lang === "en"
          ? onlineOrderingMobileUnseletedEn
          : onlineOrderingMobileUnseletedTc;
      }
    } else {
      if (mode === "Online Ordering") {
        return lang === "en" ? onlineOrderingDesktopSeletedEn : onlineOrderingDesktopSeletedTc;
      } else {
        return isOnlineOrderingHovered
          ? lang === "en"
            ? onlineOrderingDesktopSeletedEn
            : onlineOrderingDesktopSeletedTc
          : lang === "en"
          ? onlineOrderingDesktopUnseletedEn
          : onlineOrderingDesktopUnseletedTc;
      }
    }
  }, [lang, isOnlineOrderingHovered, width, mode]);

  return (
    <>
      <section className="flex w-full max-w-[360px] justify-center gap-4 px-4 sm:px-0 md:max-w-[455px] xl:gap-6">
        <button
          onClick={handleOnlineOrdering}
          className={" h-auto  w-1/2"}
          onMouseEnter={() => setIsOnlineOrderingHovered(true)}
          onMouseLeave={() => setIsOnlineOrderingHovered(false)}
        >
          <a href="#systemrequirements">
            <Image
              src={getOnlineOrderingImageSrc()}
              alt="About tabs"
              className="h-full w-full rounded-[14px] object-cover"
              width={0}
              height={0}
            />
          </a>
        </button>
        <button
          onClick={handleMembership}
          className={"h-auto  w-1/2"}
          onMouseEnter={() => setIsMembershipHovered(true)}
          onMouseLeave={() => setIsMembershipHovered(false)}
        >
          <a href="#membership">
            <Image
              src={getMembershipImageSrc()}
              alt="About tabs"
              className="h-full w-full rounded-[14px] object-cover"
              width={0}
              height={0}
            />
          </a>
        </button>
      </section>
      {renderContent()}
    </>
  );
};
