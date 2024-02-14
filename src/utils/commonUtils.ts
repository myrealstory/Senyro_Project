import moment from "moment";

import { ROUTES, RoutesNameType } from "@/constants/routes";
import { GetProductApiInputType } from "@/types/productTypes";
import { FetchRequest, FetchResponse } from "@/types/commonTyps";
import { LocaleKeysType, defaultLocale, locales } from "@/app/i18n";
import {
  CartApiDataType,
  CartLocalDataType,
  GetRefCategoryDataType,
  ProductDataInLocalCartType,
  RefCategoryBasicType,
} from "@/types/cartTypes";
import { CreditCardPaymentMethodIds } from "@/redux/slice/orderCheckoutSlice";
import { OrderCheckoutRequest } from "@/types/api/apiTypes";
import { OrderCheckoutType } from "@/types/checkout/checkoutTypes";
import { CategoriesTypes, SubCategoriesTypes } from "@/types/categorysTypes";
import { TFunction } from "i18next";
import { PAYMENT_METHOD } from "@/constants/checkout/payment";

const getRouteNameFromPathname = (str: string) => {
  const regex = /^\/(en|tc)\/(\w*-*\w*)?(?:\/([a-zA-Z-]*))?(?:\/([a-zA-Z-]*))?/g;
  const matches = str.matchAll(regex);
  const matchedString = [...matches]?.[0];
  return {
    fullpathname: matchedString?.[0],
    firstSlug: matchedString?.[1] as LocaleKeysType,
    secondSlug: matchedString?.[2] as RoutesNameType,
    thirdSlug: matchedString?.[3] as RoutesNameType,
    slugWithoutLang: matchedString?.[0].replace(`/${matchedString?.[1]}/`, ""),
  };
};

const getLangFromString = (str: string) => {
  const regex = /\/(\w+)/g;
  const matches = str.matchAll(regex);
  let lang = defaultLocale;
  for (const match of matches) {
    if (locales.indexOf(match[1] as LocaleKeysType) > -1) {
      lang = match[1] as LocaleKeysType;
    }
  }
  return lang;
};

const fetchRequest = <T>({ url, params, body, language, options }: FetchRequest): Promise<FetchResponse<T>> => {
  if (options.method === "GET" && params) {
    url += `?${new URLSearchParams(params)}`;
  } else {
    options.body = JSON.stringify(body);
  }

  options.headers = {
    ...options.headers,
    "touch-point": "web",
    language: language,
    "device-id": options.headers?.["device-id"] ?? "",
  };

  if (options.method === "POST") {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }

  if (options?.cache) {
    options.cache = options?.cache;
  } else {
    options.next = { revalidate: options.revalidate ?? 60 };
  }

  return new Promise(async (resolve, reject) => {
    return fetch(url, options)
      .then(result => {
        return result.json();
      })
      .then(data => {
        if (data.statusCode === 200) {
          return resolve({
            status: 200,
            data: data.data,
          });
        }
        return Promise.reject({
          status: data.statusCode,
          error: data,
        });
      })
      .catch(error => {
        const errorObject = {
          api: url,
          status: error.status ?? 400,
          error: error?.error ?? error,
          time: moment().format("YYYY-MM-DD HH-mm-ss"),
        };
        console.error(errorObject);
        return reject(errorObject);
      });
  });
};

const isUserHasSelectedBranch = (cartData: CartApiDataType) => {
  // have delivery method means user already selected a branch before
  if (cartData.cart?.deliveryMethod?.type) {
    return true;
  }
  return false;
};

const getProductQuantityFromCart = ({
  cartKey,
  skuCode,
  isSetProduct,
  isEditingSetProduct,
  isSubProduct,
  cartData,
  isGiftItem,
  isCartPage,
  globalSelectedProductSkuCode,
  isPLP,
}: {
  cartKey?: string;
  skuCode?: string;
  isSetProduct: boolean;
  isEditingSetProduct: boolean;
  isSubProduct: boolean;
  cartData: CartLocalDataType;
  isGiftItem?: boolean;
  isCartPage: boolean;
  globalSelectedProductSkuCode?: string;
  isPLP?: boolean;
}) => {
  let targetProductData: ProductDataInLocalCartType | undefined;
  // the main product in the set
  if (isPLP && isSetProduct && !isSubProduct) {
    const setProductData = cartData.setProductData?.filter(data => data.skuCode === skuCode);
    if (setProductData?.length) {
      return setProductData.reduce((previous, current) => {
        return previous + current.quantity;
      }, 0);
    }
    return 0;
  } else if ((isEditingSetProduct || isSetProduct) && !isSubProduct && (globalSelectedProductSkuCode === skuCode || isCartPage)) {
    targetProductData =
    cartData.setProductPopupData.quantity > 0
      ? cartData.setProductPopupData
      : cartData.setProductData?.find(data => data.cartKey === cartKey);
  } else if (isEditingSetProduct && isSubProduct) {
    // sub product in the set
    targetProductData = cartData.setProductPopupData.subItems.find(subItem => subItem.skuCode === skuCode);
  } else if (isGiftItem) {
    targetProductData = cartData.giftProductData?.find(data => data.skuCode === skuCode);
  } else {
    targetProductData = cartData.singlaProductData?.find(data => data.skuCode === skuCode);
  }

  if (targetProductData?.quantity && targetProductData?.quantity > 0) {
    return targetProductData?.quantity;
  }

  return 0;
};

const formatePickupDate = (selectedPickupDate: string, selectedPickupHour: string, selectedPickupMinute: string) => {
  // format: "2023-09-11T22:09:14.265Z"
  return moment(selectedPickupDate)
    .set("hours", Number(selectedPickupHour))
    .set("minutes", Number(selectedPickupMinute))
    .format("YYYY-MM-DDTHH:mm:ss.000Z");
};

export const scrolltoTop = () => {
  if (window !== undefined) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
};

export function shortFormName({ firstname, lastname }: { firstname: string; lastname: string }) {
  let newFirstName = "";
  let newLastName = "";
  if (firstname?.length) {
    newFirstName = firstname.charAt(0);
  }

  if (lastname?.length) {
    newLastName = lastname.charAt(0);
  }

  return `${newFirstName}${newLastName}`;
}

export function doesValueExist({ obj, value }: { obj: any; value: string }) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === value) {
      return true;
    }
  }
  return false;
}

const getRefCategoryDataType = ({
  refCategoryType,
  selectedMainCategoryId,
  selectedSubCategoryId,
  refCategoryTypeId,
}: GetRefCategoryDataType): RefCategoryBasicType => {
  if (refCategoryType === "SUBCATEGORY") {
    return {
      refCategoryType,
      refCategoryTypeId: selectedSubCategoryId,
    };
  }
  if (refCategoryType === "CATEGORY") {
    return {
      refCategoryType,
      refCategoryTypeId: selectedMainCategoryId,
    };
  }

  return {
    refCategoryType,
    refCategoryTypeId,
  };
};

const getProductApiInputParams = (cart: CartApiDataType, options: GetProductApiInputType) => {
  const params: GetProductApiInputType = {};
  params.type = "EFFECTIVE";
  params.date = new Date().toISOString();

  if (options?.branch) {
    params.branch = options.branch;
  }

  if (cart.cart?.branch?.branchCode) {
    params.branch = cart.cart.branch.branchCode;
  }

  if (cart.cart?.deliveryMethod?.type === "EFFECTIVE") {
    params.type = "EFFECTIVE";
    params.branch = cart.cart.branch.branchCode;
  }

  if (cart.cart?.deliveryMethod?.type === "PICKUP") {
    params.type = "PICKUP";
    params.date = cart.cart.deliveryMethod.datetime;
  }

  // this is for client side rtk
  if (options.slugId) {
    params.slugId = options.slugId;
  }

  if (options.category) {
    params.category = options.category;
  }

  if (options.subcategory) {
    params.subcategory = options.subcategory;
  }

  if (options.date) {
    params.date = options.date;
  }

  if (options.popupAlert) {
    params.popupAlert = true;
  }

  if (options.lang) {
    params.lang = options.lang;
  }

  return params;
};

const formatCardNumber = (inputValue: string) => {
  const sanitizedValue = inputValue.replace(/[^0-9]/g, "");
  const formattedValue = sanitizedValue.replace(/(\d{4})/g, "$1 ");
  return formattedValue.trim().slice(0, 19);
};

const getCardType = (cardNumber: string) => {
  if (cardNumber.length >= 4) {
    const firstFourDigits = cardNumber.slice(0, 4);
    const firstTwoDigits = cardNumber.slice(0, 2);

    if (/^4/.test(firstFourDigits)) {
      return "VISA";
    } else if (/^5[1-5]/.test(firstFourDigits)) {
      return "MPGS";
    } else if (/^3[47]/.test(firstTwoDigits)) {
      return "AmericaExpressx";
    }
    return "error";
  }
  return "";
};

const getCreditCardType = (cardNumber: string, isAE: boolean) => {
  // AE: starts with 3 + 15digit
  // Master: 2,5 + 16digit
  // Visa: 4 + 16digit
  if (/^4[0-9]{15}$/.test(cardNumber) && !isAE) {
    return "visa";
  } else if (/^[2|5][0-9]{15}$/.test(cardNumber) && !isAE) {
    return "master";
  } else if (/^3[0-9]{14}$/.test(cardNumber) && isAE) {
    return "ae";
  }
  return "error";
};

// just clone a function here, don't care anything else
const checkIfCreditCardNumberValid = (cardNumber: string) => {
  // AE: starts with 3 + 15digit
  // Master: 2,5 + 16digit
  // Visa: 4 + 16digit
  if (/^4[0-9]{15}$/.test(cardNumber)) {
    return "visa";
  } else if (/^[2|5][0-9]{15}$/.test(cardNumber)) {
    return "master";
  } else if (/^3[0-9]{14}$/.test(cardNumber)) {
    return "ae";
  }
  return "error";
};

const isNameValid = (string: string) => {
  // eng + chinese + white space + at most 25 letters
  const reg1 = /^[A-Za-z\u3000-\u303F\u3400-\u4DBF\u4E00-\u9FFF\s]{0,25}$/gm;

  // white space
  const reg2 = /\s/gm;

  // one space is allowed
  if ([...string.matchAll(reg2)]?.length > 1) {
    return false;
  }

  return reg1.test(string);
};

const isCardHolderValid = (string: string) => {
  // space + eng
  const reg1 = /^[a-zA-Z ]+$/gm;

  return reg1.test(string);
};

const checkIfNumberStringHasValue = (value: number | undefined) => {
  if (value !== undefined && String(value)?.length) {
    return true;
  }
  return false;
};

const getStringNumberValue = (value: string | undefined): number | undefined => {
  if (value !== undefined && !Number.isNaN(value)) {
    return Number(value);
  }

  return undefined;
};

const generateCheckoutRequestPayload = (data: OrderCheckoutType) => {
  const requestBody: OrderCheckoutRequest = {
    couponInfo: Object.assign(
      {},
      data?.promoCode && data?.promoCode?.length
        ? {
            promoCode: data?.promoCode,
          }
        : {},
      data?.memberCouponId && data?.memberCouponId?.length
        ? {
            memberCouponId: data?.memberCouponId,
          }
        : {},
      data?.memberPointRedeem && data?.memberPointRedeem > 0
        ? {
            memberPointRedeem: data?.memberPointRedeem,
          }
        : {}
    ),
    paymentInfo: {
      paymentMethodId: data.selectedPaymentMethodId === PAYMENT_METHOD.INIT ? undefined : data.selectedPaymentMethodId,
    },
    contactInfo: {
      firstName: data.firstName,
      lastName: data.lastName,
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      email: data.email,
      optin: data.optin ?? false,
    },
  };

  // pay with saved card
  if (data?.savedCardId) {
    requestBody.paymentInfo.savedCardId = data?.savedCardId;

    if (data?.savedCardCVV?.length) {
      requestBody.paymentInfo.details = {
        cvv: data?.savedCardCVV,
      };
    }
  }

  // pay with credit card
  if (CreditCardPaymentMethodIds.includes(data.selectedPaymentMethodId!)) {
    requestBody.paymentInfo.details = {
      cardHolder: data?.cardHolder,
      cardNumber: data?.cardNumber,
      expiryMonth: data?.expiryMonth,
      expiryYear: data?.expiryYear,
      cvv: data?.cvv,
      saveCardEnabled: data?.saveCardEnabled,
    };

    // save card & replace payment method id if user click enable save card for credit card
    if (data?.saveCardEnabled && data.saveCardPaymentMethodId) {
      requestBody.paymentInfo.paymentMethodId = data.saveCardPaymentMethodId;
    }
  }

  // pay with mobile wallet (google/apple)
  // if (token) {
  //   requestBody.paymentInfo.details = {
  //     token,
  //   };
  // }

  return requestBody;
};

const generateCategoryMetaData = (
  categories: CategoriesTypes[],
  mainCategorySlug: string,
  subCategorySlug?: string
) => {
  const mainCategory = categories.find(category => category.slug === decodeURIComponent(mainCategorySlug ?? ""));
  let subCategory: SubCategoriesTypes | undefined = undefined;
  if (subCategorySlug) {
    subCategory = mainCategory?.subcategories?.find(category => category.slug === decodeURIComponent(subCategorySlug));
  }

  if (subCategory) {
    return {
      title: subCategory.metaTitle,
      description: subCategory.metaDescription,
      keywords: subCategory.metaKeyword,
    };
  }

  return {
    title: mainCategory?.metaTitle,
    description: mainCategory?.metaDescription,
    keywords: mainCategory?.metaKeyword,
  };
};

function getTotalLengthFromArray(arr1: any[] | undefined, arr2: any[] | undefined) {
  const combineArray = (arr1 && arr1.concat(arr2)) ?? [];
  return combineArray.length;
}

const mappingResultForAlertCode38000 = (
  code: string,
  lang: LocaleKeysType,
  branchName: string,
  quantity: number | null
) => {
  switch (true) {
    case code === "SOLD_OUT" && lang === "en":
      return `Sold out at ${branchName}`;
    case code === "NOT_AVAILABLE" && lang === "en":
      return `Sold out at ${branchName}`;
    case code === "MODIFIED_QUANTITY" && lang === "en":
      return `Only 2 left at ${branchName}`;
    case code === "PICKUP_PERIOD_NOT_AVAILABLE" && lang === "en":
      return "Pick-up time not available";
    case code === "GIFT_SOLD_OUT" && lang === "en":
      return "Gift sold out";
    case code === "GIFT_MODIFIED_QUANTITY" && lang === "en":
      return `Insufficient gift quantity│Only ${quantity} left `;
    case code === "SOLD_OUT" && lang === "tc":
      return `${branchName} 已售罄`;
    case code === "NOT_AVAILABLE" && lang === "tc":
      return "已下架";
    case code === "MODIFIED_QUANTITY" && lang === "tc":
      return `${branchName} 只剩${quantity}份`;
    case code === "PICKUP_PERIOD_NOT_AVAILABLE" && lang === "tc":
      return "取餐時間不適用";
    case code === "GIFT_SOLD_OUT" && lang === "tc":
      return "禮品已換罄";
    case code === "GIFT_MODIFIED_QUANTITY" && lang === "tc":
      return `禮品數量不足│只剩${quantity}份`;
    default:
      return "";
  }
};

const memberTierMapper = (memberTiers: string[], translate: TFunction<string, string, string>) => {
  let msg = "";

  if (memberTiers && memberTiers?.length) {
    msg = `${memberTiers.join("/")} ${translate("reminder.some_members_exclusive")}`;
  } else {
    msg = translate("reminder.all_member_exclusive");
  }

  return msg;
};

const stuipMessage = (
  code: string,
  lang: LocaleKeysType,
  branchName: string,
  quantity: number | null,
  memberTiers: string[],
  translate: TFunction<string, string, string>
) => {
  switch (true) {
    case code === "NOT_AVAILABLE" && lang === "en":
      return "(Sold out│Removed)";
    case code === "NOT_AVAILABLE" && lang === "tc":
      return "[售罄│已移除]";
    case code === "MEMBER_EXCLUSIVE_NOT_AVAILABLE" && lang === "en":
      return `[${memberTierMapper(memberTiers, translate)}│Removed]`;
    case code === "MEMBER_EXCLUSIVE_NOT_AVAILABLE" && lang === "tc":
      return `[${memberTierMapper(memberTiers, translate)}│已移除]`;
    case code === "GIFT_SOLD_OUT" && lang === "en":
      return "(Out of Stock Free Gift)";
    case code === "GIFT_SOLD_OUT" && lang === "tc":
      return "[禮品已換罄]";
    case code === "GIFT_MODIFIED_QUANTITY" && lang === "en":
      return `(Free Gift│Only ${quantity} Left)`;
    case code === "GIFT_MODIFIED_QUANTITY" && lang === "tc":
      return `[禮品數量不足│只剩${quantity}份]`;
    case code === "PICKUP_PERIOD_NOT_AVAILABLE" && lang === "en":
      return "(Pick-up time not available|Removed)";
    case code === "PICKUP_PERIOD_NOT_AVAILABLE" && lang === "tc":
      return "[取餐時間不適用│已移除]";
    case code === "SOLD_OUT" && lang === "en":
      return `(Sold out at ${branchName})`;
    case code === "SOLD_OUT" && lang === "tc":
      return "[售罄│已移除]";
    case code === "MODIFIED_QUANTITY" && lang === "en":
      return `(Only ${quantity} Left│QTY Adjusted)`;
    case code === "MODIFIED_QUANTITY" && lang === "tc":
      return `[只剩${quantity}份│已更新數量]`;
    default:
      return "";
  }
};

const mappingResultForAlertCode38000Checkout = (
  code: string,
  lang: LocaleKeysType,
  branchName: string,
  quantity: number | null,
  memberTiers: string[],
  translate: TFunction<string, string, string>
) => {
  switch (true) {
    case code === "NOT_AVAILABLE" && lang === "en":
      return "(Sold out│Removed)";
    case code === "NOT_AVAILABLE" && lang === "tc":
      return "[售罄│已移除]";
    case code === "MEMBER_EXCLUSIVE_NOT_AVAILABLE" && lang === "en":
      return `[${memberTierMapper(memberTiers, translate)}│Removed]`;
    case code === "MEMBER_EXCLUSIVE_NOT_AVAILABLE" && lang === "tc":
      return `[${memberTierMapper(memberTiers, translate)}│已移除]`;
    case code === "GIFT_SOLD_OUT" && lang === "en":
      return "(Out of Stock Free Gift)";
    case code === "GIFT_SOLD_OUT" && lang === "tc":
      return "[禮品已換罄]";
    case code === "GIFT_MODIFIED_QUANTITY" && lang === "en":
      return `(Free Gift│Only ${quantity} Left)`;
    case code === "GIFT_MODIFIED_QUANTITY" && lang === "tc":
      return `[禮品數量不足│只剩${quantity}份]`;
    case code === "PICKUP_PERIOD_NOT_AVAILABLE" && lang === "en":
      return "(Pick-up time not available|Removed)";
    case code === "PICKUP_PERIOD_NOT_AVAILABLE" && lang === "tc":
      return "[取餐時間不適用│已移除]";
    case code === "SOLD_OUT" && lang === "en":
      return `(Sold out at ${branchName})`;
    case code === "SOLD_OUT" && lang === "tc":
      return `[${branchName} 已售罄]`;
    case code === "MODIFIED_QUANTITY" && lang === "en":
      return `(Only ${quantity} Left│QTY Adjusted)`;
    case code === "MODIFIED_QUANTITY" && lang === "tc":
      return `[只剩${quantity}份│已更新數量]`;
    default:
      return "";
  }
};

const convertCountry = (lang: LocaleKeysType, value?: string) => {
  if (lang === "en") {
    if (value === "hk") {
      return "Hong Kong";
    } else if (value === "macau") {
      return "Macau";
    } else {
      return "Mainland";
    }
  }

  if (lang === "tc") {
    if (value === "hk") {
      return "香港";
    } else if (value === "macau") {
      return "澳門";
    } else {
      return "中國";
    }
  }
};

const convertCountryFromComponentToApiFormat = (lang: LocaleKeysType, value?: string) => {
  switch (value) {
    case "Hong Kong":
    case "香港":
      return "hk";

    case "Macao":
    case "澳門":
      return "macao";

    default:
      return "mainland";
  }
};

const convertPreferLangToApiFormat = (value?: string) => {
  if (value?.toLowerCase() === "en") {
    return "en";
  } else if (value === "繁中") {
    return "zh";
  } else if (value?.toLowerCase() === "zh_TC") {
    return "zh";
  } else if (value === "Zh") {
    return "zh";
  } else {
    return "en";
  }
};

const convertPreferLangToComponentFormat = (value?: string) => {
  if (value?.toLowerCase() === "en") {
    return "en";
  } else if (value?.toLowerCase() === "zh") {
    return "繁中";
  }
};

const convertHasChildToBoolean = (value?: string) => {
  return value?.toLocaleLowerCase() === "是" || value?.toLocaleLowerCase() === "yes";
};

const convertHasChildToString = (value?: boolean) => {
  if (value === true) {
    return "YES";
  } else {
    return "NO";
  }
};

const converCountryToCountryCode = (value?: string) => {
  if (value === "Hong Kong") {
    return "852";
  } else if (value === "Macau") {
    return "853";
  } else {
    return "86";
  }
};

const convertTitle = (title: string, lang: LocaleKeysType) => {
  if (lang === "en") {
    return title;
  }

  if (lang === "tc") {
    if (title === "Mr.") {
      return "先生";
    } else if (title === "Mrs.") {
      return "太太";
    } else if (title === "Ms.") {
      return "女士";
    } else if (title === "Miss") {
      return "小姐";
    } else if (title === "Dr.") {
      return "博士";
    } else if (title === "Prof.") {
      return "教授";
    }
  }
};

const convertTitleToApiFormat = (title: string) => {
  if (title === "先生") {
    return "Mr.";
  } else if (title === "太太") {
    return "Mrs.";
  } else if (title === "女士") {
    return "Ms.";
  } else if (title === "小姐") {
    return "Miss";
  } else if (title === "博士") {
    return "Dr.";
  } else if (title === "教授") {
    return "Prof.";
  }
};

const convertGenderToApiFormat = (gender: string) => {
  switch (gender.toLowerCase()) {
    case "undisclosed":
    case "未公開的":
      return "undisclosed";

    case "male":
      return "male";

    default:
      return "female";
  }
};

const translateDeepLinkFrom = (target: string, lang: LocaleKeysType) => {
  const site = `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/${lang}/`;
  switch (target) {
    case "NEW":
      return site + ROUTES.LATEST_NEWS; // may have db id
    case "STORE_LOCATION":
      return site + ROUTES.STORE_LOCATION;
    case "DINE_IN_MENU":
      return site + ROUTES.DINE_IN_WALKING_IN_MENU;
    case "TAKE_AWAY_MENU":
      return site + ROUTES.INDEX;
    case "FAQ":
      return site + ROUTES.FAQ;
    case "CONTACT_US":
      return site + ROUTES.CONTACT;
    case "CATERING_ENQUIRY":
      return site + ROUTES.CAMPAIGN;
    case "ABOUT_SENRYO":
      return site + ROUTES.ABOUT;
    case "TERM_OF_USE":
      return site + ROUTES.TERMS_AND_CONDITION;
    case "PRIVACY_POLICY":
      return site + ROUTES.PRIVACY_AND_POLICY;
    case "FOOD_SAFETY":
      return site + ROUTES.QUALITYOFINGREDIENT;
    case "MEMBERSHIP_PROGRAM":
      return site + ROUTES.MEMBERSHIP_PROGRAM;
    case "MEMBERSHIP_PROGRAM_TNC":
      return "";
    case "SHOPPING_INDEX":
      return site + ROUTES.INDEX;
    case "APP_HOMEPAGE":
      return site + ROUTES.INDEX;
    case "SAVED_CARD":
      return site + ROUTES.MEMBER_SAVED_CARDS;
    case "MEMBER_AREA":
      return site + ROUTES.MEMBER;
    case "INBOX_PERSONAL_MESSAGE_LISTING":
      return site + ROUTES.INBOX_PERSONAL; // may have id  ??? how, is about crm
    case "INBOX_PROMOTION_MESSAGE_LISTING":
      return site + ROUTES.INBOX_PROMOTION; // may have db id
    case "INBOX_PERSONAL_MESSAGE":
      return ""; // may have id  ??? how, is about crm
    case "INBOX_PROMOTION_MESSAGE":
      return ""; // may have db id
    case "COUPON":
      return site + ROUTES.MEMBER_COUPON;
    case "TRANSACTION_HISTORY_IN_STORE":
      return site + ROUTES.TRANSACTION_INSTORE;
    case "TRANSACTION_HISTORY_ONLINE":
      return site + ROUTES.TRANSACTION_ONLINE;
    case "QUEUING":
      return site + ROUTES.INDEX;
    case "SIGNUP_WALKTHROUGH":
      return site + ROUTES.INDEX;
    default:
      return site;
  }
};

const isEmailValid = (email: string) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) && email?.length !== 0 && email?.length <= 100;
};

export {
  stuipMessage,
  isEmailValid,
  translateDeepLinkFrom,
  isCardHolderValid,
  mappingResultForAlertCode38000Checkout,
  mappingResultForAlertCode38000,
  generateCategoryMetaData,
  getCreditCardType,
  fetchRequest,
  getLangFromString,
  formatePickupDate,
  getRefCategoryDataType,
  isUserHasSelectedBranch,
  getProductApiInputParams,
  getRouteNameFromPathname,
  getProductQuantityFromCart,
  formatCardNumber,
  getCardType,
  isNameValid,
  checkIfNumberStringHasValue,
  generateCheckoutRequestPayload,
  getStringNumberValue,
  checkIfCreditCardNumberValid,
  getTotalLengthFromArray,
  convertTitle,
  converCountryToCountryCode,
  convertHasChildToString,
  convertPreferLangToComponentFormat,
  convertPreferLangToApiFormat,
  convertCountryFromComponentToApiFormat,
  convertCountry,
  convertHasChildToBoolean,
  convertTitleToApiFormat,
  convertGenderToApiFormat,
};
