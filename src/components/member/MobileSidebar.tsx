"use client";

import { LocaleKeysType } from "@/app/i18n";
import { ROUTES, RoutesNameType } from "@/constants";
import Image from "next/image";
import { SidebarProps } from "@/types/member/memberTypes";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { CookiesKey } from "@/constants/cookies";
import { useTranslation } from "@/app/i18n/client";
import { ProfileResType } from "@/types/api/apiTypes";
import { useDispatch } from "react-redux";
import { handleAlertMessageForGeneralPage } from "@/utils/clientUtils";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { mobileNavbarItems } from "./mobileitems";
import "@/style/member/member.scss";
import { useWindowSize } from "@/hook/useWindowSize";

export interface SideProps {
  lang: LocaleKeysType;
  items: SidebarProps[];
  numberOfCoupons: number;
  user?: ProfileResType["data"];
  hideImage?: boolean;
}

export const MobileSidebar = ({ lang, items, numberOfCoupons, hideImage }: SideProps) => {
  const path = usePathname();
  const { translate } = useTranslation(lang);
  const slugs = getRouteNameFromPathname(path);
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const handleLogOut = () => {
    handleAlertMessageForGeneralPage({
      alertCode: "g56",
      alertType: "popup",
      translate,
      dispatch,
      lang,
      extraInfo: {
        rightButtonCallback: () => {
          deleteCookie(CookiesKey.accessToken);
          if (([ROUTES.MEMBER] as RoutesNameType[]).includes(slugs.secondSlug)) {
            window.location.href = `/${lang}/${ROUTES.INDEX}`;
          } else {
            window.location.reload();
          }
        },
      },
    });
  };
  return (
    <>
      {items.map(item => (
        <li
          key={item.id}
          className={`profileSidebarItemsContainer  ${
            `/${lang}/${item.path}` === path ||
            (path === `/${lang}/${ROUTES.MEMBER_ADD_CARDS}` && item.id === "savedCards")
              ? "bg-primaryGold"
              : "bg-secondaryLightGold2"
          }  ${item.title === "Coupons" && "relative"}`}
        >
          <Link href={`/${lang}/${item.path}`}>
            {hideImage && width <= 639 ? (
              <div>
                {`/${lang}/${item.path}` === path ||
                (path === `/${lang}/${ROUTES.MEMBER_ADD_CARDS}` && item.id === "savedCards")
                  ? item.imageActivatedMobileText
                  : item.imageMobileText}
              </div>
            ) : (
              <div>
                {`/${lang}/${item.path}` === path ||
                (path === `/${lang}/${ROUTES.MEMBER_ADD_CARDS}` && item.id === "savedCards")
                  ? item.imageActivatedMobile
                  : item.imageMobile}
              </div>
            )}

            <div className="leading-[10px]">
              {item.title === "Coupons" && (
                <div
                  className={` profileSidebarCouponNumber ${
                    `/${lang}/${item.path}` === path ? "profileCouponNumberActivate" : "profileCouponNumberDeactivate"
                  } `}
                >
                  <span>{numberOfCoupons}</span>
                </div>
              )}
            </div>
          </Link>
        </li>
      ))}
      <li className="profileSidebarLogoutContainer mr-4">
        <div role="button" onClick={handleLogOut}>
          {hideImage && width <= 639 ? (
            <Image
              src={
                lang === "en"
                  ? mobileNavbarItems.newMobileLogoutUnselectedTextEN
                  : mobileNavbarItems.newMobileLogoutUnselectedTextTC
              }
              width={0}
              height={0}
              alt={lang === "en" ? "Click to logout" : "點擊並登出"}
              className="h-auto w-full self-center"
            />
          ) : (
            <Image
              src={
                lang === "en"
                  ? mobileNavbarItems.newMobileLogoutUnselectedEN
                  : mobileNavbarItems.newMobileLogoutUnselectedTC
              }
              width={0}
              height={0}
              alt={lang === "en" ? "Click to logout" : "點擊並登出"}
              className="h-auto w-full self-center"
            />
          )}
        </div>
      </li>
    </>
  );
};
