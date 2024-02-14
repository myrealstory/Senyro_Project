import { AddCartSourceType } from "./cartTypes";

export type GeneralStateType = {
  MPGSError: string;
  isApplyingDiscount: boolean;
  isAddingToCart: boolean;
  isPaymentInProgressPopupDisplay: boolean;
  topBarErrorMessage: string[];
  isProjectInit: boolean;
  globalSelectedProductSkuCode: string | undefined;
  isGlobalSelectedProductASetProduct: boolean;
  isSetProductSelectedBeforeTheFirstTimePopup: boolean;
  globalSelectedProductSlugId: string | undefined;
  globalGetProductDatetime: string | undefined;
  isMenuOpen: boolean;
  isCVVPopup: boolean;
  isSetProductPopupOpen: boolean;
  cartKey: string;
  isBrandNewSet: boolean;
  isBodyScrollbarDisplay: boolean;
  isCartPickupOpen: {
    isOpen: boolean;
    cartType?: "NEW" | "EDIT";
  };
  transactionMode: { mode: string };
  registerEmail: string;
  isPopupOpen: boolean;
  isSwitchOfLang: boolean;
  isClickedLangSwitch: boolean;
  loginRedirectUrl: string;
  isAddCardValid: boolean;
  isLoadingScreenDisplay: boolean;
  transactionFilterDate: {
    fromYear: string;
    fromMonth: string;
    toYear: string;
    toMonth: string;
  };
  couponCount: { activeCount: number; expiredCount: number };
  isSubProductCanAdd: boolean;
  isSubProductCanMinus: boolean;
  isSubProductReachMaxium: boolean;
  itemTypeInSet: string[];
  productInCategory: number;
  activeIndexFaq: number;

  productArchorId: string;

  isAddButtonDisable: boolean;
  isMinusButtonDisable: boolean;

  noPreSelectBranch?: boolean;

  sourceForAddCart: AddCartSourceType;

  dimmedSetProductSkuCodes: string[];

  resetMemberPoint: boolean;
} & AlertMessageType;

export type AlertMessageType = {
  // reminder alert
  targetReminderSku?: string;
  reminderAlertContent?: string;
  reminderIconStyle:
    | "TICK"
    | "TICK_CTA"
    | "TICK_TEXTONLY"
    | "TICK_TEXTCTA"
    | "MARK"
    | "MARK_CTA"
    | "MARK_ICONCTA"
    | "MARK_TEXTONLY"
    | "MARK_ICONTITLE";

  // multi reminder alert
  multiReminder: {
    targetReminderSku?: string;
    reminderAlertContent?: string;
    reminderIconStyle:
      | "TICK"
      | "TICK_CTA"
      | "TICK_TEXTONLY"
      | "TICK_TEXTCTA"
      | "MARK"
      | "MARK_CTA"
      | "MARK_ICONCTA"
      | "MARK_TEXTONLY"
      | "MARK_ICONTITLE";
  }[];

  // next to field
  targetNextToFieldSku?: string;
  nextToFieldContent?: string;
  multiNextToFieldSkuWithContent?: {
    skuCode: string;
    content: string;
  }[];
} & GlobalAlertStatusType &
  StaticMessageOnTargetPage &
  SecondStaticMessageOnTargetPage;

export type StaticMessageOnTargetPage = {
  isDisplayStaticMessage: boolean;
  staticMessageType: "" | "WARNING" | "ERROR";
  staticMessageTitle: string;
  staticMessageContent: string;
  staticMessageItems: string[];
};

export type SecondStaticMessageOnTargetPage = {
  isDisplaySecondStaticMessage: boolean;
  secondStaticMessageType: "" | "WARNING" | "ERROR";
  secondStaticMessageTitle: string;
  secondStaticMessageContent: string;
  secondStaticMessageItems: string[];
};

export type GlobalAlertStatusType = {
  isGlobalAlertDisplay?: boolean;
  containerClasses?: string;
  alertTitle?: string | null;
  alertContent?: string | null;
  leftButtonText?: string | null;
  onLeftButtonClick?: (...params: any) => any;
  rightButtonText?: string | null;
  onRightButtonClick?: (...params: any) => any;
  extraContent?: string;
};
