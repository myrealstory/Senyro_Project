import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  AlertMessageType,
  GeneralStateType,
  GlobalAlertStatusType,
  SecondStaticMessageOnTargetPage,
  StaticMessageOnTargetPage,
} from "@/types/generalTypes";
import { AddCartSourceType } from "@/types/cartTypes";

const alertStates: AlertMessageType = {
  // global alert (AlertModal)
  isGlobalAlertDisplay: false,
  alertTitle: "",
  alertContent: "",
  leftButtonText: "",
  onLeftButtonClick: () => null,
  extraContent: "",

  // reminder alert
  targetReminderSku: "",
  reminderAlertContent: "",
  reminderIconStyle: "MARK",

  // multi reminder alert
  multiReminder: [{
    targetReminderSku: "",
    reminderAlertContent: "",
    reminderIconStyle: "MARK",
  }],
  
  // next to field
  targetNextToFieldSku: "",
  nextToFieldContent: "",

  // StaticMessageOnTargetPage
  isDisplayStaticMessage: false,
  staticMessageType: "",
  staticMessageTitle: "",
  staticMessageItems: [""],
  staticMessageContent: "",

  isDisplaySecondStaticMessage: false,
  secondStaticMessageType: "",
  secondStaticMessageTitle: "",
  secondStaticMessageItems: [""],
  secondStaticMessageContent: "",

  // multi next to field
  multiNextToFieldSkuWithContent: [],
};

const initialState: GeneralStateType = {
  isApplyingDiscount: false,
  isAddingToCart: false,
  isPaymentInProgressPopupDisplay: false,
  isLoadingScreenDisplay: false,
  topBarErrorMessage: [],
  isProjectInit: false,
  globalSelectedProductSkuCode: undefined,
  isGlobalSelectedProductASetProduct: false,
  isSetProductSelectedBeforeTheFirstTimePopup: false,
  globalSelectedProductSlugId: undefined,
  globalGetProductDatetime: undefined,
  isMenuOpen: false,
  isSetProductPopupOpen: false,
  cartKey: "",
  isCVVPopup: false,
  isBrandNewSet: false,
  isBodyScrollbarDisplay: true,
  isCartPickupOpen: {
    isOpen: false,
    cartType: "NEW",
  },
  transactionMode: { mode: "instore" },
  registerEmail: "",
  isPopupOpen: false,
  isSwitchOfLang: false,
  isClickedLangSwitch: false,
  loginRedirectUrl: "",
  isAddCardValid: false,
  transactionFilterDate: {
    fromYear: "",
    fromMonth: "",
    toYear: "",
    toMonth: "",
  },
  couponCount: { activeCount: 0, expiredCount: 0 },
  isSubProductCanAdd: false,
  isSubProductCanMinus: false,
  isSubProductReachMaxium: false,
  itemTypeInSet: [],
  productInCategory: 0,

  productArchorId: "",

  isAddButtonDisable: false,
  isMinusButtonDisable: false,

  ...alertStates,

  noPreSelectBranch: false,

  sourceForAddCart: "",
  activeIndexFaq: -1,

  dimmedSetProductSkuCodes: [""],

  resetMemberPoint: false,

  MPGSError: "",
};

const generalState = createSlice({
  name: "generalState",
  initialState,
  reducers: {
    setMPGSError: (state, action: PayloadAction<string>) => {
      state.MPGSError = action.payload;
    },
    resetAllAlert: state => {
      return { ...state, ...alertStates };
    },
    resetMemberPoint: state => {
      state.resetMemberPoint = !state.resetMemberPoint;
    },
    setStaticMessageOnTargetPage: (state, action: PayloadAction<StaticMessageOnTargetPage>) => {
      state.isDisplayStaticMessage = action.payload.isDisplayStaticMessage;
      state.staticMessageType = action.payload.staticMessageType;
      state.staticMessageTitle = action.payload.staticMessageTitle;
      state.staticMessageItems = action.payload.staticMessageItems;
      state.staticMessageContent = action.payload.staticMessageContent;
    },
    setSecondStaticMessageOnTargetPage: (state, action: PayloadAction<SecondStaticMessageOnTargetPage>) => {
      state.isDisplaySecondStaticMessage = action.payload.isDisplaySecondStaticMessage;
      state.secondStaticMessageType = action.payload.secondStaticMessageType;
      state.secondStaticMessageTitle = action.payload.secondStaticMessageTitle;
      state.secondStaticMessageItems = action.payload.secondStaticMessageItems;
      state.secondStaticMessageContent = action.payload.secondStaticMessageContent;
    },
    setSourceForAddCart: (state, action: PayloadAction<AddCartSourceType>) => {
      state.sourceForAddCart = action.payload;
    },
    setIsSetProductSelectedBeforeTheFirstTimePopup: (state, action: PayloadAction<boolean>) => {
      state.isSetProductSelectedBeforeTheFirstTimePopup = action.payload;
    },
    setNoPreSelectBranch: (state, action: PayloadAction<boolean>) => {
      state.noPreSelectBranch = action.payload;
    },
    setIsAddButtonDisable: (state, action: PayloadAction<boolean>) => {
      state.isAddButtonDisable = action.payload;
    },
    setProductArchorId: (state, action: PayloadAction<string>) => {
      state.productArchorId = action.payload;
    },
    setNextToFieldStatus: (state, action: PayloadAction<any>) => {
      state.targetNextToFieldSku = action.payload.targetNextToFieldSku;
      state.nextToFieldContent = action.payload.nextToFieldContent;
    },
    setDimmedSetProductSkuCodes: (state, action: PayloadAction<any>) => {
      state.dimmedSetProductSkuCodes = action.payload;
    },
    setMultiNextToFieldSkuWithDataStatus: (state, action: PayloadAction<any>) => {
      state.multiNextToFieldSkuWithContent = action.payload;
    },
    setReminderAlertStatus: (state, action: PayloadAction<any>) => {
      state.targetReminderSku = action.payload.targetReminderSku;
      state.reminderAlertContent = action.payload.reminderAlertContent;
      state.reminderIconStyle = action.payload.reminderIconStyle;
    },
    setMultiReminderAlertStatus: (state, action: PayloadAction<typeof alertStates.multiReminder>) => {
      state.multiReminder = action.payload;
    },
    resetReminderAlertStatus: state => {
      state.targetReminderSku = undefined;
      state.reminderAlertContent = undefined;
      state.multiReminder = alertStates.multiReminder;
    },
    setGlobalAlertStatus: (state, action: PayloadAction<GlobalAlertStatusType>) => {
      state.isGlobalAlertDisplay = action.payload.isGlobalAlertDisplay;
      state.containerClasses = action.payload.containerClasses;
      state.alertTitle = action.payload.alertTitle;
      state.alertContent = action.payload.alertContent;
      state.leftButtonText = action.payload.leftButtonText;
      state.onLeftButtonClick = action.payload.onLeftButtonClick;
      state.rightButtonText = action.payload.rightButtonText;
      state.onRightButtonClick = action.payload.onRightButtonClick;
      state.extraContent = action.payload.extraContent;
    },
    resetGlobalAlertStatus: state => {
      state.isGlobalAlertDisplay = false;
      state.containerClasses = undefined;
      state.alertTitle = undefined;
      state.alertContent = undefined;
      state.leftButtonText = undefined;
      state.onLeftButtonClick = undefined;
      state.rightButtonText = undefined;
      state.onRightButtonClick = undefined;
    },
    setIsApplyingDiscount: (state, action: PayloadAction<GeneralStateType["isApplyingDiscount"]>) => {
      state.isApplyingDiscount = action.payload;
    },
    setIsAddingToCart: (state, action: PayloadAction<GeneralStateType["isAddingToCart"]>) => {
      state.isAddingToCart = action.payload;
    },
    setIsPaymentInProgressPopupDisplay: (
      state,
      action: PayloadAction<GeneralStateType["isPaymentInProgressPopupDisplay"]>
    ) => {
      state.isPaymentInProgressPopupDisplay = action.payload;
    },
    setLoadingScreenDisplay: (state, action: PayloadAction<GeneralStateType["isLoadingScreenDisplay"]>) => {
      state.isLoadingScreenDisplay = action.payload;
    },
    setTopBarErrorMessage: (state, action: PayloadAction<GeneralStateType["topBarErrorMessage"]>) => {
      if (!action.payload || !action.payload?.length) {
        state.topBarErrorMessage = [];
      } else {
        state.topBarErrorMessage = state.topBarErrorMessage.concat(action.payload);
      }
    },
    setIsProjectInit: (state, action: PayloadAction<GeneralStateType["isProjectInit"]>) => {
      state.isProjectInit = action.payload;
    },
    setGlobalGetProductDatetime: (state, action: PayloadAction<GeneralStateType["globalGetProductDatetime"]>) => {
      state.globalGetProductDatetime = action.payload;
    },
    setIsSetProductPopupOpen: (
      state,
      action: PayloadAction<{
        isSetProductPopupOpen: GeneralStateType["isSetProductPopupOpen"];
        isBrandNewSet: GeneralStateType["isBrandNewSet"];
        cartKey: string;
      }>
    ) => {
      state.isSetProductPopupOpen = action.payload.isSetProductPopupOpen;
      state.isBrandNewSet = action.payload.isBrandNewSet;
      state.cartKey = action.payload.cartKey;
    },
    setIsMenuOpen: (state, action: PayloadAction<GeneralStateType["isMenuOpen"]>) => {
      state.isMenuOpen = action.payload;
    },
    setIsBodyScrollbarDisplay: (state, action: PayloadAction<GeneralStateType["isBodyScrollbarDisplay"]>) => {
      state.isBodyScrollbarDisplay = action.payload;
    },
    setIsCartPickupOpen: (state, action: PayloadAction<GeneralStateType["isCartPickupOpen"]>) => {
      state.isCartPickupOpen = action.payload;
    },
    setIsCVVPopup: (state, action: PayloadAction<GeneralStateType["isCVVPopup"]>) => {
      state.isCVVPopup = action.payload;
    },
    setTransactionMode: (state, action: PayloadAction<GeneralStateType["transactionMode"]>) => {
      state.transactionMode.mode = action.payload.mode;
    },
    setRegisterEmail: (state, action: PayloadAction<GeneralStateType["registerEmail"]>) => {
      state.registerEmail = action.payload;
    },
    setIsPopupOpen: (state, action: PayloadAction<GeneralStateType["isPopupOpen"]>) => {
      state.isPopupOpen = action.payload;
    },
    setIsSwitchOfLang: (state, action: PayloadAction<GeneralStateType["isSwitchOfLang"]>) => {
      state.isSwitchOfLang = action.payload;
    },
    setIsClickedLangSwitch: (state, action: PayloadAction<GeneralStateType["isClickedLangSwitch"]>) => {
      state.isClickedLangSwitch = action.payload;
    },
    setGlobalSelectedProductSkuCode: (state, action: PayloadAction<string>) => {
      state.globalSelectedProductSkuCode = action.payload;
    },
    setGlobalSelectedProductSlugId: (state, action: PayloadAction<string>) => {
      state.globalSelectedProductSlugId = action.payload;
    },
    setIsGlobalSelectedProductASetProduct: (
      state,
      action: PayloadAction<GeneralStateType["isGlobalSelectedProductASetProduct"]>
    ) => {
      state.isGlobalSelectedProductASetProduct = action.payload;
    },
    setBasicProductDataForOtherComponents: (
      state,
      action: PayloadAction<{
        skuCode: GeneralStateType["globalSelectedProductSkuCode"];
        date: GeneralStateType["globalGetProductDatetime"];
        slugId: GeneralStateType["globalSelectedProductSlugId"];
        type: GeneralStateType["isGlobalSelectedProductASetProduct"];
      }>
    ) => {
      state.globalSelectedProductSkuCode = action.payload.skuCode;
      state.globalGetProductDatetime = action.payload.date;
      state.globalSelectedProductSlugId = action.payload.slugId;
      state.isGlobalSelectedProductASetProduct = action.payload.type;
    },
    setLoginRedirectUrl: (state, action: PayloadAction<string>) => {
      state.loginRedirectUrl = action.payload;
    },
    setIsAddCardValid: (state, action: PayloadAction<boolean>) => {
      state.isAddCardValid = action.payload;
    },
    setTransactionFilterDate: (state, action: PayloadAction<GeneralStateType["transactionFilterDate"]>) => {
      state.transactionFilterDate = action.payload;
    },
    setCouponCount: (state, action: PayloadAction<GeneralStateType["couponCount"]>) => {
      state.couponCount = action.payload;
    },
    setIsSubProductCanAdd: (state, action: PayloadAction<GeneralStateType["isSubProductCanAdd"]>) => {
      state.isSubProductCanAdd = action.payload;
    },
    setIsSubProductCanMinus: (state, action: PayloadAction<GeneralStateType["isSubProductCanMinus"]>) => {
      state.isSubProductCanMinus = action.payload;
    },
    setItemTypeInSet: (
      state,
      action: PayloadAction<{
        action: "ADD" | "DELETE" | "PURGE";
        skuCode: string;
      }>
    ) => {
      const cloneSet = JSON.parse(JSON.stringify(state.itemTypeInSet));
      const targetIndex = cloneSet.indexOf(action.payload.skuCode);

      if (action.payload.action === "ADD" && targetIndex === -1) {
        state.itemTypeInSet = state.itemTypeInSet.concat(action.payload.skuCode);
      }

      if (action.payload.action === "DELETE") {
        if (targetIndex !== -1) {
          cloneSet.splice(targetIndex, 1);
        }
        state.itemTypeInSet = cloneSet;
      }

      if (action.payload.action === "PURGE") {
        state.itemTypeInSet = [];
        state.isSetProductSelectedBeforeTheFirstTimePopup = false;
        state.globalSelectedProductSkuCode = undefined;
      }
    },
    setIsSubProductReachMaxium: (state, action: PayloadAction<GeneralStateType["isSubProductReachMaxium"]>) => {
      state.isSubProductReachMaxium = action.payload;
    },
    setProductInCategory: (state, action: PayloadAction<number>) => {
      state.productInCategory = action.payload;
    },
    closeAllPopup: state => {
      state.isSetProductPopupOpen = false;
      state.isLoadingScreenDisplay = false;
      state.isCartPickupOpen.isOpen = false;
      state.isPopupOpen = false;
      state.isGlobalAlertDisplay = false;
    },
    setActiveIndexFaq: (state, action: PayloadAction<number>) => {
      state.activeIndexFaq = action.payload;
    },
  },
});

export const {
  setMultiReminderAlertStatus,
  setMPGSError,
  resetMemberPoint,
  resetAllAlert,
  setDimmedSetProductSkuCodes,
  setStaticMessageOnTargetPage,
  setSecondStaticMessageOnTargetPage,
  setSourceForAddCart,
  setMultiNextToFieldSkuWithDataStatus,
  setIsSetProductSelectedBeforeTheFirstTimePopup,
  setNoPreSelectBranch,
  setIsAddButtonDisable,
  setNextToFieldStatus,
  setProductArchorId,
  setReminderAlertStatus,
  resetReminderAlertStatus,
  resetGlobalAlertStatus,
  setIsApplyingDiscount,
  setIsAddingToCart,
  closeAllPopup,
  setIsPaymentInProgressPopupDisplay,
  setIsGlobalSelectedProductASetProduct,
  setIsSubProductReachMaxium,
  setItemTypeInSet,
  setIsSubProductCanAdd,
  setIsSubProductCanMinus,
  setLoadingScreenDisplay,
  setTopBarErrorMessage,
  setBasicProductDataForOtherComponents,
  setGlobalGetProductDatetime,
  setGlobalSelectedProductSkuCode,
  setGlobalSelectedProductSlugId,
  setIsSetProductPopupOpen,
  setIsMenuOpen,
  setIsCVVPopup,
  setIsBodyScrollbarDisplay,
  setIsCartPickupOpen,
  setIsPopupOpen,
  setIsSwitchOfLang,
  setIsClickedLangSwitch,
  setLoginRedirectUrl,
  setTransactionMode,
  setRegisterEmail,
  setIsAddCardValid,
  setIsProjectInit,
  setTransactionFilterDate,
  setCouponCount,
  setProductInCategory,
  setGlobalAlertStatus,
  setActiveIndexFaq,
} = generalState.actions;
export default generalState.reducer;
