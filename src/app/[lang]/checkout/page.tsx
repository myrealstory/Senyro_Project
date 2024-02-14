"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { mockPolicies, mockTerms } from "@/app/mock/mockTerms";
import PickupInfo from "@/components/checkout/PickupInfo";
import useApplePay from "@/hook/useApplePay";
import useGooglePay from "@/hook/useGooglePay";
import { ROUTES } from "@/constants";
import { Checkbox, PrivacyPolicyPopup } from "@/components/forms";
import { RootState } from "@/redux/store";
import { SlidePanel } from "@/components/SlidePanel";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useWindowSize } from "@/hook/useWindowSize";
import { LocaleKeysType } from "@/app/i18n";
import { FullScreenCheckoutLoader } from "@/components/checkout/FullScreenCheckoutLoader";
import { useSendCheckoutApiMutation } from "@/redux/api/orderCheckoutApi";
import {
  handleAlertMessage,
  isSelectedApplePay,
  isSelectedGooglePay,
  mpgsErrorMapper,
  promotionOrCouponErrorMapper,
} from "@/utils/clientUtils";
import { useOrderCheckoutSlice } from "@/redux/slice/orderCheckoutSlice";
import { generateCheckoutRequestPayload } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { setIsPaymentInProgressPopupDisplay, setLoadingScreenDisplay, setSourceForAddCart } from "@/redux/slice/generalStateSlice";
import "@/style/orderForm/orderForm.scss";
import { createPortal } from "react-dom";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";
import { useLazyGetCartRequestQuery } from "@/redux/api/cartSliceApi";
import { useGetProfileLazyQuery } from "@/redux/api/memberApi";
import { CartApiAlertType } from "@/types/cartTypes";
import { deleteCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";

export default function Checkout({ params }: { params: { id: string; lang: LocaleKeysType } }) {
  const lang = params.lang;
  const router = useRouter();
  const dispatch = useDispatch();
  const { translate } = useTranslation(lang);
  const { applepay } = useApplePay();
  const { googlepay } = useGooglePay();
  const [isCheckoutTimeout, setIsCheckoutTimeout] = useState(false);
  const orderCheckoutInfo = useSelector((state: RootState) => state.orderCheckout);
  const { isApplyingDiscount, isProjectInit } = useSelector((state: RootState) => state.generalState);
  const { apiData } = useSelector((state: RootState) => state.cart);
  const [sendCheckoutRequest, { isLoading, error: checkoutRequestError }] = useSendCheckoutApiMutation();
  const { setCheckoutFormData, setCheckoutFormErrorData } = useOrderCheckoutSlice();
  const [isPageReady, setIsPageReady] = useState(false);
  const [footerHeight, setFooterHeight] = useState<DOMRect["height"]>(0);
  const [getCartRequest] = useLazyGetCartRequestQuery();
  const [getProfile] = useGetProfileLazyQuery();

  const [returnHtmlPayload, setReturnHtmlPayload] = useState<{ returnHtml: string; returnHtmlScriptId: string } | null>(
    null
  );
  const { width } = useWindowSize();

  const isMobileView = width < 1024;

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    dispatch(setSourceForAddCart("confirm"));
    dispatch(setLoadingScreenDisplay(false));
  }, []);

  useEffect(() => {
    if (apiData.cart?.cartItems?.length) {
      setIsPageReady(true);
    }
  }, [apiData]);

  useEffect(() => {
    if (isProjectInit && !apiData.cart?.cartItems?.length) {
      window.location.href = `/${ROUTES.INDEX}`;
    }
  }, [apiData, isProjectInit]);

  useEffect(() => {
    let int: NodeJS.Timer | undefined;
    if (isMobileView) {
      int = setInterval(() => {
        if (!footerHeight) {
          const footerDiv = document.getElementById("footer");
          if (footerDiv && footerDiv.childNodes?.length) {
            const footer = (footerDiv.childNodes[0] as HTMLElement).getBoundingClientRect();
            setFooterHeight(footer.height + 40);
          }
        } else {
          clearInterval(int);
        }
      }, 100);
      int;
    }

    return () => {
      int && clearInterval(int);
    };
  }, [isMobileView, footerHeight]);

  useEffect(() => {
    const error = checkoutRequestError as any;
    if ((error?.message === "Aborted" && error?.name === "AbortError") ||
      error?.status === "FETCH_ERROR") {
      setIsCheckoutTimeout(true);
    } else if (checkoutRequestError) {
      console.error(JSON.stringify(error));
    }
  }, [checkoutRequestError]);

  useEffect(() => {
    if (returnHtmlPayload?.returnHtml?.length && returnHtmlPayload.returnHtmlScriptId?.length) {
      setTimeout(() => {
        setReturnHtmlPayload(null);
        (["popup", "static"] as CartApiAlertType[]).forEach(alertType => {
          mpgsErrorMapper({
            alertCode: "34014",
            alertMessage: "",
            alertItems: [],
            alertType,
          },
          dispatch,
          translate,
          lang,
        )})
        
      }, Number(process.env.NEXT_PUBLIC_CHECKOUT_TIMEOUT) ?? 15 * 60 * 1000)
    }
  }, [returnHtmlPayload])

  const isConfirmButtonDisable = useMemo(() => {
    return isApplyingDiscount || !!Object.values(orderCheckoutInfo.error).filter(err => err.hasError).length;
  }, [isApplyingDiscount, orderCheckoutInfo]);

  // token is for mobile payment
  const pay = async (token?: any) => {
    setIsCheckoutTimeout(false);
    const requestBody = generateCheckoutRequestPayload(orderCheckoutInfo);
    // pay with mobile wallet (google/apple)
    if (token) {
      requestBody.paymentInfo.details = { token };
    }

    const checkoutRequestResponse = await sendCheckoutRequest(requestBody).unwrap();

    if (checkoutRequestResponse?.statusCode === 200 && checkoutRequestResponse?.data?.result === "FAILED") {
      if (checkoutRequestResponse?.data?.alertList?.length) {
        const haveError = promotionOrCouponErrorMapper(checkoutRequestResponse.data, dispatch, translate, lang);
        
        if (!haveError.memberCouponId && !haveError.memberPointRedeem && !haveError.promoCode && !haveError.mpgsError) {
          handleAlertMessage({
            alertList: checkoutRequestResponse?.data?.alertList,
            dispatch,
            translate,
            lang,
            getCartRequest,
            getProfile,
          });
        }
      }
      if (checkoutRequestResponse?.data) {
        dispatch(setCartApiData(checkoutRequestResponse?.data));
        dispatch(setCartLocalDataFromApiData({ ...checkoutRequestResponse?.data, isCartPage: true }));
      }
      return;
    }

    if (checkoutRequestResponse?.returnCode) {
      if (checkoutRequestResponse?.returnCode === "33008") {
        setCookie(CookiesKey.isPaymentInProgress, "true");
        dispatch(setIsPaymentInProgressPopupDisplay(true));
      } else {
        deleteCookie(CookiesKey.isPaymentInProgress);
      }
      if (checkoutRequestResponse?.returnCode === "33000" || checkoutRequestResponse?.returnCode === "33004" || checkoutRequestResponse?.returnCode === "35001") {
        window.location.href = `/${lang}/${ROUTES.CART}`;
      }
      console.warn(checkoutRequestResponse);
      return false;
    }

    if (checkoutRequestResponse?.statusCode === 200 && checkoutRequestResponse?.data?.orderStatus === "SUCCESS") {
      window.location.href = `/${lang}/${ROUTES.ORDER_COMPLETE}`;
    }

    const { redirectLink, returnHtml, returnHtmlScriptId, returnStatus } = checkoutRequestResponse.data;

    if (redirectLink) {
      window.location.href = redirectLink;

      return true;
    } else if (returnHtml && returnHtmlScriptId) {
      setReturnHtmlPayload({
        returnHtml,
        returnHtmlScriptId,
      });

      return true;
    } else if (returnStatus === "success") {
      router.push(`/${ROUTES.CHECKOUT}/${ROUTES.PROCESSING}`);

      return true;
    } else {
      // TODO: handle exception
      return false;
    }
  };

  const saveSubmitInfoInLocalStorage = () => {
    const info = {
      firstName: orderCheckoutInfo.firstName,
      lastName: orderCheckoutInfo.lastName,
      mobileNumber: orderCheckoutInfo.mobileNumber,
      email: orderCheckoutInfo.email,
      memberPointRedeem: orderCheckoutInfo.memberPointRedeem,
      memberCouponId: orderCheckoutInfo.memberCouponId,
      saveCardPaymentMethodId: orderCheckoutInfo.saveCardPaymentMethodId,
      selectedPaymentMethodId: orderCheckoutInfo.selectedPaymentMethodId,
      saveCardEnabled: orderCheckoutInfo.saveCardEnabled,
      savedCardId: orderCheckoutInfo.savedCardId,
      optin: orderCheckoutInfo.optin,
      agree: orderCheckoutInfo.agree,
      promoCode: orderCheckoutInfo.promoCode,
    }
    setCookie(CookiesKey.checkoutFormInfo, window.btoa(JSON.stringify(info)));
  }

  const handleOrderComplete = () => {
    const isApplePay = isSelectedApplePay(orderCheckoutInfo.selectedPaymentMethodId);
    const isGooglePay = isSelectedGooglePay(orderCheckoutInfo.selectedPaymentMethodId);
    saveSubmitInfoInLocalStorage();
    if (isApplePay) {
      applepay(pay);
    } else if (isGooglePay) {
      googlepay(pay);
    } else {
      pay();
    }
  };

  const handleShowTermsModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowTermsModal(!showTermsModal);
  };
  const handleShowPrivacyModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPrivacyModal(!showPrivacyModal);
  };

  if (!isPageReady) {
    return <></>;
  }

  return (
    <>
      <FullScreenCheckoutLoader
        returnHtmlPayload={returnHtmlPayload}
        isLoading={Boolean(isLoading || returnHtmlPayload)}
        lang={lang}
      />
      <div
        className="relative mx-auto h-full w-full max-w-full px-4 pt-4 text-primaryDark 
      sm:max-w-[500px] 
      md:max-w-[900px] 
      md:pb-[150px] 
      md:pt-[2.2vw] 
      lg:max-w-[1078px] 
      xl:max-w-[1100px] 2xl:max-w-[1300px]"
      >
        <div className="relative flex w-full flex-col justify-between lg:flex-row lg:gap-[2rem] xl:gap-16 xl:px-5">
          <div className="  w-full md:mb-0 lg:w-[50%] lg:min-w-[550px]">
            <PickupInfo lang={lang} />
            <CheckoutForm lang={lang} isCheckoutTimeout={isCheckoutTimeout} />
          </div>

          {!isMobileView && (
            <div className="relative hidden w-[50%] justify-start gap-6 lg:flex lg:flex-col xl:px-5 2xl:px-10">
              <SlidePanel
                onClick={handleOrderComplete}
                lang={lang}
                mode="CHECKOUT"
                disabled={isConfirmButtonDisable}
                containerStyle="lg:w-[500px]"
              />
            </div>
          )}

          <div
            style={{
              marginBottom: footerHeight,
            }}
            className="md:hidden"
          >
            <div
              id="mobileSlidePanel"
              className="relative z-[999] h-full w-full rounded-b-[24px] rounded-t-[24px] bg-white p-4 md:bg-transparent md:px-0 "
            >
              <SlidePanel onClick={handleOrderComplete} lang={lang} mode="CHECKOUT" disabled={isConfirmButtonDisable} />
            </div>
            <div className="relative z-[999] py-3">
              <Checkbox
                labelFor={"agree"}
                labelText={
                  <p className="break-words text-xl leading-[22px] text-primaryGold">
                    {translate("checkout.checkboxMsg")}
                    {/* <a
                      target="_blank"
                      href={`/${lang}/${ROUTES.TERMS_AND_CONDITION}`}
                      className="cursor-pointer font-semibold underline"
                    >
                      {translate("checkout.terms")}
                    </a> */}
                    <button onClick={handleShowTermsModal} className="cursor-pointer font-semibold underline">
                      {translate("checkout.terms")}
                    </button>
                    {translate("checkout.and")}
                    {/* <a
                      target="_blank"
                      href={`/${lang}/${ROUTES.PRIVACY_AND_POLICY}`}
                      className="font-semibold underline"
                    >
                      {translate("checkout.policy")}
                    </a> */}
                    <button onClick={handleShowPrivacyModal} className="cursor-pointer font-semibold underline">
                      {translate("checkout.policy")}
                    </button>
                    {translate("checkout.checkboxMsgEnd")}
                  </p>
                }
                type={"checkbox"}
                name={"agree"}
                id={"agree"}
                required={true}
                checked={orderCheckoutInfo.agree}
                onChange={e => {
                  dispatch(
                    setCheckoutFormData({
                      agree: e.target.checked,
                    })
                  );
                  dispatch(
                    setCheckoutFormErrorData({
                      key: "agree",
                      hasError: !e.target.checked,
                    })
                  );
                }}
              />
            </div>
          </div>
          <div className="md:hidden">
            <SlidePanel mode="NORMAL" onClick={handleOrderComplete} lang={lang} disabled={isConfirmButtonDisable} />
          </div>
        </div>
      </div>

      {/* {showTermsModal &&
        createPortal(
          <TermsAndConditionPopup terms={Terms} onClose={handleShowTermsModal} showModal={showTermsModal} />,
          document.body
        )} */}

      {showTermsModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockTerms}
            lang={lang}
            onClose={handleShowTermsModal}
            showModal={showTermsModal}
          />,
          document.body
        )}

      {showPrivacyModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockPolicies}
            lang={lang}
            onClose={handleShowPrivacyModal}
            showModal={showPrivacyModal}
          />,
          document.body
        )}
    </>
  );
}
