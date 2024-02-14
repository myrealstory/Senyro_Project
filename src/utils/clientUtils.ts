import { deleteCookie, getCookie, setCookie } from "cookies-next";

import { CookiesKey } from "@/constants/cookies";
import { useWindowSize } from "@/hook/useWindowSize";
import {
  CartApiAlertCode,
  CartApiAlertListType,
  CartApiAlertType,
  CartApiDataType,
  CartBranchType,
} from "@/types/cartTypes";
import { LocalStorageProps } from "@/types/index/indexType";
import { defaultMemberCookie } from "@/constants/product/CartPicker";
import { FetchRequest, FetchResponse } from "@/types/commonTyps";
import { LocaleKeysType, defaultLocale } from "@/app/i18n";

import {
  doesValueExist,
  fetchRequest,
  mappingResultForAlertCode38000Checkout,
  mappingResultForAlertCode38000,
  getLangFromString,
  stuipMessage,
} from "./commonUtils";
import {
  ApplepayPaymentMethodIds,
  CreditCardPaymentMethodIds,
  GooglepayPaymentMethodIds,
  SavedCardIds,
  setCheckoutFormErrorData,
} from "@/redux/slice/orderCheckoutSlice";
import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { TFunction } from "i18next";
import { AnyAction, Dispatch } from "redux";
import {
  resetGlobalAlertStatus,
  resetMemberPoint,
  setDimmedSetProductSkuCodes,
  setGlobalAlertStatus,
  setIsAddButtonDisable,
  setIsCartPickupOpen,
  setIsPaymentInProgressPopupDisplay,
  setLoadingScreenDisplay,
  setLoginRedirectUrl,
  setMPGSError,
  setMultiNextToFieldSkuWithDataStatus,
  setMultiReminderAlertStatus,
  setNextToFieldStatus,
  setNoPreSelectBranch,
  setProductArchorId,
  setReminderAlertStatus,
  setSecondStaticMessageOnTargetPage,
  setStaticMessageOnTargetPage,
} from "@/redux/slice/generalStateSlice";
import { setBranchPickupInfo, setIsBackFrom, setPage, setShouldCacheStep1 } from "@/redux/slice/firstTimeOrderPopupSlice";
import { ENDPOINTS, ROUTES } from "@/constants";
import moment from "moment";
import { StaticMessageOnTargetPage } from "@/types/generalTypes";
import { AvailablePickupTimesApiParamsType } from "@/types/componentTypes";
import { BranchesType } from "@/types/branchTypes";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";

const fetchRequestClientSide = async <T>({
  url,
  params,
  body,
  language,
  options,
}: FetchRequest): Promise<FetchResponse<T>> => {
  const deviceId = getCookie(CookiesKey.deviceId);
  const accessToken = getCookie(CookiesKey.accessToken);
  const newOptions = {
    ...options,
    headers: Object.assign(
      {},
      options.headers,
      { "device-id": deviceId },
      accessToken ? { authorization: `Bearer ${accessToken}` } : {}
    ),
  };
  return fetchRequest({ url, params, body, language, options: newOptions });
};

const getRequestCommonHeader = (language?: LocaleKeysType) => {
  const deviceId = getCookie(CookiesKey.deviceId);
  const accessToken = getCookie(CookiesKey.accessToken);
  const lang = window?.location?.pathname ? getLangFromString(window.location.pathname) : defaultLocale;
  return Object.assign(
    {},
    {
      "touch-point": "web",
      language: language ?? lang,
      "device-id": deviceId as string,
    },
    accessToken ? { authorization: `Bearer ${accessToken}` } : {}
  );
};

const setIsScrollbarHidden = (isHidden: boolean) => {
  if (typeof window !== "undefined" && window?.document?.body?.style?.overflow) {
    window.document.body.style.overflow = isHidden ? "hidden" : "visible";
  }
};

const GetHeaderDisplay = (width: number, pathParts: string, memberState?: CartBranchType) => {
  const validFixedNav = {
    index: "index",
    products: "product",
    storeLocation: "store-location",
  };

  const validNoneNav = {
    maintenance: "maintenance",
    errorOops: "error-oops",
    maintenanceDaily: "maintenance-daily",
  };

  const validNoneBar = doesValueExist({ obj: validNoneNav, value: pathParts });

  if (pathParts) {
    if (
      (pathParts === validFixedNav.products && width > 640) ||
      (pathParts === validFixedNav.products && width < 640 && memberState !== undefined)
    )
      return "fixed";
    if (pathParts === validFixedNav.index && memberState !== undefined && width < 640) return "fixed";
    if (pathParts === validFixedNav.index && width > 640) return "fixed";
    if (pathParts === validFixedNav.storeLocation) return "fixed";
    if (validNoneBar) return "hidden";

    return "block";
  }
  return "block";
};

const useCalHeight = () => {
  const { scrollY, width } = useWindowSize();
  let threshold;

  if (width >= 1800) {
    threshold = 317;
  } else if (width >= 953) {
    const widthRange = 1920 - 953;
    const scrollYRange = 600 - 276;
    const widthDiff = 1920 - width;
    const scrollDiff = (widthDiff / widthRange) * scrollYRange;
    threshold = 560 - 53 - scrollDiff;
  } else {
    threshold = 155;
  }

  const shouldAppear = scrollY >= threshold;

  return { shouldAppear };
};

const LocalStorageUtils: LocalStorageProps = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return { status: 400, data: defaultMemberCookie };
      }
      const data = JSON.parse(item);
      return { status: 200, data };
    } catch (error) {
      return { status: 400, data: defaultMemberCookie };
    }
  },

  post: <T>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return { status: 200 };
    } catch (error) {
      console.log("Error posting item to local storage", error);
      return { status: 400 };
    }
  },

  delete: (key: string) => {
    try {
      localStorage.removeItem(key);
      return { status: 200 };
    } catch (error) {
      console.log("Error deleting item from local storage", error);
      return { status: 400 };
    }
  },
};

const isSelectedApplePay = (methodId: PAYMENT_METHOD) => {
  return ApplepayPaymentMethodIds.includes(methodId);
};

const isSelectedGooglePay = (methodId: PAYMENT_METHOD) => {
  return GooglepayPaymentMethodIds.includes(methodId);
};

const isSelectedCreditCard = (methodId: PAYMENT_METHOD) => {
  return CreditCardPaymentMethodIds.includes(methodId);
};

const isSelectedSavedCard = (methodId: PAYMENT_METHOD) => {
  return SavedCardIds.includes(methodId);
};

const isSafari = () => {
  if (typeof window !== "undefined") {
    if (!navigator.userAgent.includes("Chrome") && navigator.userAgent.includes("Safari")) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const alertModalMessageMapper = ({
  alertCode,
  alertType,
  translate,
  dispatch,
  alertList,
  lang,
  extraInfo,
  addCartRequest,
  getCartRequest,
  getProfile,
}: {
  alertCode: CartApiAlertCode;
  alertType: CartApiAlertType;
  translate: TFunction<string, string, string>;
  dispatch: Dispatch<AnyAction>;
  alertList: CartApiAlertListType[];
  lang: LocaleKeysType;
  extraInfo?: Record<string, any>;
  addCartRequest?: (...params: any) => any;
  getCartRequest?: (...params: any) => any;
  getProfile?: (...params: any) => any;
}) => {
  const info = {
    alertTitle: translate(`alertModal.${alertCode}_${alertType}_title`),
    alertContent: translate(`alertModal.${alertCode}_${alertType}_content`),
    leftButtonText: translate(`alertModal.${alertCode}_${alertType}_left_button_text`),
    onLeftButtonClick: (() => null) as () => any,
    rightButtonText: translate(`alertModal.${alertCode}_${alertType}_right_button_text`),
    onRightButtonClick: (() => null) as () => any,
    extraContent: "",
  };
  let items = [];

  switch (true) {
    // case alertCode === "38000_reorder_reorder"
    case alertCode === "38004_normal_add_first_item" && alertType === "popup":
      info.alertTitle = translate(`alertModal.${alertCode}_${alertType}_title`, {
        replace1: alertList[0].alertItems[0].name,
      });
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
        openCartPickupPopup(dispatch, "EDIT");
      };
      info.onRightButtonClick = () => {
        // archor back to where they add the item
        dispatch(setProductArchorId(extraInfo?.globalSelectedProductSkuCode));
      };
      break;
    case alertCode === "38004_platter_add_first_item" && alertType === "popup":
    case alertCode === "38005_normal_add_first_item" && alertType === "popup":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].name,
      });

      if (alertList[0].alertItems[0]?.effectivePeriodMessage?.length) {
        info.extraContent = `
        <p className={"mb-7 mt-10 text-17 leading-5 text-primaryDark md:mb-0 md:mt-5 md:leading-7"}>
          ${info.alertContent.replace(/&amp;/g, "&")}
          <br/>
          [${alertList[0].alertItems[0]?.effectivePeriodMessage}]
        </p>`


        info.alertContent = "";
      }

      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
        openCartPickupPopup(dispatch, "EDIT");
      };
      info.onRightButtonClick = () => {
        // archor back to where they add the item
        dispatch(setProductArchorId(extraInfo?.globalSelectedProductSkuCode));
      };
      break;
    case alertCode === "38003_normal_add_first_item" && alertType === "popup":
      info.alertTitle = translate(`alertModal.${alertCode}_${alertType}_title`, {
        replace1: alertList[0].alertItems[0].name,
      });
      break;
    case alertCode === "38007_platter_add_first_item" && alertType === "popup":
    case alertCode === "38007_normal_add_first_item" && alertType === "popup":
      info.alertTitle = translate(`alertModal.${alertCode}_${alertType}_title`, {
        replace1: alertList[0].alertItems[0].name,
      });
      info.onLeftButtonClick = () => {
        // archor back to where they add the item
        dispatch(setProductArchorId(extraInfo?.globalSelectedProductSkuCode));
      };
      info.onRightButtonClick = () => {
        if (extraInfo?.isGuest) {
          dispatch(setLoginRedirectUrl(window.location.pathname));
          setCookie(CookiesKey.addCartIsContinue, "true", {
            expires: moment().add(10, "minutes").toDate(),
          });
          setCookie(CookiesKey.targetPageToBeRedirectedTo, window.location.pathname, {
            expires: moment().add(10, "minutes").toDate(),
          });
          setCookie(
            CookiesKey.addCartBeforeMemberLogin,
            {
              branchCode: extraInfo?.selectedBranchCode,
              skuCode: extraInfo?.globalSelectedProductSkuCode,
              quantity: 1,
              pickupDatetime: extraInfo?.pickupDatetime,
              refCategoryType: extraInfo?.refCategoryData.refCategoryType,
              refCategoryTypeId: extraInfo?.refCategoryData.refCategoryTypeId,
            },
            {
              expires: moment().add(10, "minutes").toDate(),
            }
          );
          window.location.href = `/${lang}/${ROUTES.LOGIN}`;
        } else {
          window.location.href = `/${lang}/${ROUTES.MEMBER}`;
        }
      };
      break;
    case alertCode === "38007_platter_add_first_item" && alertType === "reminder":
    case alertCode === "38007_normal_add_first_item" && alertType === "reminder":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].memberTiers
          ? `${alertList[0].alertItems[0].memberTiers.join("/")} ${translate("reminder.some_members_exclusive")}`
          : translate("reminder.all_member_exclusive"),
        replace2: `/${lang}/${ROUTES.LOGIN}`,
      });
      break;
    case alertCode === "38003_platter_add_first_item" && alertType === "popup":
      info.alertTitle = translate(`alertModal.${alertCode}_${alertType}_title`, {
        replace1: alertList[0].alertItems[0].name,
      });
      break;
    case alertCode === "38006_normal_add_first_item" && alertType === "popup":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].name,
      });
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
        openCartPickupPopup(dispatch, "NEW");
      };
      info.onRightButtonClick = () => {
        // archor back to where they add the item
        dispatch(setProductArchorId(extraInfo?.globalSelectedProductSkuCode));
      };
      break;
    case alertCode === "38000_normal_edit_store_time" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } [${mappingResultForAlertCode38000(item.status, lang, item.branchName, item.posQuantity)}]</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
      };
      info.onRightButtonClick = () => {
        addCartRequest &&
          addCartRequest({
            branchCode: extraInfo?.selectedBranchCode,
            pickupDatetime: extraInfo?.pickupDatetime,
            source: "normal",
            isCartPage: true,
            isContinue: true,
          }).then(() => {
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));
          });
      };
      break;
    case alertCode === "33012" && alertType === "popup":
    case alertCode === "33011" && alertType === "popup":
      info.onRightButtonClick = () => {
        openCartPickupPopup(dispatch, "EDIT");
        const branchSelectionStep = getCookie(CookiesKey.branchSelectionStep);
        const globalSelectedProductSkuCode = getCookie(CookiesKey.globalSelectedProductSkuCode) as string;
        const branchCode = getCookie(CookiesKey.branchCode);
        if (branchSelectionStep && branchCode) {
          const params: AvailablePickupTimesApiParamsType = {};
          if (globalSelectedProductSkuCode?.length) {
            params.skuCode = globalSelectedProductSkuCode;
          }
          fetchRequestClientSide<BranchesType>({
            url: `${ENDPOINTS.GET_BRANCHES}/${branchCode}/available-pickup-times`,
            language: lang,
            params: params,
            options: {
              method: "GET",
            },
          })
          .then(res => {
            if (res.status === 200) {
              dispatch(setBranchPickupInfo(res.data));
            }
            dispatch(setPage(Number(branchSelectionStep)));
            deleteCookie(CookiesKey.branchSelectionStep);
            deleteCookie(CookiesKey.globalSelectedProductSkuCode);
            deleteCookie(CookiesKey.branchCode);
            dispatch(setShouldCacheStep1(true));
            dispatch(setIsBackFrom(false));
          })
          .catch(error => {
            console.error(`[Error] - ${ENDPOINTS.GET_BRANCHES}`, error);
          });
        }
      };
      dispatch(setNoPreSelectBranch(true));
      break;
    case alertCode === "38006_platter_add_first_item" && alertType === "popup":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].name,
      });
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
        openCartPickupPopup(dispatch, "EDIT");
      };
      break;
    case alertCode === "38005_platter_add_first_item" && alertType === "popup":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].name,
      });

      if (alertList[0].alertItems[0]?.effectivePeriodMessage?.length) {
        info.extraContent = `
        <p className={"mb-7 mt-10 text-17 leading-5 text-primaryDark md:mb-0 md:mt-5 md:leading-7"}>
          ${info.alertContent.replace(/&amp;/g, "&")}
          <br/>
          [${alertList[0].alertItems[0]?.effectivePeriodMessage}]
        </p>`

        info.alertContent = "";
      }
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(2));
        openCartPickupPopup(dispatch, "EDIT");
      };
      info.onRightButtonClick = () => {
        // archor back to where they add the item
        dispatch(setProductArchorId(extraInfo?.globalSelectedProductSkuCode));
      };
      break;
    case alertCode === "38007_platter_platter_checking" && alertType === "reminder":
    case alertCode === "38007_platter_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38007_normal_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38007_platter_platter_finish" && alertType === "reminder":
    case alertCode === "38007_cart_adjust_qty_or_add_item" && alertType === "reminder":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].memberTiers
          ? `${alertList[0].alertItems[0].memberTiers.join("/")} ${translate("reminder.some_members_exclusive")}`
          : translate("reminder.all_member_exclusive"),
      });
      break;
    case alertCode === "38015_cart_adjust_qty_or_add_item" && alertType === "reminder":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].memberTiers
          ? `${translate("reminder.some_items_is")} ${alertList[0].alertItems[0].memberTiers.join("/")} ${translate(
              "reminder.some_members_exclusive"
            )}`
          : translate("reminder.all_member_exclusive"),
      });
      break;
    case alertCode === "38000_cart_edit_store_time" && alertType === "next_to_field":
    case alertCode === "38004_platter_platter_finish" && alertType === "next_to_field":
      items = alertList[0].alertItems.map(item => {
        return {
          skuCode: item.cartKey,
          content: translate(`alertModal.${alertCode}_${alertType}_content`, {
            replace1: item.posQuantity,
          }),
        };
      });
      dispatch(setMultiNextToFieldSkuWithDataStatus(items));
      break;
    case alertCode === "38003_cart_adjust_qty_or_add_item" && alertType === "reminder":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].posQuantity,
      });
      dispatch(setIsAddButtonDisable(true));
      break;
    case alertCode === "38000_cart_edit_store_time" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } [${mappingResultForAlertCode38000(item.status, lang, item.branchName, item.posQuantity)}]</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
      };
      info.onRightButtonClick = () => {
        addCartRequest &&
          addCartRequest({
            branchCode: extraInfo?.selectedBranchCode,
            pickupDatetime: extraInfo?.pickupDatetime,
            source: "cart",
            isCartPage: true,
            isContinue: true,
          })
          .unwrap()
          .then((cartData: any) => {
            dispatch(setCartApiData(cartData.data));
            dispatch(setCartLocalDataFromApiData({ ...cartData.data, isCartPage: true }));
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));
          });
      };
      break;
    case alertCode === "38000_reorder_reorder" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } ${stuipMessage(item.status, lang, item.branchName, item.posQuantity, item.memberTiers, translate)}</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
      };
      info.onRightButtonClick = () => {
        dispatch(
          setStaticMessageOnTargetPage({
            isDisplayStaticMessage: false,
            staticMessageType: "",
            staticMessageTitle: "",
            staticMessageItems: [""],
            staticMessageContent: "",
          })
        );
        if (getCartRequest) {
          dispatch(setLoadingScreenDisplay(true));
          getCartRequest({
            branchCode: extraInfo?.selectedBranchCode,
            pickupDatetime: extraInfo?.pickupDatetime,
            source: "checkout",
            isCartPage: true,
            isContinue: true,
          })
          .unwrap()
          .then((res: any) => {
            dispatch(
              setStaticMessageOnTargetPage({
                isDisplayStaticMessage: false,
                staticMessageType: "",
                staticMessageContent: "",
                staticMessageItems: [""],
                staticMessageTitle: "",
              })
            );
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));

            if (res.statusCode === 200 && res.data.alertList?.length) {
              dispatch(setLoadingScreenDisplay(false));
              handleAlertMessage({
                alertList: res.data.alertList,
                dispatch,
                translate,
                lang,
                extraInfo: {
                  branchCode: extraInfo?.selectedBranchCode,
                  pickupDatetime: extraInfo?.pickupDatetime,
                },
                addCartRequest,
                getCartRequest,
              });
              dispatch(setCartApiData(res.data));
              dispatch(setCartLocalDataFromApiData({ ...res.data, isCartPage: false }));
            } else {
              window.location.href = `/${lang}/${ROUTES.CART}/${ROUTES.ADD_ON}`;
            }
          });
        }
      };
      break;
    case alertCode === "38000_cart_checkout" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } ${mappingResultForAlertCode38000Checkout(item.status, lang, item.branchName, item.posQuantity, item.memberTiers, translate)}</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
      };
      info.onRightButtonClick = () => {
        dispatch(
          setStaticMessageOnTargetPage({
            isDisplayStaticMessage: false,
            staticMessageType: "",
            staticMessageTitle: "",
            staticMessageItems: [""],
            staticMessageContent: "",
          })
        );
        if (getCartRequest) {
          dispatch(setLoadingScreenDisplay(true));
          getCartRequest({
            branchCode: extraInfo?.selectedBranchCode,
            pickupDatetime: extraInfo?.pickupDatetime,
            source: "checkout",
            isCartPage: true,
            isContinue: true,
          })
          .unwrap()
          .then((res: any) => {
            dispatch(
              setStaticMessageOnTargetPage({
                isDisplayStaticMessage: false,
                staticMessageType: "",
                staticMessageContent: "",
                staticMessageItems: [""],
                staticMessageTitle: "",
              })
            );
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));

            if (res.statusCode === 200 && res.data.alertList?.length) {
              dispatch(setLoadingScreenDisplay(false));
              handleAlertMessage({
                alertList: res.data.alertList,
                dispatch,
                translate,
                lang,
                extraInfo: {
                  branchCode: extraInfo?.selectedBranchCode,
                  pickupDatetime: extraInfo?.pickupDatetime,
                },
                addCartRequest,
                getCartRequest,
              });
              dispatch(setCartApiData(res.data));
              dispatch(setCartLocalDataFromApiData({ ...res.data, isCartPage: false }));
            } else {
              window.location.href = `/${lang}/${ROUTES.CART}/${ROUTES.ADD_ON}`;
            }
          });
        }
      };
      break;
    case alertCode === "38000_reorder_reorder" && alertType === "popup":
    case alertCode === "38000_addon_checkout" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } ${mappingResultForAlertCode38000Checkout(item.status, lang, item.branchName, item.posQuantity, item.memberTiers, translate)}</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
        window.location.href = `/${lang}/${ROUTES.CART}`;
      };
      info.onRightButtonClick = () => {
        if (getCartRequest) {
          dispatch(setLoadingScreenDisplay(true));
          getCartRequest({
            branchCode: extraInfo?.selectedBranchCode,
            pickupDatetime: extraInfo?.pickupDatetime,
            source: "addon",
            isCartPage: true,
            isContinue: true,
          })
          .unwrap()
          .then((res: any) => {
            dispatch(
              setStaticMessageOnTargetPage({
                isDisplayStaticMessage: false,
                staticMessageType: "",
                staticMessageContent: "",
                staticMessageItems: [""],
                staticMessageTitle: "",
              })
            );
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));

            if (res.statusCode === 200 && res.data.alertList?.length) {
              dispatch(setLoadingScreenDisplay(false));
              handleAlertMessage({
                alertList: res.data.alertList,
                dispatch,
                translate,
                lang,
                extraInfo: {
                  branchCode: extraInfo?.selectedBranchCode,
                  pickupDatetime: extraInfo?.pickupDatetime,
                },
                addCartRequest,
                getCartRequest,
              });
              dispatch(setCartApiData(res.data));
              dispatch(setCartLocalDataFromApiData({ ...res.data, isCartPage: false }));
            } else {
              window.location.href = `/${lang}/${ROUTES.CHECKOUT}`;
            }
          });
        }
      };
      break;
    case alertCode === "38003_addon_adjust_qty_or_add_item" && alertType === "reminder":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].posQuantity,
      });
      dispatch(setIsAddButtonDisable(true));
      break;
    case alertCode === "38021" && alertType === "next_to_field":
    case alertCode === "38004_platter_platter_checking" && alertType === "next_to_field":
    case alertCode === "38004_normal_adjust_qty_or_add_item" && alertType === "next_to_field":
    case alertCode === "38004_cart_adjust_qty_or_add_item" && alertType === "next_to_field":
    case alertCode === "38000_addon_adjust_qty_or_add_item" && alertType === "next_to_field":
    case alertCode === "38004_platter_adjust_qty_or_add_item" && alertType === "next_to_field":
    case alertCode === "38004_addon_adjust_qty_or_add_item" && alertType === "next_to_field":
      info.alertContent = translate(`alertModal.${alertCode}_${alertType}_content`, {
        replace1: alertList[0].alertItems[0].posQuantity,
      });
      dispatch(setIsAddButtonDisable(true));
      break;

    case alertCode === "36002" && alertType === "popup":
      info.onRightButtonClick = () => {
        getProfile && getProfile();
      };
      break;
    case alertCode === "38000_confirm_edit_store_time" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } [${mappingResultForAlertCode38000(item.status, lang, item.branchName, item.posQuantity)}]</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
      };
      info.onRightButtonClick = () => {
        addCartRequest &&
          addCartRequest({
            branchCode: extraInfo?.selectedBranchCode,
            pickupDatetime: extraInfo?.pickupDatetime,
            source: "cart",
            isCartPage: true,
            isContinue: true,
          })
          .unwrap()
          .then((cartData: any) => {
            dispatch(setCartApiData(cartData.data));
            dispatch(setCartLocalDataFromApiData({ ...cartData.data, isCartPage: true }));
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));
          });
      };
      break;

    case alertCode === "38000_confirm_confirm" && alertType === "popup":
      info.extraContent += "<ul class='h-auto mt-6'>";
      alertList[0].alertItems.forEach(item => {
        info.extraContent += `<li class="list-disc ${item.isPromotion ? "text-[#6A1648]" : "text-[#282828]"}">${
          item.name
        } ${stuipMessage(item.status, lang, item.branchName, item.posQuantity, item.memberTiers, translate)}</li>`;
      });
      info.extraContent += "</ul>";
      info.onLeftButtonClick = () => {
        getCartRequest &&
          getCartRequest({
            lang,
            isCartPage: true,
            source: "pay",
            isContinue: true,
          }).then(() => {
            dispatch(resetGlobalAlertStatus());
            dispatch(setIsCartPickupOpen({ isOpen: false }));
            setCookie(
              CookiesKey.staticMessageContent,
              JSON.stringify({
                page: ROUTES.CART,
                alertList,
                alertCode: "38000_confirm_confirm",
              }),
              {
                expires: moment().add(3, "minutes").toDate(),
              }
            );
            setCookie(CookiesKey.sourceForGetCart, "pay", {
              expires: moment().add(3, "minutes").toDate(),
            });
            window.location.href = `/${lang}/${ROUTES.CART}`;
          });
      };
      info.onRightButtonClick = () => {
        dispatch(resetGlobalAlertStatus());
        dispatch(setPage(1));
      };
      break;

    case alertCode === "38013_reorder_reorder" && alertType === "next_to_field":
    case alertCode === "38013_confirm_confirm" && alertType === "next_to_field":
    case alertCode === "38013_addon_checkout" && alertType === "next_to_field":
    case alertCode === "38013_cart_edit_store_time" && alertType === "next_to_field":
    case alertCode === "38013_cart_checkout" && alertType === "next_to_field":
    case alertCode === "38013_cart_adjust_qty_or_add_item" && alertType === "next_to_field":
      items = alertList[0].alertItems.map(item => {
        return {
          skuCode: item.cartKey,
          content: translate(`alertModal.${alertCode}_${alertType}_content`),
        };
      });
      dispatch(setMultiNextToFieldSkuWithDataStatus(items));
      dispatch(setDimmedSetProductSkuCodes(items.map(item => item.skuCode)));
      break;

    case alertCode === "38004_platter_platter_checking" && alertType === "reminder":
    case alertCode === "38005_platter_platter_checking" && alertType === "reminder":
    case alertCode === "38006_platter_platter_checking" && alertType === "reminder":
    case alertCode === "38003_platter_platter_checking" && alertType === "reminder":
    case alertCode === "38017_cart_adjust_qty_or_add_item" && alertType === "next_to_field":
    case alertCode === "38003_platter_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38004_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38005_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38006_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38006_normal_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38004_normal_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38003_normal_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38005_normal_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38003_platter_platter_finish" && alertType === "reminder":
    case alertCode === "38006_platter_platter_finish" && alertType === "reminder":
    case alertCode === "38005_platter_platter_finish" && alertType === "reminder":
    case alertCode === "38006_platter_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38005_platter_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38004_platter_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38014_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38016_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38018_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38019_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38020_cart_adjust_qty_or_add_item" && alertType === "reminder":
    case alertCode === "38017_addon_adjust_qty_or_add_item" && alertType === "reminder":
    default:
      break;
  }

  return {
    alertTitle: info.alertTitle !== `alertModal.${alertCode}_${alertType}_title` ? info.alertTitle : undefined,
    alertContent: info.alertContent !== `alertModal.${alertCode}_${alertType}_content` ? info.alertContent : undefined,
    leftButtonText:
      info.leftButtonText !== `alertModal.${alertCode}_${alertType}_left_button_text` ? info.leftButtonText : undefined,
    rightButtonText:
      info.rightButtonText !== `alertModal.${alertCode}_${alertType}_right_button_text`
        ? info.rightButtonText
        : undefined,
    onLeftButtonClick: info.onLeftButtonClick,
    onRightButtonClick: info.onRightButtonClick,
    extraContent: info.extraContent,
  };
};

const handleAlertMessage = ({
  alertList,
  dispatch,
  translate,
  lang,
  extraInfo,
  addCartRequest,
  getCartRequest,
  getProfile,
}: {
  alertList: CartApiAlertListType[];
  dispatch: Dispatch<AnyAction>;
  translate: TFunction<string, string, string>;
  lang: LocaleKeysType;
  extraInfo?: Record<string, any>;
  addCartRequest?: (...params: any) => any;
  getCartRequest?: (...params: any) => any;
  getProfile?: (...params: any) => any;
}) => {
  const havePopup = alertList.filter(list => list.alertType === "popup");
  if (havePopup?.length) {
    const alertInfo = alertModalMessageMapper({
      alertCode: havePopup[0].alertCode,
      alertType: havePopup[0].alertType,
      translate,
      dispatch,
      alertList: havePopup,
      lang,
      extraInfo,
      addCartRequest,
      getCartRequest,
      getProfile,
    });
    dispatch(
      setGlobalAlertStatus({
        isGlobalAlertDisplay: true,
        alertTitle: alertInfo.alertTitle,
        alertContent: alertInfo.alertContent,
        leftButtonText: alertInfo.leftButtonText,
        onLeftButtonClick: alertInfo.onLeftButtonClick,
        rightButtonText: alertInfo.rightButtonText,
        onRightButtonClick: alertInfo.onRightButtonClick,
        extraContent: alertInfo.extraContent,
      })
    );
  }

  const haveReminder = alertList.filter(list => list.alertType === "reminder");
  if (haveReminder?.length) {
    const alertInfo = alertModalMessageMapper({
      alertCode: haveReminder[0].alertCode,
      alertType: haveReminder[0].alertType,
      translate,
      dispatch,
      alertList: haveReminder,
      lang,
      extraInfo,
      addCartRequest,
      getCartRequest,
      getProfile,
    });
    dispatch(
      setReminderAlertStatus({
        targetReminderSku: extraInfo?.targetSkuCode ?? extraInfo?.globalSelectedProductSkuCode,
        reminderAlertContent: alertInfo.alertContent,
        reminderIconStyle: "MARK",
      })
    );
  }

  const haveNextToField = alertList.filter(list => list.alertType === "next_to_field");
  if (haveNextToField?.length) {
    const alertInfo = alertModalMessageMapper({
      alertCode: haveNextToField[0].alertCode,
      alertType: haveNextToField[0].alertType,
      translate,
      dispatch,
      alertList: haveNextToField,
      lang,
      extraInfo,
      addCartRequest,
      getCartRequest,
      getProfile,
    });

    if (haveNextToField[0].alertCode !== "38004_platter_platter_finish") {
      dispatch(
        setNextToFieldStatus({
          targetNextToFieldSku: extraInfo?.targetSkuCode,
          nextToFieldContent: alertInfo.alertContent,
        })
      );
    }
  }

  const haveStaticMessage = alertList.filter(list => list.alertType === "static");
  if (haveStaticMessage?.length) {
    // IA49 + IA56 : 38000_confirm_edit_store_time + 38022_confirm_edit_store_time
    if (haveStaticMessage?.length > 1) {
      const combination: (string | boolean)[] = ["38000_confirm_edit_store_time", "38022_confirm_edit_store_time"];
      haveStaticMessage.forEach(message => {
        const indexFound = combination.findIndex(comb => comb === message.alertCode);
        if (indexFound > -1) {
          combination[indexFound] = true;
        }
      });

      if (combination.filter(comb => comb === true).length === combination.length) {
        const alertInfo1 = alertModalStaticMessageMapper({
          alertCode: "38000_confirm_edit_store_time",
          translate,
          alertList: haveStaticMessage.filter(message => message.alertCode === "38000_confirm_edit_store_time"),
          lang,
        });

        dispatch(
          setStaticMessageOnTargetPage({
            isDisplayStaticMessage: true,
            staticMessageType: alertInfo1.staticMessageType,
            staticMessageTitle: alertInfo1.staticMessageTitle,
            staticMessageItems: alertInfo1.staticMessageItems,
            staticMessageContent: alertInfo1.staticMessageContent,
          })
        );

        const alertInfo2 = alertModalStaticMessageMapper({
          alertCode: "38022_confirm_edit_store_time",
          translate,
          alertList: haveStaticMessage.filter(message => message.alertCode === "38022_confirm_edit_store_time"),
          lang,
        });

        dispatch(
          setSecondStaticMessageOnTargetPage({
            isDisplaySecondStaticMessage: true,
            secondStaticMessageType: alertInfo2.staticMessageType,
            secondStaticMessageTitle: alertInfo2.staticMessageTitle,
            secondStaticMessageContent: alertInfo2.staticMessageContent,
            secondStaticMessageItems: alertInfo2.staticMessageItems,
          })
        );
      }
    } else {
      const alertInfo = alertModalStaticMessageMapper({
        alertCode: haveStaticMessage[0].alertCode,
        translate,
        alertList: haveStaticMessage,
        lang,
      });

      dispatch(
        setStaticMessageOnTargetPage({
          isDisplayStaticMessage: true,
          staticMessageType: alertInfo.staticMessageType,
          staticMessageTitle: alertInfo.staticMessageTitle,
          staticMessageItems: alertInfo.staticMessageItems,
          staticMessageContent: alertInfo.staticMessageContent,
        })
      );
    }
  }
};

const getMobilePBottom = (width: number, apiData: CartApiDataType) => {
  if (width < 1024) {
    if (isSafari() && apiData.cart && apiData.cart?.cartItems.length <= 0) {
      return { paddingBottom: `${130 + 75}px` };
    } else if (apiData.cart && apiData.cart?.cartItems.length <= 0) {
      return { paddingBottom: "130px" };
    }
  }
  return {};
};

const handleAlertMessageForGeneralPage = ({
  alertCode,
  alertType,
  dispatch,
  translate,
  extraInfo,
  lang,
}: {
  alertCode: CartApiAlertCode;
  alertType: CartApiAlertType;
  dispatch: Dispatch<AnyAction>;
  translate: TFunction<string, string, string>;
  extraInfo?: {
    leftButtonCallback?: (...params: any) => any;
    rightButtonCallback?: (...params: any) => any;
    message?: string;
    alertCode?: string;
  };
  lang: LocaleKeysType;
}) => {
  const info = {
    alertTitle: translate(`alertModal.${alertCode}_${alertType}_title`),
    alertContent: translate(`alertModal.${alertCode}_${alertType}_content`),
    leftButtonText: translate(`alertModal.${alertCode}_${alertType}_left_button_text`),
    onLeftButtonClick: extraInfo?.leftButtonCallback ? extraInfo?.leftButtonCallback : () => null,
    rightButtonText: translate(`alertModal.${alertCode}_${alertType}_right_button_text`),
    onRightButtonClick: extraInfo?.rightButtonCallback ? extraInfo?.rightButtonCallback : () => null,
    extraContent: "",
  };

  switch (true) {
    case alertCode === "g61" && alertType === "popup":
    case alertCode === "g58" && alertType === "popup":
    case alertCode === "g60" && alertType === "popup":
    case alertCode === "g62" && alertType === "popup":
    case alertCode === "g68" && alertType === "popup":
    case alertCode === "g56" && alertType === "popup":
    default:
      break;
  }

  const isMPGSError = mpgsErrorMapper({
    alertCode,
    alertMessage: extraInfo?.message ?? "",
    alertItems: [],
    alertType: "popup",
  }, dispatch, translate, lang);

  if (!isMPGSError) {
    dispatch(
      setGlobalAlertStatus({
        isGlobalAlertDisplay: true,
        alertTitle: info.alertTitle !== `alertModal.${alertCode}_${alertType}_title` ? info.alertTitle : extraInfo?.alertCode ?? undefined,
        alertContent:
          info.alertContent !== `alertModal.${alertCode}_${alertType}_content` ? info.alertContent : extraInfo?.message ?? undefined,
        leftButtonText:
          info.leftButtonText !== `alertModal.${alertCode}_${alertType}_left_button_text`
            ? info.leftButtonText
            : undefined,
        rightButtonText:
          info.rightButtonText !== `alertModal.${alertCode}_${alertType}_right_button_text`
            ? info.rightButtonText
            : translate("popup.confirm"),
        onLeftButtonClick: info.onLeftButtonClick,
        onRightButtonClick: info.onRightButtonClick,
        extraContent: info.extraContent,
      })
    );
  }
  
};

const alertModalStaticMessageMapper = ({
  alertCode,
  translate,
  alertList,
  lang,
}: {
  alertCode: CartApiAlertCode;
  translate: TFunction<string, string, string>;
  alertList: CartApiAlertListType[];
  lang: LocaleKeysType;
}) => {
  const alertType = "static";
  const info = {
    staticMessageType: "" as StaticMessageOnTargetPage["staticMessageType"],
    staticMessageTitle: translate(`alertModal.${alertCode}_${alertType}_title`),
    staticMessageContent: translate(`alertModal.${alertCode}_${alertType}_content`),
    staticMessageItems: [""],
  };

  switch (true) {
    case alertCode === "38022_confirm_edit_store_time":
    case alertCode === "38022_confirm_confirm":
    case alertCode === "38022_reorder_reorder":
    case alertCode === "38022_addon_adjust_qty_or_add_item":
    case alertCode === "38022_addon_checkout":
    case alertCode === "38022_cart_checkout":
    case alertCode === "38022_cart_adjust_qty_or_add_item":
    case alertCode === "38000_confirm_confirm":
    case alertCode === "38000_confirm_edit_store_time":
      info.staticMessageType = "WARNING";
      info.staticMessageItems = alertList[0].alertItems.map(item => {
        return `${item.name} ${mappingResultForAlertCode38000Checkout(
          item.status,
          lang,
          item.branchName,
          item.posQuantity, 
          item.memberTiers, 
          translate
        )}`;
      });
      break;
    case alertCode === "38021":
    case alertCode === "38000_addon_adjust_qty_or_add_item":
    case alertCode === "38000_addon_checkout":
    case alertCode === "38000_reorder_reorder":
    case alertCode === "38000_cart_checkout":
    case alertCode === "38000_cart_edit_store_time":
    case alertCode === "38000_cart_adjust_qty_or_add_item":
      info.staticMessageType = "ERROR";
      info.staticMessageItems = alertList[0].alertItems.map(item => {
        return `${item.name} ${mappingResultForAlertCode38000Checkout(
          item.status,
          lang,
          item.branchName,
          item.posQuantity, 
          item.memberTiers, 
          translate
        )}`;
      });
      break;
    default:
      break;
  }

  return {
    staticMessageType: info.staticMessageType,
    staticMessageTitle:
      info.staticMessageTitle !== `alertModal.${alertCode}_${alertType}_title` ? info.staticMessageTitle : "",
    staticMessageContent:
      info.staticMessageContent !== `alertModal.${alertCode}_${alertType}_content` ? info.staticMessageContent : "",
    staticMessageItems: info.staticMessageItems,
  };
};

const alertMessageMapperForRegistration = ({
  alertCode,
  translate,
  dispatch,
  lang,
  onLeftButtonClick,
  onRightButtonClick,
  extra,
}: {
  alertCode: string;
  translate: TFunction<string, string, string>;
  dispatch: Dispatch<AnyAction>;
  lang: LocaleKeysType;
  onLeftButtonClick?: (...params: any) => any;
  onRightButtonClick?: (...params: any) => any;
  extra?: Record<string, any>;
}) => {
  const alertType = "popup";
  let title = "";
  let content = "";
  let leftButtonText = "";
  let rightButtonText = translate("popup.confirm");
  let extraContent = undefined;
  switch (alertCode.toString()) {
    case "40018":
    case "40028":
    case "40019":
    case "40026":
    case "40020":
    case "r12":
    case "40025":
    case "32003":
    case "40023":
    case "40024":
    case "32007":
      title = translate(`alertModal.${alertCode}_${alertType}_title`);
      content = translate(`alertModal.${alertCode}_${alertType}_content`);
      leftButtonText = translate(`alertModal.${alertCode}_${alertType}_left_button_text`);
      rightButtonText = translate(`alertModal.${alertCode}_${alertType}_right_button_text`);
      onLeftButtonClick = () => {
        localStorage.setItem("isContactClickedInRegisterSubmittedPage", "true");
        window.location.href = `/${lang}/${ROUTES.CONTACT}`;
      };
      break;

    case "40017":
    case "40016":
    case "40007":
    case "r13":
    case "r14":
    case "r15":
    case "r8":
      title = translate(`alertModal.${alertCode}_${alertType}_title`);
      content = translate(`alertModal.${alertCode}_${alertType}_content`);
      rightButtonText = translate(`alertModal.${alertCode}_${alertType}_right_button_text`);
      break;

    case "g53":
      title = translate(`alertModal.${alertCode}_${alertType}_title`);
      content = translate(`alertModal.${alertCode}_${alertType}_content`);
      leftButtonText = translate(`alertModal.${alertCode}_${alertType}_left_button_text`);
      rightButtonText = translate(`alertModal.${alertCode}_${alertType}_right_button_text`);
      break;

    case "40010":
      title = translate(`alertModal.${alertCode}_${alertType}_title`);
      rightButtonText = translate(`alertModal.${alertCode}_${alertType}_right_button_text`);
      extraContent = `<p
        className={"text-center mb-7 mt-10 text-17 leading-5 text-primaryDark md:mb-0 md:mt-5 md:leading-7"}
      >
        ${translate(`alertModal.${alertCode}_${alertType}_content`, { replace1: extra?.numberOfAttempt })}
      </p>`
      break;
      
    default:
      title = alertCode;
      break;
  }

  dispatch(
    setGlobalAlertStatus({
      extraContent,
      isGlobalAlertDisplay: true,
      alertTitle: title.length ? title : undefined,
      alertContent: content.length ? content : undefined,
      leftButtonText: leftButtonText.length ? leftButtonText : undefined,
      rightButtonText: rightButtonText.length ? rightButtonText : undefined,
      onLeftButtonClick: () => {
        onLeftButtonClick && onLeftButtonClick();
      },
      onRightButtonClick: () => {
        onRightButtonClick && onRightButtonClick();
      },
    })
  );
};

const mpgsErrorMapper = (
  alert: CartApiAlertListType,
  dispatch: Dispatch<AnyAction>,
  translate: TFunction<string, string, string>,
  lang: LocaleKeysType,
  skipAlert?: boolean,
) => {
  let isMPGSError = false;
  // mpgs error
  // 10023 = unexpected error
  // 34005, 32005 = mpgs general error
  if (["10023", "34005", "32005","70100","70101",
  "70102","70103","70104","70105",
  "70106","70107","70108","70109",
  "70110","70111","70112","70114","70116"].includes(alert.alertCode)) {
    isMPGSError = true;
    if (!skipAlert) {
      if (alert.alertType === "popup") {
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate(`alertModal.${alert.alertCode}`),
            rightButtonText: translate("popup.confirm"),
          })
        );
      } else if (alert.alertType === "static") {
        dispatch(setMPGSError(translate(`alertModal.${alert.alertCode}`)));
      }
    }
    
  } else if (["70113", "70115"].includes(alert.alertCode)) {
    isMPGSError = true;
    if (!skipAlert) {
      if (alert.alertType === "popup") {
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate("alertModal.mpgs_payment_fail"),
            alertContent: alert.alertMessage,
            rightButtonText: translate("popup.confirm"),
          })
        );
      } else if (alert.alertType === "static") {
        setCheckoutFormErrorData({
          key: "cvv",
          hasError: true,
          message: alert.alertMessage,
        });
      }
    }
  } else if (["34014"].includes(alert.alertCode)) {
    isMPGSError = true;
    if (!skipAlert) {
      if (alert.alertType === "popup") {
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate("alertModal.g38_popup_title"),
            alertContent: translate("alertModal.g38_popup_content"),
            rightButtonText: translate("alertModal.g38_popup_right_button_text"),
          })
        );
      } else if (alert.alertType === "static") {
        dispatch(setMPGSError(translate("alertModal.g38_popup_content")));
      }
    }
  } else if (["34015"].includes(alert.alertCode)) {
    isMPGSError = true;
    if (!skipAlert) {
      if (alert.alertType === "popup") {
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate("alertModal.g39_popup_title"),
            alertContent: translate("alertModal.g39_popup_content"),
            rightButtonText: translate("alertModal.g39_popup_right_button_text"),
            onRightButtonClick: () => {
              // todo
              // When user click contact CS, please redirect them to cs-eform and pre-select enquiry type = Feedback(order/service/food)
              localStorage.setItem("isContactClickedInRegisterSubmittedPage", "true");
              window.location.href = `/${lang}/${ROUTES.CONTACT}`;
            },
          })
        );
      } else if (alert.alertType === "static") {
        dispatch(setMPGSError(translate("alertModal.g39_popup_content")));
      }
    }
  }

  return isMPGSError;
};

const promotionOrCouponErrorMapper = (cartData: CartApiDataType, dispatch: Dispatch<AnyAction>, translate: TFunction<string, string, string>, lang: LocaleKeysType,) => {
  const haveError = {
    memberCouponId: false,
    promoCode: false,
    memberPointRedeem: false,
    mpgsError: false,
  }
  if (cartData.result === "FAILED" && cartData.alertList?.length) {
    cartData.alertList.forEach(alert => {
      // member point = 36002 
      if (alert.alertCode === "36002") {
        haveError.memberPointRedeem = true;
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate("alertModal.36002_popup_title"),
            alertContent: translate("alertModal.36002_popup_content"),
            rightButtonText: translate("alertModal.36002_popup_right_button_text"),
            onRightButtonClick: () => {
              dispatch(resetMemberPoint());
            },
          })
        );
      }

      if (alert.alertType === "static" && alert.alertCode === "38012") {
        dispatch(
          setStaticMessageOnTargetPage({
            isDisplayStaticMessage: true,
            staticMessageType: "ERROR",
            staticMessageContent: "",
            staticMessageTitle: translate(`alertModal.${alert.alertCode}_${alert.alertType}_title`),
            staticMessageItems: alert.alertItems.map(item => item.name),
          })
        );
      } else {
        dispatch(
          setStaticMessageOnTargetPage({
            isDisplayStaticMessage: false,
            staticMessageType: "",
            staticMessageContent: "",
            staticMessageTitle: "",
            staticMessageItems: [""],
          })
        );
      }

      // promo code = 34013, 34001, 34011, 34000, 34012 (success)
      if (
        alert.alertType === "next_to_field" &&
        (alert.alertCode === "34013" ||
          alert.alertCode === "34001" ||
          alert.alertCode === "34011" ||
          alert.alertCode === "34000")
      ) {
        haveError.promoCode = true;
        dispatch(
          setCheckoutFormErrorData({
            key: "promoCode",
            hasError: true,
            message: translate(`alertModal.${alert.alertCode}_next_to_field_content`) ?? "",
          })
        );
      } else if (
        // success case
        alert.alertType === "next_to_field" &&
        (alert.alertCode === "34012")
      ) {
        dispatch(
          setCheckoutFormErrorData({
            key: "promoCode",
            hasError: true,
            message: translate(`alertModal.${alert.alertCode}_next_to_field_content`) ?? "",
          })
        );
      }

      if ( alert.alertType === "popup" &&
      (alert.alertCode === "34013" ||
        alert.alertCode === "34001" ||
        alert.alertCode === "34011" ||
        alert.alertCode === "34012")) {
        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate(`alertModal.${alert.alertCode}_popup_title`),
            rightButtonText: translate(`alertModal.${alert.alertCode}_popup_right_button_text`),
          })
        );
      }

      // coupon code = 34003, 34009
      if (alert.alertCode === "34003" || alert.alertCode === "34009") {
        haveError.memberCouponId = true;
        dispatch(
          setCheckoutFormErrorData({
            key: "memberCouponId",
            hasError: true,
            message: translate(`alertModal.${alert.alertCode}_next_to_field_content`) ?? "",
          })
        );

        dispatch(
          setGlobalAlertStatus({
            isGlobalAlertDisplay: true,
            alertTitle: translate(`alertModal.${alert.alertCode}_popup_title`),
            rightButtonText: translate(`alertModal.${alert.alertCode}_popup_right_button_text`),
          })
        );
      }

      const haveMPGSError = mpgsErrorMapper(alert, dispatch, translate, lang);

      haveError.mpgsError = haveMPGSError;
    });
  } else {
    dispatch(
      setCheckoutFormErrorData({
        key: "promoCode",
        hasError: false,
        message: "",
      })
    );
    dispatch(
      setCheckoutFormErrorData({
        key: "memberCouponId",
        hasError: false,
        message: "",
      })
    );

    dispatch(setMPGSError(""));
    
  }

  return haveError;
}

const shiDanLa = ({
  alertList,
  dispatch,
  translate,
}: {
  alertList: CartApiAlertListType[];
  dispatch: Dispatch<AnyAction>;
  translate: TFunction<string, string, string>;
}) => {
  const reminders = alertList.filter(list => list.alertCode === "38004_platter_platter_finish" && list.alertType === "reminder").flatMap(list => list.alertItems.flatMap(item => {
    return {
      targetReminderSku: item.skuCode,
      reminderAlertContent: translate("alertModal.38004_platter_platter_finish_reminder_content"),
      reminderIconStyle: "MARK" as const,
    }
  }))
  dispatch(setMultiReminderAlertStatus(reminders));
}

const getBrowserAgent = () => {
  const userAgent = navigator.userAgent;
  let browser = "";
  if(userAgent.match(/chrome|chromium|crios/i)){
    browser = "chrome";
  } 
  
  if (userAgent.match(/firefox|fxios/i)){
    browser = "firefox";
  } 
  
  if (userAgent.match(/safari/i)){
    browser = "safari";
  } 
  
  if (userAgent.match(/opr/i)){
    browser = "opera";
  } 
  
  if (userAgent.match(/edg/i)){
    browser = "edge";
  }

  return browser;
}

const openCartPickupPopup = (
  dispatch: Dispatch<AnyAction>,
  cartType: "NEW" | "EDIT",
) => {
  const isPaymentInProgress = getCookie(CookiesKey.isPaymentInProgress);
  if (!isPaymentInProgress || isPaymentInProgress === "false") {
    dispatch(setIsCartPickupOpen({ isOpen: true, cartType }));
  }
  if (isPaymentInProgress === true || isPaymentInProgress === "true") {
    dispatch(setIsPaymentInProgressPopupDisplay(true));
  }
}

export {
  openCartPickupPopup,
  getBrowserAgent,
  shiDanLa,
  mpgsErrorMapper,
  promotionOrCouponErrorMapper,
  alertMessageMapperForRegistration,
  alertModalStaticMessageMapper,
  handleAlertMessageForGeneralPage,
  handleAlertMessage,
  isSelectedSavedCard,
  GetHeaderDisplay,
  useCalHeight,
  LocalStorageUtils,
  fetchRequestClientSide,
  getRequestCommonHeader,
  setIsScrollbarHidden,
  isSelectedApplePay,
  isSelectedGooglePay,
  isSelectedCreditCard,
  isSafari,
  getMobilePBottom,
};
