"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Tooltips_Visa from "@/images/icons/Tooltips_Visa Master.png";
import Tooltips_AE from "@/images/icons/Tooltips_AE.png";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setIsCVVPopup } from "@/redux/slice/generalStateSlice";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { useWindowSize } from "@/hook/useWindowSize";
import { useComponentLostFocus } from "@/hook/useComponentLostFocus";

export const CreditCardInfoPopUp = () => {
  const wrapperRef = useRef(null);
  const isCVVPopup = useSelector((state: RootState) => state.generalState.isCVVPopup);
  const dispatch = useDispatch();
  const path = usePathname();
  const lang = getLangFromString(path);
  const thirdPathName = path.split("/")[3];
  const { translate: t } = useTranslation(lang);
  const { width } = useWindowSize();

  useComponentLostFocus(wrapperRef, () => {
    dispatch(setIsCVVPopup(false));
  });

  const style = {
    containerStyle: `${
      width < 1024
        ? "before:backdrop-filter before:backdrop-blur-sm before:bg-white/40 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:z-[-1] -translate-x-1/2 -translate-y-1/2 w-full h-full"
        : ""
    }`,
  };

  const renderContent = () => {
    if (width > 768) {
      return (
        <div
          className={
            "mb-6 h-auto w-[343px] overflow-hidden rounded-3xl bg-white px-[60px] py-10 shadow-filterBarShadow md:w-[700px] "
          }
        >
          <h4 className="text-center font-semibold leading-[45px] text-primaryDark md:mb-8 md:text-25">
            {t("checkout.whatCVV")}
          </h4>
          <div className="flex w-full items-center justify-between md:flex-row">
            <div>
              <Image
                src={Tooltips_Visa}
                alt="tooltips_Visa"
                width={0}
                height={0}
                sizes="100vw"
                className={`${thirdPathName === "add-cards" ? "h-[173px]" : "h-[198px]"}  w-auto object-contain`}
              />
              <div className="text-center text-primaryDark md:text-18 md:leading-[34px]">
                <p className="mb-1 text-primaryGold">{t("checkout.VMcard")}</p>
                <p>{t("checkout.threedigits")}</p>
              </div>
            </div>
            <div>
              <Image
                src={Tooltips_AE}
                alt="tooltips_AE"
                width={0}
                height={0}
                sizes="100vw"
                className={`${thirdPathName === "add-cards" ? "h-[170px]" : "h-[200px]"}   w-auto object-contain`}
              />
              <div className="text-center text-primaryDark md:text-18 md:leading-[34px]">
                <p className="text-primaryGold">{t("checkout.AEcard")}</p>
                <p>{t("checkout.fourdigits")}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (width < 768) {
      return (
        <>
          <div
            className={
              "relative mb-6 h-auto w-[343px] overflow-hidden rounded-3xl bg-white px-[60px] py-10 shadow-filterBarShadow"
            }
          >
            <h4 className=" mb-0 text-center text-18 font-semibold leading-[45px] text-primaryDark">
              {t("checkout.whatCVV")}
            </h4>
            <div className="flex w-full flex-col items-center justify-between ">
              <div className="mb-8 ">
                <Image
                  src={Tooltips_Visa}
                  alt="tooltips_Visa"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-[198px] w-auto object-contain"
                />
                <div className="text-center text-16 leading-6 text-primaryDark">
                  <p className="mb-1 text-primaryGold">{t("checkout.VMcard")}</p>
                  <p>{t("checkout.threedigits")}</p>
                </div>
              </div>
              <div>
                <Image
                  src={Tooltips_AE}
                  alt="tooltips_AE"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-[200px] w-auto object-contain"
                />
                <div className="text-center text-16 leading-5  text-primaryDark">
                  <p className="mb-1 text-primaryGold">{t("checkout.AEcard")}</p>
                  <p>{t("checkout.fourdigits")}</p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="absolute -bottom-16 left-1/2 aspect-square h-auto w-[56px] -translate-x-1/2 rounded-xl bg-white shadow-filterBarShadow before:absolute before:left-1/2 before:top-1/2 before:h-[2px] before:w-6 before:origin-center before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-primaryDark after:absolute after:left-1/2 after:top-1/2 after:h-[2px] after:w-6 after:origin-center after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-primaryDark"
            onClick={() => dispatch(setIsCVVPopup(false))}
          ></button>
        </>
      );
    }
  };

  return (
    <>
      {isCVVPopup && (
        <div
          ref={wrapperRef}
          onClick={() => dispatch(setIsCVVPopup(false))}
          onMouseEnter={() => dispatch(setIsCVVPopup(true))}
          onMouseLeave={() => dispatch(setIsCVVPopup(false))}
          className={`fixed left-1/2 top-1/2 z-[19990] ${style.containerStyle}`}
        >
          <div
            className={`${
              thirdPathName === "add-cards"
                ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:-translate-x-[45%] md:-translate-y-[90%] 2xl:-translate-y-[80%]"
            } `}
          >
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};
