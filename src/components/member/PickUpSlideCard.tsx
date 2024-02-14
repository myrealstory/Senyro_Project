"use client";

import { useState } from "react";
import Image from "next/image";
import PickupCode from "@/images/icons/Icon_pickupCode-white@3x.png";
import Receipt from "@/images/icons/Icon_transaction-white.png";
import ReceiptGold from "@/images/icons/Icon_receipt-gold@3x.png";
import Reorder from "@/images/icons/Icon_reorder@3x.png";
import Link from "next/link";
import { awaitPickupOrdersType } from "@/types/api/apiTypes";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import { useReOrderMutation } from "@/redux/api/memberApi";
import { setGlobalAlertStatus, setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import { useDispatch, useSelector } from "react-redux";
import "@/style/member/member.scss";
import { createPortal } from "react-dom";
import { PickupQRCode } from "./PickupQRCode";
import { useGetOnlineGuestOrderReceiptLazyQuery } from "@/redux/api/orderCheckoutApi";
import { RootState } from "@/redux/store";
import { deleteCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";

export const PickUpSlideCard = ({
  lang,
  pickupOrder,
  isLogin,
}: {
  lang: LocaleKeysType;
  pickupOrder: awaitPickupOrdersType;
  isLogin: boolean;
}) => {
  const [qrCodeString, setQrCodeString] = useState("");
  const [pickupNo, setPickupNo] = useState("");
  const orderNum = pickupOrder.orderNumber;
  const embeddedOrderStr = pickupOrder.embeddedOrderStr;
  const profile = useSelector((state: RootState) => state.profile);
  const { globalSelectedProductSkuCode } = useSelector((state: RootState) => state.generalState);
  const { apiData } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const { translate: t } = useTranslation(lang);
  const [reOrderRequest] = useReOrderMutation();
  const [getReceiptDataRequest] = useGetOnlineGuestOrderReceiptLazyQuery();

  const reorder = () => {
    dispatch(setLoadingScreenDisplay(true));
    reOrderRequest({
      orderNumber: orderNum,
      globalSelectedProductSkuCode,
      branchCode: apiData?.cart?.branch?.branchCode,
    })
      .unwrap()
      .then(() => {
        window.location.href = `/${ROUTES.CART}`;
      })
      .catch(err => {
        dispatch(setLoadingScreenDisplay(false));
        alert(err);
      });
  };

  const handleShowPopup = () => {
    getReceiptDataRequest({
      orderNumber: embeddedOrderStr,
    })
      .unwrap()
      .then(res => {
        if (res.statusCode === 200 && res.data.pickupQrCodeStr?.length) {
          setQrCodeString(res.data.pickupQrCodeStr);
          setPickupNo(res.data.pickupNo);
          return;
        }
        return Promise.reject({
          status: res.statusCode,
          error: res,
        });
      })
      .catch(error => {
        if (error?.error?.returnCode === "10003") {
          dispatch(
            setGlobalAlertStatus({
              isGlobalAlertDisplay: true,
              alertContent: t("alertModal.fl2_popup_content"),
              rightButtonText: t("alertModal.fl2_popup_right_button_text"),
              onRightButtonClick: () => {
                deleteCookie(CookiesKey.accessToken);
                setCookie(CookiesKey.targetPageToBeRedirectedTo, `/${lang}/${ROUTES.MEMBER}`);
                window.location.href = `/${lang}/${ROUTES.LOGIN}`;
              },
            })
          );
        } else {
          alert(`Popup QR code error:, ${JSON.stringify(error)}`);
        }
        
      });
  };

  return (
    <>
      <div className="transactionPickupSliderOuterContainer">
        <div className="transactionPickupSliderInnerContainer">
          <div className="transactionPickupSlider">
            <div className="transactionPickupSliderBtns">
              <h2 className="">
                {t("transactions.onlineOrder")} #{pickupOrder.orderNumber}
              </h2>
              <button
                onClick={() => {
                  reorder();
                }}
              >
                <Image src={Reorder} width={20} height={20} alt="Click to add" />
              </button>
            </div>
            <div className="transactionPickupSliderDetails">
              <span>
                {t("transactions.orderDate")} : {pickupOrder.orderDatetime}
              </span>
              <span>
                {t("transactions.pickupDate")} : {pickupOrder.pickupDatetime}
              </span>
              <span>
                {t("transactions.pickupStore")} : {pickupOrder.pickupStoreName}
              </span>
            </div>
            <button
              onClick={() => {
                reorder();
              }}
              className="transactionPickupSliderReorderBtn"
            >
              {t("transactions.reOrder")}
            </button>
          </div>
          <div className="transactionPickupSliderActionBtns">
            <button onClick={handleShowPopup}>
              <Image src={PickupCode} width={15} height={15} alt="Click to get pickup code" />
              <span className="pickupQRCodeBtnText">{t("transactions.pickupCode")}</span>
            </button>
            <Link
              target="_blank"
              href={`/${lang}/${ROUTES.TRANSACTION_ONLINE}/${isLogin ? "member" : "guest"}/${embeddedOrderStr}`}
            >
              <Image src={Receipt} width={16} height={16} alt="Click to get receipt" className="hidden lg:block" />
              <Image src={ReceiptGold} width={15} height={15} alt="Click to get receipt" className="block lg:hidden" />
              <span>{t("transactions.onlineReceiptBtn")}</span>
            </Link>
          </div>
        </div>
      </div>
      {qrCodeString.length > 0 &&
        createPortal(
          <PickupQRCode
            lang={lang}
            memberTier={profile.memberTier}
            isPopupOpen={qrCodeString.length > 0}
            onClose={() => setQrCodeString("")}
            qrCodeString={qrCodeString}
            pickupNo={pickupNo}
          />,
          document.body
        )}
    </>
  );
};
