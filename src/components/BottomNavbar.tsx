"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { InboxUnreadCount } from "@/types/api/apiTypes";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNavHeight } from "@/redux/slice/heightSlice";
import { RootState } from "@/redux/store";
import { ROUTES } from "@/constants";
import { LocaleKeysType } from "@/app/i18n";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { BottomNavItems } from "@/types/bottomnavbarTypes";
import { Url } from "next/dist/shared/lib/router/router";
import Image from "next/image";
import loginDeactivated from "@/images/icons/Icon_login@3x.png";
import loginActivated from "@/images/icons/Icon_mobile_user-activated.png";
import menuDeactivated from "@/images/icons/Icon_Menu@3x.png";
import transDeactivated from "@/images/icons/Icon_transaction@3x.png";
import inboxDeactivated from "@/images/icons/Icon_inbox@3x.png";
import cartDeactivated from "@/images/icons/Icon_shopping-cart-light@3x.png";
import menuActivated from "@/images/icons/Icon_mobile_menu-activated.png";
import transActivated from "@/images/icons/Icon_mobile_transaction-activated.png";
import inboxActivated from "@/images/icons/Icon_mobile_inbox-activated.png";
import cartActivated from "@/images/icons/Icon_mobile_cart-activated.png";
import { useWindowSize } from "@/hook/useWindowSize";

export const BottomNavbar = ({
  lang,
  inboxUnreadCount,
}: {
  inboxUnreadCount?: InboxUnreadCount;
  lang: LocaleKeysType;
}) => {
  const path = usePathname();
  const slug = getRouteNameFromPathname(path);
  const extractedPath = path.split("/").slice(1).join("/");
  const isLoginPage = slug.secondSlug === ROUTES.LOGIN;
  const isAddon = slug.thirdSlug === ROUTES.ADD_ON;
  const [scrollingDown] = useState(true);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const [isPageReady, setIsPageReady] = useState(false);
  const navHeightRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const profileData = useSelector((state: RootState) => state.profile);
  const { apiData: cartApiData } = useSelector((state: RootState) => state.cart);
  const shortName = (profileData?.lastName ?? "")?.[0]?.toUpperCase();
  const { translate: t } = useTranslation(lang);
  const { isAppear } = useWindowSize();

  const BottomNavbarItems: BottomNavItems[] = [
    {
      id: "menu",
      title: t("bottomNavbar.menu"),
      imageDeactivated: menuDeactivated,
      imageActivated: menuActivated,
      link: `${ROUTES.INDEX}`,
      alt: "mobile bottom navbar menu icon",
    },
    {
      id: "transaction",
      title: t("bottomNavbar.transaction"),
      imageDeactivated: transDeactivated,
      imageActivated: transActivated,
      link: `${ROUTES.MEMBER_TRANSACTION}`,
      alt: "mobile bottom navbar transaction icon",
    },
    {
      id: "inbox",
      title: t("bottomNavbar.inbox"),
      imageDeactivated: inboxDeactivated,
      imageActivated: inboxActivated,
      link: `${ROUTES.MEMBER_INBOX}`,
      alt: "inbox",
    },
    {
      id: "cart",
      title: t("bottomNavbar.cart"),
      imageDeactivated: cartDeactivated,
      imageActivated: cartActivated,
      link: `${ROUTES.CART}`,
      alt: "mobile bottom navbar cart icon",
    },
  ];

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    // resolve hy error
    setTimeout(() => {
      setIsPageReady(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (navHeightRef.current) {
      dispatch(
        setCurrentNavHeight({
          height: navHeightRef.current.clientHeight,
        })
      );
    }
  }, [navHeightRef, dispatch]);

  const maximumNum = (amount: number) => {
    const overload = amount > 99 ? "99+" : amount;
    return <p>{overload}</p>;
  };
  const location = path.split("/")[2];
  const locationForMoreThanTwoFolder = path.split("/")[3];

  const circleStyle = (amount: number, link: Url) => {
    let classNames =
      "absolute -top-[6px] rounded-full text-[12.2px] leading-[18.46px] text-primaryDark tracking-[-0.284px] font-medium ";

    const backgroundAndBorderStyle = link === slug.secondSlug ? "bg-white border-primaryGold border" : "bg-primaryGrey";

    classNames += backgroundAndBorderStyle;

    let rightAndPaddingStyles = "";

    if (amount <= 9) {
      rightAndPaddingStyles += "-right-[15px] px-[7.3px]";
    } else if (amount <= 99) {
      rightAndPaddingStyles += "right-[-14px] px-[6px]";
    } else {
      rightAndPaddingStyles += "right-[-25px] px-[7.86px]";
    }
    classNames += " " + rightAndPaddingStyles;
    return classNames;
  };

  const generateCornerNumber = (link: Url, id?: string) => {
    const cartItemCount = (cartApiData.cart?.itemCount as number) ?? 0;
    switch (true) {
      case id?.toLowerCase() === "inbox" && (inboxUnreadCount?.data.unreadCount as number) > 0:
        return (
          <div className={circleStyle(inboxUnreadCount?.data.unreadCount as number, link)}>
            {maximumNum(inboxUnreadCount?.data.unreadCount as number)}
          </div>
        );
      case id?.toLowerCase() === "cart" && cartItemCount > 0:
        return <div className={circleStyle(cartItemCount, link)}>{maximumNum(cartItemCount)}</div>;
      default:
        return <></>;
    }
  };

  if (!isPageReady) {
    return <></>;
  }

  return (
    <nav
      className={`mobile-navbar ${
        location === "store-location" ||
        location === "checkout" ||
        location === "maintenance" ||
        location === "maintenance-daily" ||
        locationForMoreThanTwoFolder === "payment-in-progress" ||
        (location === "campaign" && locationForMoreThanTwoFolder === "submitted") ||
        (location === "error-oops" && scrollingDown)
          ? "hidden"
          : "visible "
      } fixed left-0 z-[999] w-full transform bg-primaryGold duration-300 lg:hidden `}
      ref={navHeightRef}
      id="bottomNavbar"
      style={isAddon ? { bottom: "0px" } : isAppear ? { bottom: "0px" } : { bottom: "-60px" }}
    >
      <ul className="flex justify-around pb-5 pt-3">
        {BottomNavbarItems.map(item => (
          <li key={item.id}>
            <div
              role="button"
              className="flex flex-col items-center gap-[5px]"
              onClick={() => (window.location.href = `/${lang}/${item.link}`)}
            >
              <div
                onContextMenu={handleContextMenu}
                className={`relative flex flex-col items-center justify-center ${
                  item.title === "Cart" ? "pb-1 pt-[5px]" : "py-1"
                } `}
              >
                {generateCornerNumber(item.link, item?.id)}
                <Image
                  src={item.link === slug.secondSlug ? item.imageActivated : item.imageDeactivated}
                  width={0}
                  height={0}
                  alt={"imageDeactivated"}
                  className={"mobile-navbar pointer-events-none h-auto w-[21px]"}
                  onDragStart={handleDragStart}
                />
                <span
                  className={`${
                    `/${lang}/${item.link}` === path ? "font-semibold  text-opacity-100" : "text-opacity-70"
                  } ruby absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap py-[4px] text-12 leading-4 text-white`}
                >
                  {item.title !== "Login" ? item.title : isAlreadyLogin ? shortName : "Login"}
                </span>
                {/* {item.title === "Cart" && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondaryLightGold2 text-primaryDark">
                    {totalItem}
                  </span>
                )} */}
                <span
                  className={`${
                    extractedPath.includes(item.link as string) ? "visible" : "hidden"
                  } absolute -bottom-[19px] left-1/2 block w-[40px] -translate-x-1/2 rounded-md border-b-[3px] border-b-white`}
                ></span>
              </div>
            </div>
          </li>
        ))}
        <div
          onClick={() => {
            if (!isAlreadyLogin) {
              const targetPage = isLoginPage ? `/${lang}/${ROUTES.MEMBER}` : window.location.pathname;
              setCookie(CookiesKey.targetPageToBeRedirectedTo, targetPage);
              window.location.href = `/${lang}/${ROUTES.LOGIN}`;
            } else {
              window.location.href = `/${lang}/${ROUTES.MEMBER}`;
            }
          }}
          className="relative flex flex-col items-center gap-[5px]"
        >
          <div className="relative flex flex-col items-center py-1" onContextMenu={handleContextMenu}>
            <Image
              src={
                path === `/${lang}/${ROUTES.LOGIN}` || path === `/${lang}/${ROUTES.MEMBER}`
                  ? loginActivated
                  : loginDeactivated
              }
              width={0}
              height={0}
              alt={"gotoMember"}
              className={"mobile-navbar pointer-events-none h-auto w-[21px] "}
              onDragStart={handleDragStart}
            />
            <div
              role="button"
              className={`${
                path === `/${lang}/${ROUTES.LOGIN}` || path === `/${lang}/${ROUTES.MEMBER}`
                  ? "font-semibold  text-opacity-100"
                  : "text-opacity-70"
              }  absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap pt-[4px] text-12 leading-4 text-white `}
            >
              {isAlreadyLogin ? shortName : t("bottomNavbar.login")}
            </div>
          </div>
          <span
            className={`${
              path === `/${lang}/${ROUTES.LOGIN}` || path === `/${lang}/${ROUTES.MEMBER}` ? "visible" : "hidden"
            } absolute -bottom-[17px] left-1/2 block w-[40px] -translate-x-1/2 rounded-md border-b-[3px] border-b-white`}
          ></span>
        </div>
      </ul>
    </nav>
  );
};
