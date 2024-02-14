"use client";

import { SidebarProps } from "@/types/member/memberTypes";
import { ROUTES } from "@/constants";
import { MobileSidebar } from "./MobileSidebar";
import { WebsiteSidebar } from "./WebsiteSidebar";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { usePathname } from "next/navigation";
import { ProfileResType } from "@/types/api/apiTypes";
import { InboxAndEdit } from "./InboxAndEdit";
import { Profile } from "./Profile";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import Image from "next/image";
import "@/style/member/member.scss";
import { mobileNavbarItems } from "./mobileitems";

export const Sidebar = ({
  user,
  lang,
  numberOfCoupons,
}: {
  user?: ProfileResType["data"];
  lang: LocaleKeysType;
  numberOfCoupons: number;
}) => {
  const { translate } = useTranslation(lang);
  const path = usePathname();
  const [isNavbarAtTop, setIsNavbarAtTop] = useState(false);
  const { width } = useWindowSize();

  const SidebarItems: SidebarProps[] = [
    {
      id: "member",
      title: translate("memberSidebar.memberArea"),
      imageMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileMemberUnselectedEN
              : mobileNavbarItems.newMobileMemberUnselectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileMemberUnselectedTextEN
              : mobileNavbarItems.newMobileMemberUnselectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),

      imageDesktop: (
        <Image
          src={mobileNavbarItems.memberBlack}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      imageActivatedMobile: (
        <Image
          src={
            lang === "en" ? mobileNavbarItems.newMobileMemberSelectedEN : mobileNavbarItems.newMobileMemberSelectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileMemberSelectedTextEN
              : mobileNavbarItems.newMobileMemberSelectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedDesktop: (
        <Image
          src={mobileNavbarItems.memberGold}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      path: `${ROUTES.MEMBER}`,
    },
    {
      id: "upgrade",
      title: translate("memberSidebar.upgrade"),
      imageMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileUpgradeUnselectedEN
              : mobileNavbarItems.newMobileUpgradeUnselectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to upgrade" : "前升級續會頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileUpgradeUnselectedTextEN
              : mobileNavbarItems.newMobileUpgradeUnselectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageDesktop: (
        <Image
          src={mobileNavbarItems.upgradeBlack}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to upgrade" : "前升級續會頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      imageActivatedMobile: (
        <Image
          src={
            lang === "en" ? mobileNavbarItems.newMobileUpgradeSelectedEN : mobileNavbarItems.newMobileUpgradeSelectedTC
          }
          width={0}
          height={0}
          alt="This is a link that redirects to upgrade"
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageActivatedMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileUpgradeSelectedTextEN
              : mobileNavbarItems.newMobileUpgradeSelectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedDesktop: (
        <Image
          src={mobileNavbarItems.upgradeGold}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to upgrade" : "前升級續會頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      path: `${ROUTES.MEMBER_UPGRADE}`,
    },
    {
      id: "coupons",
      title: translate("memberSidebar.coupons"),
      imageMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileCouponUnselectedEN
              : mobileNavbarItems.newMobileCouponUnselectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to coupon" : "前往優惠券頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileCouponUnselectedTextEN
              : mobileNavbarItems.newMobileCouponUnselectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),

      imageDesktop: (
        <Image
          src={mobileNavbarItems.couponBlack}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to coupon" : "前往優惠券頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      imageActivatedMobile: (
        <Image
          src={
            lang === "en" ? mobileNavbarItems.newMobileCouponSelectedEN : mobileNavbarItems.newMobileCouponSelectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to coupon" : "前往優惠券頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageActivatedMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileCouponSelectedTextEN
              : mobileNavbarItems.newMobileCouponSelectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedDesktop: (
        <Image
          src={mobileNavbarItems.couponGold}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to coupon" : "前往優惠券頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      path: `${ROUTES.MEMBER_COUPON}`,
    },
    {
      id: "transaction",
      title: translate("memberSidebar.transactions"),
      imageMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileTransactionUnselectedEN
              : mobileNavbarItems.newMobileTransactionUnselectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to transaction" : "前往交易紀錄頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileTransactionUnselectedTextEN
              : mobileNavbarItems.newMobileTransactionUnselectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageDesktop: (
        <Image
          src={mobileNavbarItems.transactionBlack}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to transaction" : "前往交易紀錄頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),

      imageActivatedMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileTransactionSelectedEN
              : mobileNavbarItems.newMobileTransactionSelectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to transaction" : "前往交易紀錄頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageActivatedMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileTransactionSelectedTextEN
              : mobileNavbarItems.newMobileTransactionSelectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedDesktop: (
        <Image
          src={mobileNavbarItems.transactionGold}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to transaction" : "前往交易紀錄頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      path: `${ROUTES.MEMBER_TRANSACTION}`,
    },
    {
      id: "favourite",
      title: translate("memberSidebar.myFav"),
      imageMobile: (
        <Image
          src={
            lang === "en" ? mobileNavbarItems.newMobileMyFavUnselectedEN : mobileNavbarItems.newMobileMyFavUnselectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to favourite" : "前往我的最愛頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileMyFavUnselectedTextEN
              : mobileNavbarItems.newMobileMyFavUnselectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageDesktop: (
        <Image
          src={mobileNavbarItems.favBlack}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to favourite" : "前往我的最愛頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      imageActivatedMobile: (
        <Image
          src={lang === "en" ? mobileNavbarItems.newMobileMyFavSelectedEN : mobileNavbarItems.newMobileMyFavSelectedTC}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to favourite" : "前往我的最愛頁面"}
          className="h-auto w-[70px]  self-center"
        />
      ),
      imageActivatedMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileMyFavSelectedTextEN
              : mobileNavbarItems.newMobileMyFavSelectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedDesktop: (
        <Image
          src={mobileNavbarItems.favGold}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to favourite" : "前往我的最愛頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      path: `${ROUTES.MEMBER_FAV}`,
    },
    {
      id: "savedCard",
      title: translate("memberSidebar.savedCards"),
      imageMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileSavedCardUnselectedEN
              : mobileNavbarItems.newMobileSavedCardUnselectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to saved card" : "前往信用卡頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileSavedCardUnselectedTextEN
              : mobileNavbarItems.newMobileSavedCardUnselectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageDesktop: (
        <Image
          src={mobileNavbarItems.savedCardBlack}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to saved card" : "前往信用卡頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      imageActivatedMobile: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileSavedCardSelectedEN
              : mobileNavbarItems.newMobileSavedCardSelectedTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to saved card" : "前往信用卡頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedMobileText: (
        <Image
          src={
            lang === "en"
              ? mobileNavbarItems.newMobileSavedCardSelectedTextEN
              : mobileNavbarItems.newMobileSavedCardSelectedTextTC
          }
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to member area" : "前往會員頁面"}
          className="h-auto w-[80px]  self-center"
        />
      ),
      imageActivatedDesktop: (
        <Image
          src={mobileNavbarItems.savedCardGold}
          width={0}
          height={0}
          alt={lang === "en" ? "This is a link that redirects to saved card" : "前往信用卡頁面"}
          className="h-[33px] w-[33px] self-center"
        />
      ),
      path: `${ROUTES.MEMBER_SAVED_CARDS}`,
    },
  ];

  useEffect(() => {
    if (window !== undefined) {
      window.onscroll = () => {
        if (window.scrollY === 0) {
          setIsNavbarAtTop(false);
        } else {
          setIsNavbarAtTop(true);
        }
      };
      return () => {
        window.onscroll = null;
      };
    }
  });

  const includedPath =
    path.includes(`/${lang}/${ROUTES.COUPON_VALID}`) || path.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`);

  return (
    <>
      {includedPath ? null : (
        <div className="sidebarContainer">
          <Profile user={user} lang={lang} />
          <InboxAndEdit lang={lang} />
        </div>
      )}
      <aside
        className={`sidebarAsideContainer ${isNavbarAtTop && width <= 639 ? "z-99 bg-MainBG lg:bg-transparent" : ""}`}
      >
        <nav>
          {includedPath ? null : (
            <ul
              className={`mobileSidebarUl ${
                isNavbarAtTop ? "h-[40px] duration-200 ease-in-out" : "h-[73px] duration-200 ease-in-out md:h-[75px]"
              }`}
            >
              <MobileSidebar
                user={user}
                lang={lang}
                items={SidebarItems}
                numberOfCoupons={numberOfCoupons}
                hideImage={isNavbarAtTop}
              />
            </ul>
          )}
          <ul className="websiteSidebarUl">
            <WebsiteSidebar user={user} lang={lang} items={SidebarItems} numberOfCoupons={numberOfCoupons} />
          </ul>
        </nav>
      </aside>
    </>
  );
};
