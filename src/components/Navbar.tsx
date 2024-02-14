"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Logo from "@/../images/icons/logo-senryo@3x.png";
import memberImg from "@/../images/icons/Icon_user@3x.png";
import IconSenyroMini from "@/images/icons/icon_Senyro_mini.png";
import IconLogout from "@/../images/icons/Icon_Logout@3x.png";
import "../style/index/indexUsed.scss";
import CustomSwitch from "./CustomSwitch";
import { MenuBtn } from "./MenuBtn";
import { useTranslation } from "@/app/i18n/client";
import { useWindowSize } from "@/hook/useWindowSize";
import { DeliveryBar } from "./DeliveryBar";
import { usePathname } from "next/navigation";
import { CartWithTotalCount } from "./cart/CartWithTotalCount";
import { ComponentType } from "@/app/[lang]/page";
import Progress from "./Progress";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setIsClickedLangSwitch } from "@/redux/slice/generalStateSlice";
import { ROUTES, RoutesNameType } from "@/constants/routes";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { deleteCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { MemberTier } from "./member/MemberTier";
import { alertMessageMapperForRegistration, handleAlertMessageForGeneralPage } from "@/utils/clientUtils";
import { CouponResponseType, InboxUnreadCount } from "@/types/api/apiTypes";
import { getRouteNameFromPathname } from "@/utils/commonUtils";

export const Navbar = ({
  lang,
  inboxUnreadCount,
  coupon,
}: ComponentType & { inboxUnreadCount: InboxUnreadCount; coupon: CouponResponseType }) => {
  const { translate } = useTranslation(lang);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const { scrollY, width } = useWindowSize();
  const [isNavbarReady, setIsNavbarReady] = useState(false);
  const [toogleMember, setToogleMember] = useState(false);
  const path = usePathname();
  const slugs = getRouteNameFromPathname(path);
  const pageName = path.split("/")[2];
  const locationForMoreThanTwoFolder = path.split("/")[3];
  // const isClickedLangSwitch = useSelector((state: RootState) => state.generalState.isClickedLangSwitch);
  const { apiData } = useSelector((state: RootState) => state.cart);
  const profile = useSelector((state: RootState) => state.profile);
  const { productInCategory } = useSelector((state: RootState) => state.generalState);
  const isMenuOpen = useSelector((state: RootState) => state.generalState.isMenuOpen);
  const memberBarRef = useRef<HTMLDivElement | null>(null);
  const memberNameRef = useRef<HTMLLIElement | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (width > 0) {
      setIsNavbarReady(true);
    }
  }, [width]);

  const matchingRoute = (route: string) => {
    const getPathname = path.split("/");
    const slidePath = getPathname.slice(2);
    const newPath = "/" + slidePath?.join("/");

    return newPath === route;
  };

  useEffect(() => {
    setTimeout(() => {
      dispatch(setIsClickedLangSwitch(false)), 1000;
    });
  }, [path]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (memberBarRef.current && !memberBarRef.current.contains(event.target as Node)) {
        setToogleMember(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [memberBarRef]);

  const isLeavingRegistrationPage = (link: string) => {
    if (path === `/${lang}/${ROUTES.REGISTRATION}` || path === `/${lang}/${ROUTES.REGISTRATION_INFO}`) {
      alertMessageMapperForRegistration({
        alertCode: "g53",
        translate,
        dispatch,
        lang,
        onLeftButtonClick: () => {
          window.location.href = link;
        },
      });
    } else {
      window.location.href = link;
    }
  };

  if (!isNavbarReady) {
    return <></>;
  }

  const handleRedirectToLogin = () => {
    setCookie(CookiesKey.targetPageToBeRedirectedTo, window.location.pathname);
    isLeavingRegistrationPage(`/${lang}/${ROUTES.LOGIN}`);
  };

  const changeDeliveryBar = (scrollY: number) => {
    if (
      ((productInCategory > 0 && scrollY > 560 && apiData.cart?.branch) ||
        (productInCategory <= 0 && scrollY > 560 && apiData.cart?.branch)) &&
      isMenuOpen === false
    ) {
      return <DeliveryBar data={apiData} lang={lang} isCartMode={false} />;
    } else {
      return (
        <div className="flex w-full items-center justify-center">
          <ul className="navbar navCenter md:gap-5  ">
            <li
              className={`${
                pageName === "index" || pageName === "product" ? "after:selectBall selected" : ""
              } cursor-pointer`}
              onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.INDEX}`)}
            >
              {translate("navbar.takeaway")}
            </li>
            <li
              className={`${pageName === "news-offers" ? "after:selectBall selected" : ""}  cursor-pointer`}
              onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.LATEST_NEWS}`)}
            >
              {translate("navbar.news")}
            </li>
            <li
              className={`${pageName === "store-location" ? "after:selectBall selected" : ""}  cursor-pointer`}
              onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.STORE_LOCATION}`)}
            >
              {translate("navbar.location")}
            </li>
          </ul>
        </div>
      );
    }
  };

  const memberDropdown = () => {
    const leftDropList = [
      { name: translate("inbox.inbox"), link: "/member/inbox" },
      { name: translate("memberSidebar.memberArea"), link: "/member" },
      { name: translate("memberSidebar.upgrade"), link: "/member/upgrade" },
      { name: translate("memberSidebar.coupons"), link: "/member/coupons" },
    ];
    const rightDropList = [
      { name: translate("memberSidebar.transactions"), link: "/member/transaction" },
      { name: translate("memberSidebar.myFav"), link: "/member/favourite" },
      { name: translate("memberSidebar.savedCards"), link: "/member/saved-cards" },
      { name: translate("editProfile.editProfile"), link: "/member/edit-profile" },
    ];
    const MSGAmount = (amount: number) => {
      const maximumAmount = amount > 99 ? 99 : amount;
      return (
        <span className="leading-2 absolute -right-9 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-primaryGold text-10 text-white">
          {maximumAmount}
        </span>
      );
    };
    const logout = () => {
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
      <div
        className={` ${
          scrollY < 350 ? "absolute left-1/2 -translate-x-1/2" : " fixed right-8 top-[60px]"
        }  top-[40px] z-[10999] aspect-[1.4/1] h-auto w-[385px]  rounded-xl bg-white`}
        ref={memberBarRef}
      >
        <div className="flex justify-between border-b border-solid border-primaryGold/80 px-6 pb-5 pt-7">
          <div className="flex flex-col justify-between ">
            <p className="pb-3 text-24 font-semibold leading-6 text-primaryGold ">{profile.firstName}</p>
            <div className="flex">
              <MemberTier
                tierCode={profile.memberTierCode.toString()}
                lang={lang}
                containerClass="h-[21px] w-auto object-contain "
              />
              <div className="flex items-center pl-3">
                <Image
                  src={IconSenyroMini}
                  alt="IconSenyroMini"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="mr-1 aspect-square h-[21px] w-auto object-contain object-center"
                />
                <span className=" text-18 font-semibold leading-4 text-primaryGold ">{profile.pointBalance}</span>
              </div>
            </div>
          </div>
          <button
            className="flex aspect-square h-auto w-[58px] flex-col items-center justify-center rounded-[10px] border border-solid border-primaryGold bg-transparent"
            onClick={logout}
          >
            <Image
              src={IconLogout}
              alt="IconLogout"
              width={0}
              height={0}
              sizes="100vw"
              className="mb-2 aspect-square h-[16px] w-auto object-contain "
            />
            <p className="text-center text-10 font-semibold leading-3 text-primaryGold">{translate("logout.Logout")}</p>
          </button>
        </div>
        <div className="flex w-full justify-between px-6 py-5">
          <div className="flex h-[124px] w-1/2 flex-col justify-between">
            {leftDropList.map((item, index) => {
              return (
                <button
                  className="relative block w-fit "
                  key={index}
                  onClick={() => isLeavingRegistrationPage(`/${lang}${item.link}`)}
                >
                  <p
                    className={` text-left text-16 leading-5 text-primaryGold ${
                      matchingRoute(item.link) ? "font-bold" : "font-medium"
                    } hover:font-bold`}
                  >
                    {item.name}
                  </p>
                  {item.name === translate("inbox.inbox") ? MSGAmount(inboxUnreadCount.data.unreadCount) : null}
                  {item.name === translate("memberSidebar.coupons") ? MSGAmount(coupon.data.activeCouponCount) : null}
                </button>
              );
            })}
          </div>
          <div className="flex h-[124px] w-1/2 flex-col justify-between">
            {rightDropList.map((item, index) => {
              return (
                <button key={index} onClick={() => isLeavingRegistrationPage(`/${lang}${item.link}`)}>
                  <p
                    className={` text-left text-16 leading-4 text-primaryGold  ${
                      matchingRoute(item.link) ? "font-bold" : "font-medium"
                    } hover:font-bold`}
                  >
                    {item.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderNavbarContent = () => {
    // Checkout Page && orderComplete Navbar
    if (pageName === "checkout" || pageName === "order-complete") {
      return (
        <div className="checkoutNavbar">
          <button
            onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.INDEX}`)}
            className={`logo cursor-pointer ${
              scrollY > 350 ? "2xl:mr-[90px]" : " md:mr-[50px] lg:mr-[100px] 2xl:mr-[150px]"
            }`}
          >
            <Image src={Logo} alt={"logo"} width={0} height={0} sizes="100vw" />
          </button>
          {pageName === "checkout" ? (
            <Progress
              title={[`${translate("checkout.status1")}`, `${translate("checkout.status2")}`]}
              progress={1}
              lang={lang}
            />
          ) : (
            <Progress
              title={[`${translate("checkout.status1")}`, `${translate("checkout.status2")}`]}
              progress={2}
              lang={lang}
            />
          )}
        </div>
      );
    }

    if (width < 1024) {
      return (
        <div className="checkoutNavbar">
          {apiData?.cart?.branch && pageName !== "cart" ? (
            <DeliveryBar data={apiData} lang={lang} isCartMode={false} />
          ) : (
            <button
              onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.INDEX}`)}
              className="logo cursor-pointer"
            >
              <Image src={Logo} alt={"logo"} width={0} height={0} sizes="100vw" />
            </button>
          )}
          <MenuBtn />
        </div>
      );
    }

    if (width > 1024) {
      return (
        <div className="commonNavbar">
          <button onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.INDEX}`)} className="logo cursor-pointer">
            <Image src={Logo} alt={"logo"} width={0} height={0} sizes="100vw" />
          </button>
          {/* center of navbar*/}
          {changeDeliveryBar(scrollY)}
          {/* Right of navbar*/}
          <ul className={"navBarIcon"}>
            <li
              className="cartIcon cursor-pointer"
              onClick={() => isLeavingRegistrationPage(`/${lang}/${ROUTES.CART}`)}
            >
              <CartWithTotalCount />
            </li>
            <li className="memberNameIcon" ref={memberNameRef}>
              <button className="h-auto w-[110%] cursor-pointer ">
                {isAlreadyLogin && profile ? (
                  <div
                    // onClick={() => redirectTo(`/${ROUTES.MEMBER}`)}
                    onMouseEnter={() => setToogleMember(true)}
                    className={`loginIcon ${toogleMember ? "bg-primaryGold" : "bg-primaryDark"}`}
                  >
                    <p>{(profile?.lastName ?? "")?.[0]?.toUpperCase()}</p>
                  </div>
                ) : (
                  <Image src={memberImg} alt="cart" width={0} height={0} onClick={handleRedirectToLogin} />
                )}
              </button>
              {toogleMember && width > 1024 && memberDropdown()}
            </li>
            <li
              className={`${
                scrollY > 350 && apiData?.cart?.branch && isMenuOpen === false ? "hidden" : "block"
              } switchIcon`}
            >
              <CustomSwitch type={"language"} />
            </li>
            <li className={`${scrollY > 350 && apiData?.cart?.branch && isMenuOpen === false ? "hidden" : "block"} `}>
              <MenuBtn />
            </li>
          </ul>
        </div>
      );
    }

    return <></>;
  };

  return (
    <>
      <div
        className={`relative w-full
      ${
        locationForMoreThanTwoFolder === "payment-in-progress" || pageName === "cart"
          ? width > 736
            ? "bg-primaryGrey"
            : "bg-MainBG"
          : "bg-primaryGrey"
      }`}
      >
        <div className="navBar wrapper">{renderNavbarContent()}</div>
      </div>
    </>
  );
};
