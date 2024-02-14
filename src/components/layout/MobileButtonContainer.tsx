"use client";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { MobileButtonContainerType } from "@/types/componentTypes";
import { useMemo } from "react";
import { isSafari } from "@/utils/clientUtils";
import { useWindowSize } from "@/hook/useWindowSize";

export const MobileButtonContainer = ({ children, containerClass, zIndex }: MobileButtonContainerType) => {
  const { isAppear } = useWindowSize();
  const pathname = usePathname();
  const { secondSlug, thirdSlug } = getRouteNameFromPathname(pathname);

  const isCartPage = getRouteNameFromPathname(pathname).secondSlug === ROUTES.CART;
  const isRegistrationPage = getRouteNameFromPathname(pathname).slugWithoutLang === ROUTES.REGISTRATION;
  const style = useMemo(() => {
    switch (thirdSlug !== undefined ? thirdSlug : secondSlug) {
      // case ROUTES.CART :{
      //   return isAppear?{transform:"translateY(-66px)"}:{transform:"translateY(0)"}
      //   break;
      // }
      // case ROUTES.REGISTRATION_INFO: {
      //   return { transform: "translateY(0)" };
      //   break;
      // }
      // case ROUTES.CAMPAIGN_FORM: {
      //   return isAppear ? { transform: "translateY(-58.7px)" } : { transform: "translateY(0)" };
      //   break;
      // }
      // case ROUTES.CAMPAIGN: {
      //   return isAppear ? { transform: "translateY(-58.7px)" } : { transform: "translateY(0)" };
      //   break;
      // }
      // case ROUTES.CONTACT: {
      //   return isAppear ? { transform: "translateY(-58.7px)" } : { transform: "translateY(0)" };
      //   break;
      // }
      // case ROUTES.ABOUT: {
      //   return isAppear ? { transform: "translateY(-58.7px)" } : { transform: "translateY(0)" };
      //   break;
      // }
      // case ROUTES.LATEST_NEWS: {
      //   return isAppear ? { transform: "translateY(-58.7px)" } : { transform: "translateY(0)" };
      //   break;
      // }
      // case ROUTES.MENU: {
      //   return isAppear ? { transform: "translateY(-58.7px)" } : { transform: "translateY(0)" };
      //   break;
      // }

      // case ROUTES.REGISTRATION: {
      //   return isAppear ? { transform: "translateY(-60px)" } : { transform: "translateY(0)" };
      //   break;
      // }

      case ROUTES.CHECKOUT: {
        return { transform: "translateY(0)" };
        break;
      }

      case ROUTES.ADD_ON: {
        return { transform: "translateY(0)" };
        break;
      }

      default: {
        return isAppear
          ? { transform: "translateY(-56.5px)" }
          : isSafari()
          ? { transform: `translateY(${75 + 56.5}px)` }
          : { transform: "translateY(0)" };
        break;
      }
    }
  }, [isAppear, isCartPage, isRegistrationPage]);
  return (
    <div
      className={`fixed bottom-0 left-0 ${
        zIndex ? `z-[${zIndex}]` : "z-[99]"
      } w-full transform rounded-t-[24px] bg-white px-7 py-4 duration-150 lg:hidden lg:bg-transparent lg:px-0 ${containerClass}`}
      style={style}
    >
      {children}
    </div>
  );
};
