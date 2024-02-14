"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import "@/style/scrollBar/scrollBar.css";
import { RootState } from "@/redux/store";
import { CartPickupType } from "@/types/componentTypes";

import closeIcon from "../../../images/icons/Icon_page-close@3x.png";
import { CartPickupStep1 } from "./CartPickupStep1";
import { CartPickupStep2 } from "./CartPickupStep2";
import { CartPickupStep3 } from "./CartPickupStep3";
import {
  recoverStep1SelectedData,
  recoverStep2SelectedData,
  setIsBackFrom,
  setPage,
  setShouldCacheStep1,
} from "@/redux/slice/firstTimeOrderPopupSlice";
import { useTranslation } from "@/app/i18n/client";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { setGlobalAlertStatus, setIsCartPickupOpen } from "@/redux/slice/generalStateSlice";
import { useWindowSize } from "@/hook/useWindowSize";

export default function CartPickup({ onClose, title, lang, mode }: CartPickupType) {
  const dispatch = useDispatch();
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const { page } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const { cartType, isOpen } = useSelector((state: RootState) => state.generalState.isCartPickupOpen);
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();

  const stepRenderer = () => {
    if (page === 1) {
      return <CartPickupStep1 lang={lang} mode={mode} />;
    }
    if (page === 2) {
      return <CartPickupStep2 lang={lang} mode={mode} />;
    }
    if (page === 3 && cartType === "NEW" && isAlreadyLogin === false) {
      return <CartPickupStep3 lang={lang} />;
    }
    return <></>;
  };

  useEffect(() => {
    if (isOpen === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isOpen]);

  return (
    <div
      className={
        "fixed left-0 top-0 z-[1099] flex h-full w-full items-center justify-center bg-primaryGold1/80 backdrop-blur-[5px]"
      }
    >
      <div
        className={
          "border-blue-800 fixed left-0 top-0 z-[61] box-border inline-flex h-[100svh] w-full flex-col rounded-3xl border bg-MainBG px-4 pb-6 pt-[30px] md:left-1/2 md:top-1/2 md:h-[46rem] md:w-[57rem] md:-translate-x-1/2 md:-translate-y-1/2 md:px-[50px] md:py-9"
        }
      >
        {width < 1024 && (
          <div className="flex items-end justify-end">
            <button
              className="aspect-square h-auto w-[40px]"
              onClick={() => {
                onClose && onClose();
                // cartType === "NEW"
                let alertCode = "pu1";
                if (cartType === "EDIT") {
                  alertCode = "pu2";
                }
                dispatch(
                  setGlobalAlertStatus({
                    isGlobalAlertDisplay: true,
                    alertTitle: translate(`alertModal.${alertCode}_popup_title`),
                    alertContent: translate(`alertModal.${alertCode}_popup_content`),
                    leftButtonText: translate(`alertModal.${alertCode}_popup_left_button_text`),
                    rightButtonText: translate(`alertModal.${alertCode}_popup_right_button_text`),
                    onLeftButtonClick: () => {
                      dispatch(setIsCartPickupOpen({ isOpen: false }));
                      dispatch(setPage(1));
                      dispatch(recoverStep1SelectedData());
                      dispatch(recoverStep2SelectedData());
                    },
                  })
                );
                dispatch(setShouldCacheStep1(false));
                dispatch(setIsBackFrom(false));
              }}
            >
              <Image src={closeIcon} alt={""} />
            </button>
          </div>
        )}
        <div className="relative flex w-full items-center justify-between">
          <h2 className="text-[20px] font-semibold leading-[24px]  md:text-25 md:leading-[32px]">
            {title ? title : translate("popup.title")}
          </h2>
          {width > 1024 && (
            <button
              className="btnClose"
              onClick={() => {
                onClose && onClose();
                // cartType === "NEW"
                let alertCode = "pu1";
                if (cartType === "EDIT") {
                  alertCode = "pu2";
                }
                dispatch(
                  setGlobalAlertStatus({
                    isGlobalAlertDisplay: true,
                    alertTitle: translate(`alertModal.${alertCode}_popup_title`),
                    alertContent: translate(`alertModal.${alertCode}_popup_content`),
                    leftButtonText: translate(`alertModal.${alertCode}_popup_left_button_text`),
                    rightButtonText: translate(`alertModal.${alertCode}_popup_right_button_text`),
                    onLeftButtonClick: () => {
                      dispatch(setIsCartPickupOpen({ isOpen: false }));
                      dispatch(setPage(1));
                      dispatch(recoverStep1SelectedData());
                      dispatch(recoverStep2SelectedData());
                    },
                  })
                );
                dispatch(setShouldCacheStep1(false));
                dispatch(setIsBackFrom(false));
              }}
            ></button>
          )}
        </div>
        {stepRenderer()}
      </div>
    </div>
  );
}
