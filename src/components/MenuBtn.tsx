"use client";
import React from "react";
import "../style/component/component.scss";
import CustomSwitch from "./CustomSwitch";
import { useTranslation } from "@/app/i18n/client";
import IconLogout from "@/../images/icons/Icon_Logout@3x.png";
import Icon_Closed from "@/images/icons/Icon_page-close@3x.png";
import Image from "next/image";
import { MenuContent } from "@/constants/menu/dineInMenu";
import { useDispatch, useSelector } from "react-redux";
import { setIsMenuOpen } from "@/redux/slice/generalStateSlice";
import { RootState } from "@/redux/store";
import { useWindowSize } from "@/hook/useWindowSize";
import { useRouter, usePathname } from "next/navigation";
import { getLangFromString, getRouteNameFromPathname } from "@/utils/commonUtils";
import { deleteCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { ROUTES, RoutesNameType } from "@/constants";
import { alertMessageMapperForRegistration, handleAlertMessageForGeneralPage } from "@/utils/clientUtils";

export const MenuBtn = () => {
  const path = usePathname();
  const lang = getLangFromString(path);
  const slugs = getRouteNameFromPathname(path);
  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state: RootState) => state.generalState.isMenuOpen);
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const { width } = useWindowSize();
  const router = useRouter();
  const pageName = path.split("/")[2];

  const { isAlreadyLogin } = useIsAlreadyLogin();
  const gotoBack = () => {
    router.back();
  };

  const toogleOffMenu = () => {
    dispatch(setIsMenuOpen(false));
  };

  const toogleOpenMenu = () => {
    dispatch(setIsMenuOpen(true));
  };

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

  const { translate } = useTranslation(lang);

  const handleModal = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.classList.contains("bg-MainBG")) {
      dispatch(setIsMenuOpen(false));
    }
  };

  React.useEffect(() => {
    if (isMenuOpen === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isMenuOpen]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    if (isScrolling) {
      dispatch(setIsMenuOpen(false));
      setIsScrolling(false);
    }
  }, [isScrolling]);

  React.useEffect(() => {
    dispatch(setIsMenuOpen(false));
  }, [path]);

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
          if (
            ([ROUTES.MEMBER, ROUTES.COUPON_VALID, ROUTES.COUPON_EXPIRED] as RoutesNameType[]).includes(slugs.secondSlug)
          ) {
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
      className={`MenuTopContainer ${isMenuOpen === true ? "blackScreen" : "before:opacity-0"}`}
      onClick={e => handleModal(e)}
    >
      {width < 640 && pageName === "cart" ? (
        <button onClick={gotoBack} className="gotoBackButton">
          <Image src={Icon_Closed} alt="close" width={0} height={0} sizes="100vw" />
        </button>
      ) : (
        <button onClick={toogleOpenMenu}>
          <div className={"toogleMenuButton"}>
            <div className="btnMenu"></div>
          </div>
        </button>
      )}
      <div
        className={`scrollbarPattern innerMenuButton ${
          isMenuOpen ? "block md:translate-x-0 " : "hidden md:block md:translate-x-[999rem]"
        }${(pageName === "dine-in-walking-in-menu" || pageName === "news-offers") && isMenuOpen ? "" : ""}`}
      >
        <div className="">
          <div className="innerWebTopBar">
            <div>
              <CustomSwitch type={"language"} />
            </div>
            <button onClick={toogleOffMenu} className="btnClose " />
          </div>
          <div className="innerMobileTopBar">
            <CustomSwitch type={"language"} />
          </div>
          <div className="innerContentContainer">
            {MenuContent.map((item, index) => (
              <button key={index} onClick={() => isLeavingRegistrationPage(`/${lang}/${item.link}`)}>
                <div className="buttonNumber ">{`0${index + 1}`}</div>
                <div className="buttonContent">{translate(`menu.${item.translate}`)}</div>
              </button>
            ))}
          </div>
          {isAlreadyLogin && (
            <button className="loginButton" onClick={handleLogOut}>
              <Image src={IconLogout} alt="logout" width={0} height={0} sizes="100vw" />
              <p>{translate("menu.logout")}</p>
            </button>
          )}
          {/* <div className=' hidden md:flex justify-start xl:pb-[4.6vw] md:pl-[5.8vw] pl-10 '>
                                <CustomSwitch type={'language'} />
                            </div> */}
        </div>
      </div>
    </div>
  );
};
