const CookiesKey = {
  isDisplayFooter: "isDisplayFooter" as const,
  i18next: "i18next" as const,
  memberForm: "memberForm" as const,
  setCart: "setCart" as const,
  deviceId: "deviceId" as const,
  accessToken: "accessToken" as const,
  guestWithCartData: "guestWithCartData" as const,
  loginSessionToken: "loginSessionToken" as const,
  registrationSessionToken: "registrationSessionToken" as const,
  addCartBeforeMemberLogin: "addCartBeforeMemberLogin" as const,
  targetPageToBeRedirectedTo: "targetPageToBeRedirectedTo" as const,
  isCookieAccepted: "isCookieAccepted" as const,
  addCartIsContinue: "addCartIsContinue" as const,
  MPGSError: "MPGSError" as const,
  popupMessageContent: "popupMessageContent" as const,
  staticMessageContent: "staticMessageContent" as const,
  reminderMessageContent: "reminderMessageContent" as const,
  sourceForGetCart: "sourceForGetCart" as const,
  screenPopBanner: "screenPopBanner" as const,
  floatingPopBanner: "floatingPopBanner" as const,
  verifyEmailToken: "verifyEmailToken" as const,
  branchSelectionStep: "branchSelectionStep" as const,
  globalSelectedProductSkuCode: "globalSelectedProductSkuCode" as const,
  branchCode: "branchCode" as const,
  productArchorId: "productArchorId" as const,
  checkoutFormInfo: "checkoutFormInfo" as const,
  isPaymentInProgress: "isPaymentInProgress" as const,
};

type CookiesKeyType = keyof typeof CookiesKey;

export type { CookiesKeyType };

export { CookiesKey };
