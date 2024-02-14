import { PAYMENT_METHOD } from "@/constants/checkout/payment";
import { StaticImageData } from "next/image";
import { CartApiAlertListType, CartApiDataType } from "../cartTypes";
import { LocaleKeysType } from "@/app/i18n";

// ====================== Api Middleware ======================
export type ApiMIddlewareType = {
  lang: LocaleKeysType;
  pathname: string;
  options?: {
    accessToken?: string;
    addCartBeforeMemberLogin?: string;
    targetPageToBeRedirectedTo?: string;
    addCartIsContinue?: string;
    sourceForGetCart?: string;
  };
};

// ====================== Store-locator ======================
export interface Stores {
  id: number;
  branchCode: string;
  nameEn: string;
  displaySequence: number;
  storeLocationDisplayStatus: number;
  contactNumber: string;
  faxNumber: string;
  lat: number;
  long: number;
  lng: number;
  restaurantLicense: string;
  district: {
    id: number;
    name: string;
  };
  region: {
    id: number;
    name: string;
  };
  name: string;
  reminderMessage: string;
  directionMessage: string;
  address: string;
  openingHours: OpeningTime;
  distanceKm: null;
  isOpenNow: boolean;
  distanceWithGPS?: number;
}

export interface OpeningTime {
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
  [key: string]: string;
}

export interface Coords {
  lat: number;
  lng: number;
}

// ====================== AUTH ======================

export interface LoginResponseType {
  statusCode: number;
  message?: string;
  returnCode?: string;
  data?: {
    prefix: string;
    sessionToken: string;
    maxAttemptAllow: number;
    numberOfAttempt: number;
  };
}

export interface LoginOTPResponseType {
  statusCode: number;
  message?: string;
  returnCode?: string;
  data?: {
    verified: boolean;
    accessToken: string;
    maxAttemptAllow: number;
    numberOfAttempt: number;
  };
}

export interface RegistrationResponseType {
  statusCode: number;
  message?: string;
  returnCode?: string;
  data?: {
    prefix: string;
    sessionToken: string;
  };
}

export interface RegistrationOTPResponseType {
  statusCode: number;
  message?: string;
  returnCode?: string;
  data?: {
    verified: boolean;
  };
}

export interface SendOtpRequestParams {
  countryCode: string;
  mobileNumber: string;
}

export interface sendOtpVerifyParams {
  sessionToken: string;
  otp: string;
}

// ====================== MEMBER PROFILE ======================

export interface SpendingType {
  tier: string;
  maintainSpending: number;
  upgradeSpending: number;
  expiryDate: null;
}
export interface PointType {
  id: string;
  pointBalance: number;
  expiryDate: string;
}
export interface tierSpendingType {
  tier: string;
  tierCode: number;
  maintainSpending: number;
  upgradeSpending: number;
  effectiveDate: string;
  expiryDate: string;
}

export interface profileSliceType {
  apiData: ProfileResType;
}

export interface ProfileResType {
  statusCode: number;
  data: {
    memberNo: string;
    memberTier: string;
    memberTierCode: number;
    tierExpiryDate: string;

    // title: string;
    // firstName: string;
    // lastName: string;
    // gender: string;
    // birthMonth: number;
    // birthYear: number;
    // hasChild: boolean;
    // countryCode: string;
    // mobile: string;
    // email: string;
    // emailOptIn: boolean;
    // smsOptIn: boolean;
    // preferLang: string;
    // livingCountry: string;

    district: string;
    region: string;
    pointBalance: number;
    inboxUnreadCount: number;
    currentSpending: number;
    renewalSpending: number;
    tierSpending: tierSpendingType[];
    pointBucket: PointType[];
    isSuperAccount: boolean;
  } & editProfileReqestType;
}

export interface editProfileResType {
  data: string;
  returnCode: number;
  error: string;
  displayMessage: string;
  dateTime: Date;
}

export interface editProfileReqestType {
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthMonth: number;
  birthYear: number;
  hasChild: boolean;
  countryCode: string;
  mobile: string;
  email: string;
  emailOptIn?: boolean;
  smsOptIn?: boolean;
  preferLang: string;
  districtCode?: string; // from region API , only require if countryCode is 852
  regionCode?: string; // from region API , only require if countryCode is 852
  livingCountry: string;
}

// ====================== MEMBER INBOX ======================

export interface SinglePersonalMessageType {
  statusCode: number;
  data: {
    id: string;
    title: string;
    subTitle?: string;
    date: string;
    imageHdUrl?: string;
    imageUrl?: string;
    imageAlt?: string;
    content: string;
    readTime?: string;
    ctaButtonName?: "";
    ctaUrl?: "";
    ctaNewTab?: number;
    ctaButtonDeeplink?: "";
    ctaButtonDeeplinkId?: "";
  };
}

export type SinglePromotionalMessageType = SinglePersonalMessageType;

export interface InboxMessageProps {
  id: string;
  title: string;
  subTitle: string | null;
  date: string;
  readTime: string | null;
}
export interface InboxResType {
  statusCode: number;
  data: {
    personalUnreadCount: number;
    promotionUnreadCount: number;
    personal: InboxMessageProps[];
    promotional: InboxMessageProps[];
  };
}

export interface InboxUnreadCount {
  statusCode: number;
  data: { unreadCount: number };
}

// ====================== MEMBER COUPON ======================

export interface ActiveCouponsType {
  id: string;
  code: string;
  title: string;
  effectiveDate: string;
  expiryDate: string;
  imageUrl: StaticImageData | null;
  imageHdUrl: StaticImageData | null;
  tnc: string;
  status: string;
  redeemDate?: null;
  channels: string[];
  remarks?: null;
}

export type inactiveCouponsType = ActiveCouponsType;

export interface CouponResponseType {
  statusCode: number;
  data: {
    activeCouponCount: number;
    inactiveCouponCount: number;
    activeCouponList: ActiveCouponsType[] | [];
    inActiveCouponList: inactiveCouponsType[] | [];
  };
}

export interface SingleCouponResponseType {
  statusCode: number;
  data: {
    id: string;
    code: string;
    title: string;
    effectiveDate: string;
    expiryDate: string;
    imageUrl: StaticImageData | null;
    imageHdUrl: StaticImageData | null;
    tnc: string;
    status: string;
    redeemDate: null;
    channels: string[];
    pospluId: string;
    rewardCodeType: string;
    availableQty: number;
    lockedQty: number;
    minQtyPerTrx: number;
    maxQtyPerTrx: number;
    remarks: null;
    qrcodeStr?: string;
  };
  returnCode?: string;
}

// ====================== MEMBER INBOX ======================

export interface PersonalMessage {
  id: number;
  title: string;
  subTitle: string;
  date: string;
  type: string;
  readTime: string;
}

export type PromotionalMessage = PersonalMessage;
export interface InboxMessages {
  status: number;
  data: {
    personalUnreadCount: number;
    promotionalUnreadCount: number;
    promotional: PromotionalMessage[];
    personal: PersonalMessage[];
  };
}

export interface SaveCardType {
  id: string;
  cardNumber: string;
  cardExpiryYear: number;
  cardExpiryMonth: number;
  cardImage: string;
  cardBankType: string;
  qrcodeStr: string;
}

export interface SaveCardResponseType {
  statusCode: number;
  data: SaveCardType[];
  returnCode?: string;
}

export interface FavoriteItemListType {
  statusCode: number;
  date: {
    id: string;
    code: string;
    createDate: string;
  };
}

// ====================== MEMBER RENEW ======================
export interface RenewResponseType {
  statusCode: number;
  data: {
    renewMemberTier: {
      tier: string;
      tierCode: number;
      effectiveDate: string;
      expiryDate: string;
      renewalSpending: number;
      renewRequiredSpending: number;
      remainingToRenewSpending: number;
    };
    upgradeMemberTier: {
      nextTier: string;
      effectiveDate: string;
      expiryDate: string;
      upgradeSpending: number;
      upgradeRquiredSpending: number;
      remainingToUpgradeSpending: number;
      tier: string;
      tierCode: number;
    };
  };
}

// ================ Member Registration ====================
export interface sendRegistrationInfoParams {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  mobileOptin: boolean;
  email: string;
  emailOptin: boolean;
  gender: string;
  title: string;
  hasChild?: boolean;
  birthMonth: number;
  birthYear: number;
  regionCode?: string | null;
  districtCode?: string | null;
  livingCountry: string;
  preferLang: string;
  token: string;
}

export interface RegistrationInfoSuccessfulResponseType {
  statusCode: number;
  message?: string;
  returnCode?: string;
  data?: {
    expectedTierCode: number;
    expectedTier: string;
  };
}

// export interface RegistrationErrorResponseErrorType {
//   statusCode: number;
//   message: string;
//   returnCode: string;
// }

// export type RegistrationRes = RegistrationInfoSuccessfulResponseType | RegistrationErrorResponseErrorType;

export interface ProfileType {
  memberNo: string;
  memberTierCode: string;
  memberTier: string;
  tierExpiryDate: string;
  pointBalance: number;
  inboxUnreadCount: number;
  currentSpending: number;
  renewalSpending: number;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthMonth: Date;
  hasChild: false;
  countryCode: string;
  mobileNumber: string;
}

export interface sendOtpVerifyParams {
  sessionToken: string;
  otp: string;
}

// ================ Payment checkout ====================

type Details = {
  cardHolder?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  saveCardEnabled?: boolean;
  token?: any; // mobile payment
};

type PaymentInfo = {
  paymentMethodId?: string;
  savedCardId?: string;
  details?: Details;
};

type CouponInfo = {
  memberPointRedeem?: number;
  promoCode?: string;
  memberCouponId?: string;
};

type ContactInfo = {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  email: string;
  optin: boolean;
};

export type OrderCheckoutRequest = {
  paymentInfo: PaymentInfo;
  couponInfo: CouponInfo;
  contactInfo: ContactInfo;
};

export type OrderCheckoutResponse = {
  redirectLink?: string;
  returnHtml?: string;
  returnHtmlScriptId?: string;
  returnStatus?: "success" | "error";
  orderStatus?: string;
  result: CartApiDataType["result"];
  cart: CartApiDataType["cart"];
  alertList: CartApiDataType["alertList"];
};

// ================ Payment Method ====================

export type PaymentConfigType = {
  description: string;
  paymentMethodId: PAYMENT_METHOD; // upg payment method id
  iconImage: string;
  canSaveCard?: boolean; // for new credit card
  savedCardInfo?: SaveCardType; // for savedCard
  saveCardPaymentMethodId?: string;
};

export type GetPaymentMethodResponse = {
  savedCard: PaymentConfigType[];
  newPaymentMethods: PaymentConfigType[];
};

// ================ Wallet payment ====================

export type GetApplepayMerchantInfoResponse = {
  merchantInfo: {
    merchantName: string;
    merchantId: string;
  };
};

export type GetGooglepayMerchantInfoResponse = {
  merchantInfo: {
    merchantName: string;
    merchantId: string;
    gateway: string;
    gatewayMerchantId: string;
  };
};

export type ValidateApplepaySessionRequest = {
  paymentMethodId: string;
  merchantIdentifier: string;
  appleUrl: string;
  displayName: string;
  domainName: string;
};

export type ValidateApplepaySessionResponse = {
  epochTimestamp: string;
  expiresAt: number;
  merchantSessionIdentifier: string;
  nonce: string;
  merchantIdentifier: string;
  domainName: string;
  displayName: string;
  signature: string;
  operationalAnalyticsIdentifier: string;
  retries: number;
  pspId: string;
};

// ================ Available Member Checkout Coupon ====================

export type GetAvailableOnlineCouponResponse = {
  id: string;
  title: string;
};

// ================ Get Payment Status ====================

export declare enum OrderStatusEnum {
  "PENDING" = "PENDING",
  "FAIL" = "FAIL",
  "SUCCESS" = "SUCCESS",
}

export type GetOrderStatusResponse = {
  orderStatus: OrderStatusEnum;
};

// ================ Get Order confirmation info ====================

export type OrderConfirmResponse = {
  firstName: string;
  lastName: string;
  orderNumber: string;
  pickupDateTime: Date | string;
  pickupStoreName: string;
  pickupStoreAddress: string;
  pickupNo: string;
  pickupQrCodeUrl: string;
  registrationUrl?: string;
  embeddedOrderStr?: string;
};

// ================= sales history ============================
export interface salesHistoryUnitType {
  trxId: string;
  shopCode: string;
  store: string;
  orderNumber: string;
  orderDate: string;
  orderDatetime: string;
  embeddedOrderStr: string;
  orderMonth: string;
  earnPoint: number;
  burnPoint: number;
  pickupStatus: PickupStatusType;
  pointMovement: number;
  orderAmount: number;
  orderType: string;
}

export interface SalesOnlineType {
  trxId: string;
  shopCode: string;
  store: string;
  orderNumber: string;
  orderDate: string;
  embeddedOrderStr: string;
  orderDatetime: string;
  orderMonth: string;
  earnPoint: number;
  burnPoint: number;
  pointMovement: number;
  orderAmount: number;
  orderType: string;
  pickupStatus: PickupStatusType;
}

export interface SalesOnlineHistoryType {
  orders: SalesOnlineType[];
  awaitPickupOrders: awaitPickupOrdersType[];
}

export type PickupStatusType = "WAITING" | "CUSTOMER_PICKUP" | "SYSTEM_PICKUP" | "null";

export interface awaitPickupOrdersType {
  embeddedOrderStr: string;
  trxId: string;
  orderNumber: string;
  orderDatetime: string;
  pickupDatetime: string;
  pickupStoreName: string;
  pickupStatus: PickupStatusType;
}

export interface salesHistoryRespondType {
  statusCode: number;
  data: {
    inStoreTotal: number;
    inStore: salesHistoryUnitType[];
    onlineTotal: number;
    online: SalesOnlineHistoryType;
  };
}

export interface OrderCustomerType {
  id: number;
  ordersId: number;
  language: string;
  memberNumber: null;
  memberTier: null;
  firstName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  email: string;
  optin: boolean;
  memberName: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}

export interface OrderDetailsType {
  id: number;
  ordersId: number;
  productsId: number;
  isModifier: boolean;
  modifiersId: null;
  modifierNameEn: null;
  modifierNameTc: null;
  productSkuCode: string;
  productMposCode: string;
  productNameEn: string;
  productNameTc: string;
  productNameJp: string;
  type: null;
  productDetails: [];
  qty: number;
  unitPrice: number;
  discountAmount: null;
  discountCode: null;
  discountName: null;
  discountPercent: null;
  discountPrice: null;
  subTotal: number;
  refCategoryNameEn: string | null;
  refCategoryNameTc: string | null;
  categoriesId: number | null;
  categoryNameEn: string | null;
  categoryNameTc: string | null;
  subcategoriesId: number | null;
  subcategoryNameEn: string | null;
  subcategoryNameTc: string | null;
  recommendationsId: number | null;
  recommendationNameEn: string | null;
  recommendationNameTc: string | null;
  discounts: [] | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ModifiersType {
  id: number;
  ordersId: number;
  productsId: number;
  isModifier: boolean;
  modifiersId: number;
  modifierNameEn: string;
  modifierNameTc: string;
  productSkuCode: string;
  productMposCode: string;
  productNameEn: string;
  productNameTc: string;
  productNameJp: string;
  type: string;
  productDetails: [] | null;
  qty: number;
  unitPrice: number;
  discountAmount: null;
  discountCode: null;
  discountName: null;
  discountPercent: null;
  discountPrice: null;
  subTotal: number;
  refCategoryNameEn: string | null;
  refCategoryNameTc: string | null;
  categoriesId: number | null;
  categoryNameEn: string | null;
  categoryNameTc: string | null;
  subcategoriesId: number | null;
  subcategoryNameEn: string | null;
  subcategoryNameTc: string | null;
  recommendationsId: number | null;
  recommendationNameEn: string | null;
  recommendationNameTc: string | null;
  discounts: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface onlineOrderReceiptParamType {
  orderNumber: string;
  // role: string;
}

export interface onlineOrderReceiptType {
  statusCode: number;
  data: {
    transactionNumber: string;
    orderTime: string;
    pickupNo: string;
    pickupQrCodeStr: string;
    pickupTime: string;
    pickupStoreName: string;
    pickupStoreAddress: string;
    pickupStoreContactNumber: string;
    paymentType: string;
    paymentDetail: {
      totalAmount: string;
      paymentMethod?: string;
      creditCardNumber?: string;
      name: string;
      email: string;
      phoneNumber: string;
      memberName?: string;
      memberNumber?: string;
    };
    orderSummary: {
      memberPointRedeemed: number;
      memberPointRedeemedPrice: string;
      modifiers?: [
        {
          name: string;
        }
      ];
      items: [
        {
          name: string;
          qty: number;
          subTotal: string;
        }
      ];
      addonItems?: [];
      giftItems?: [
        {
          name: string;
          qty: number;
          subTotal: string;
        }
      ];
      itemTotalQty: number;
      itemTotalAmount: string;
      totalAmount: string;
      discounts?: [
        {
          name: string;
          discountAmount: string;
        },
        {
          name: string;
          discountAmount: string;
        },
        {
          name: string;
          discountAmount: string;
        }
      ];
    };
  };
}

export interface onlineSalesHistoryType {
  statusCode: number;
  data: {
    id: number;
    posTransactionNumber: null;
    eventOrderNumber: string;
    siteOrderRefNumber: string;
    orderNumber: string;
    orderDatetime: string;
    totalAmount: number;
    qty: number;
    subTotalAmount: number;
    discountAmount: number;
    paymentType: string | null;
    paymentMethod: string | null;
    creditCard: number | null;
    couponCodeId: number | null;
    pickupStatus: null;
    pickupBranchCode: string;
    pickupBranchPhoneNo: string;
    pickupBranchNameEn: string;
    pickupBranchNameTc: string;
    pickupBranchRegion: string;
    pickupBranchAddress: string;
    pickupDatetime: string;
    actualPickupTime: string | null;
    memberPointsRedeemed: number;
    memberPointsEarned: number;
    emailStatus: string;
    moneyPaidDate: null;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    orderCustomers: OrderCustomerType[];
    orderDetails: OrderDetailsType[];
    modifiers: ModifiersType[];
    customerName: string;
    totalPayAmount: number;
  };
}

export interface instoreSalesHistoryType {
  statusCode: number;
  data: {
    posTransactionNumber: string;
    pickupBranchNameEn: string;
    trxDateTime: string;
    trxAmount: number;
    eligibleAmount: number;
    earnPoint: number;
    burnPoint: number;
    pointMovement: number;
    isPointDisplay: boolean;
    itemList: [
      {
        itemCode: string;
        itemName: string;
        itemQty: number;
      },
      {
        itemCode: string;
        itemName: string;
        itemQty: number;
      }
    ];
  };
}

export interface instoreSalesHistoryParam {
  id: string;
  mode: string;
}
export interface transactionDateType {
  fromDate: string;
  toDate: string;
}

// ================ Create Member Save Card ====================
export type MemberSaveCardRequest = {
  cardHolder?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
};

export type MemberSaveCardResponse = {
  result: MemberSaveCardStatusResponse["status"];
  alertList?: CartApiAlertListType[];
  returnHtml?: string;
  returnHtmlScriptId?: string;
  returnStatus?: string;
};

export type MemberSaveCardStatusResponse = {
  status: "PENDING" | "SUCCESS" | "FAIL";
};

// ================ Delete Member Save Card ====================
export type DeleteMemberSaveCardRequest = {
  id: string;
};

// ================ Delete FavItemList ====================

export type DeleteFavItemListRequest = {
  skuCode: string;
};

// ================ Apply Discount ====================

export type ApplyDiscountType = OrderCheckoutRequest;
export type ApplyDiscountResponseType = CartApiDataType;

// ================ Check Guest Email Optin Status ====================

export type CheckGuestEmailOptinStatusRequestType = {
  email: string;
};

export type CheckGuestEmailOptinStatusResponseType = {
  id: number;
  email: string;
  optinStatus: boolean;
};

// ================ Re-order ====================

export type ReOrderRequestType = {
  orderNumber: string;
};

// ================ Member Email Verification ====================
export type VerifyNewUserEmailRequestType = {
  lang: LocaleKeysType;
  session: string;
};

export type VerifyNewUserEmailResponseType = {
  isValid: boolean;
};
// ================== NEWS&OFFERS =====================

export type NewsOffersListType = {
  id: number;
  slug: string;
  isNew: boolean;
  tags: string[];
  title: string;
  subtitle: string | null;
  thumbnail: string | null;
  thumbnailAlt: string | null;
};

export type NewsOffersListDetailType = {
  id: number;
  slug: string;
  isNew: boolean;
  tags: string[];
  title: string;
  subtitle: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeyword: string | null;
  thumbnail: string | null;
  thumbnailAlt: string | null;
  image: string | null;
  imageAlt: string | null;
  youtubeLink: string | null;
  description: string | null;
  ctaButtonName: string | null;
  ctaUrl: string | null;
  ctaUrlNewTab: boolean;
  ctaButtonDeepLink: string | null;
  ctaButtonDeepLinkId: string | null;
  published: string;
};

export type UnsubscribeResponseType = {
  statusCode: 200 | 400;
  message: string;
  returnCode: string;
};

export type FloatingPopupBannerType = {
  id: number;
  internalDescription: string;
  banner: string | null;
  imageAlt: string | null;
  redirectUrl: string | null;
  redirectUrlNewTab: boolean;
  ctaButtonDeepLink: string | null;
  ctaButtonDeepLinkId: string | null;
};

export type HeroBannerType = {
  id: number;
  internalDescription: string;
  title: string | null;
  description: string | null;
  webHomepageBanners: string | null;
  imageAlt: string | null;
  ctaButtonName: string | null;
  ctaUrl: string | null;
  ctaUrlNewTab: boolean;
  ctaButtonDeepLink: string | null;
  ctaButtonDeepLinkId: string | null;
  uploadPdf: string | null;
  darkBackground: boolean | number;
};

export type PromotionalMessageApiType = {
  id: number;
  message: string[];
  urlNewTab: boolean[];
};

export type PromotionalMessageFooterApiType = {
  id: number;
  message: string[];
  image: string[];
};
