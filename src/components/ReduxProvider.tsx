"use client";
import React, { useCallback, useEffect } from "react";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import debounce from "lodash.debounce";

import { ROUTES } from "@/constants";
import { store } from "@/redux/store";
import { setProfileData } from "@/redux/slice/profileSlice";
import { ReduxProviderType } from "@/types/componentTypes";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { setFTOPOptionsFromCartData } from "@/redux/slice/firstTimeOrderPopupSlice";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";
import { setGlobalAlertStatus, setIsPaymentInProgressPopupDisplay, setIsProjectInit, setLoadingScreenDisplay, setTopBarErrorMessage } from "@/redux/slice/generalStateSlice";
import { useTranslation } from "@/app/i18n/client";
import { getBrowserAgent, handleAlertMessage } from "@/utils/clientUtils";
import { deleteCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { useAddCartRequestMutation, useLazyGetCartRequestQuery } from "@/redux/api/cartSliceApi";
import { SupportedBrowserConfig } from "@/config";

const ChildrenComponent = ({ children, initValue, lang }: ReduxProviderType) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { translate } = useTranslation(lang);
  const secondSlug = getRouteNameFromPathname(pathname).secondSlug;
  const isProjectInit = store.getState().generalState.isProjectInit;
  const [addCartRequest] = useAddCartRequestMutation();
  const [getCartRequest] = useLazyGetCartRequestQuery();

  const deleteUselessCookie = () => {
    if (secondSlug !== ROUTES.CHECKOUT) {
      deleteCookie(CookiesKey.checkoutFormInfo);
    }
  }

  const debounceFunction = useCallback(
    debounce((callback: (...params: any) => any) => {
      if (callback) {
        return callback();
      }
      return null;
    }, 500),
    []
  );

  const whenUserLoginStatusIsInvalid = (profileError? : {
    message: string;
    returnCode: string;
    statusCode: number;
}) => {
    deleteCookie(CookiesKey.accessToken);
    if (profileError?.returnCode === "40002" || profileError?.returnCode === "10003") {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: true,
          alertContent: translate("alertModal.fl2_popup_content"),
          rightButtonText: translate("alertModal.fl2_popup_right_button_text"),
          onRightButtonClick: () => {
            setCookie(CookiesKey.targetPageToBeRedirectedTo, `/${lang}/${ROUTES.MEMBER}`);
            window.location.href = `/${lang}/${ROUTES.LOGIN}`;
          },
        })
      );
    } else if (profileError?.returnCode === "40003") {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: true,
          alertContent: translate("alertModal.fl3_popup_content"),
          rightButtonText: translate("alertModal.fl3_popup_right_button_text"),
          onRightButtonClick: () => {
            setCookie(CookiesKey.targetPageToBeRedirectedTo, `/${lang}/${ROUTES.MEMBER}`);
            window.location.href = `/${lang}/${ROUTES.LOGIN}`;
          },
        })
      );
    }
  } 

  const prepareErrorMessage = () => {
    const error: string[] = [];
    Object.entries(initValue).forEach(([, value]: any) => {
      if (value.status !== 200 && value.error) {
        error.push(`Api: ${value.error.api} Error: ${JSON.stringify(value.error.error)}`);
      }
    });
    dispatch(setTopBarErrorMessage(error));
  };

  const checkIfBrowserIsSupported = () => {
    const browser = getBrowserAgent();
    if (!SupportedBrowserConfig.includes(browser)) {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: true,
          alertTitle: translate("alertModal.g88_popup_title"),
          rightButtonText: translate("alertModal.g88_popup_right_button_text"),
        })
      );
    }
  }

  const initProject = (init: typeof initValue) => {
    if (!isProjectInit) {
      deleteUselessCookie();
      checkIfBrowserIsSupported();
      if (secondSlug === ROUTES.MEMBER) {
        dispatch(setLoadingScreenDisplay(true));
      }
  
      dispatch(setTopBarErrorMessage([]));
      prepareErrorMessage();
  
      if (init?.addCartAfterMemberLogin?.status === 200 && (init?.addCartAfterMemberLogin?.data as any)?.data?.alertList?.length) {
        handleAlertMessage({
          alertList: (init?.addCartAfterMemberLogin?.data as any)?.data?.alertList,
          dispatch,
          translate,
          lang,
          extraInfo: {
            isGuest: false,
            globalSelectedProductSkuCode: (init?.addCartAfterMemberLogin?.data as any)?.data?.alertList?.[0]?.alertItems?.[0]?.skuCode,
          },
        })
      }
  
      if (init?.cart?.status === 200) {
  
        if (init?.cart?.data?.cart?.isCartLocked) {
          setCookie(CookiesKey.isPaymentInProgress, "true");
          dispatch(setIsPaymentInProgressPopupDisplay(true));
        } else {
          deleteCookie(CookiesKey.isPaymentInProgress);
        }
  
        const isCartPage = secondSlug === ROUTES.CART;
        dispatch(setCartApiData(init?.cart?.data));
        dispatch(setCartLocalDataFromApiData({ ...init?.cart?.data, isCartPage }));
        dispatch(setFTOPOptionsFromCartData(init?.cart?.data));
  
        if (init?.cart?.data?.alertList?.length) {
          handleAlertMessage({
            alertList: init?.cart?.data?.alertList,
            dispatch,
            translate,
            lang,
            addCartRequest,
            getCartRequest,
          })
        }
      }
  
      if (init?.profile?.status === 200) {
        dispatch(setProfileData(init?.profile?.data));
      } else {
        whenUserLoginStatusIsInvalid(init?.profile?.error);
      }
  
      dispatch(setIsProjectInit(true));
    }
  }
  
  useEffect(() => {
    if (initValue) {
      debounceFunction(initProject(initValue));
    }
  }, [initValue])

  return <>{children}</>;
};

export function ReduxProvider({ children, initValue, lang }: ReduxProviderType) {
  return (
    <Provider store={store}>
      <ChildrenComponent lang={lang} initValue={initValue}>{children}</ChildrenComponent>
    </Provider>
  );
}
