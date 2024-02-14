import { PAYMENT_METHOD } from "@/constants/checkout/payment";
// import { getCreditCardType } from "@/utils/commonUtils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ErrorInfoType, OrderCheckoutFormErrorType, OrderCheckoutType } from "@/types/checkout/checkoutTypes";
import { isSelectedApplePay, isSelectedCreditCard, isSelectedGooglePay, isSelectedSavedCard } from "@/utils/clientUtils";

export const CreditCardPaymentMethodIds = [PAYMENT_METHOD.VISA_MASTER, PAYMENT_METHOD.AMEX];
export const ApplepayPaymentMethodIds = [
  PAYMENT_METHOD.APPLE_PAY,
  PAYMENT_METHOD.APPLE_PAY_VM,
  PAYMENT_METHOD.APPLE_PAY_AMEX,
];
export const GooglepayPaymentMethodIds = [
  PAYMENT_METHOD.GOOGLE_PAY,
  PAYMENT_METHOD.GOOGLE_PAY_VM,
  PAYMENT_METHOD.GOOGLE_PAY_AMEX,
];

export const SavedCardIds = [PAYMENT_METHOD.TOKENIZATION_VISA_MASTER, PAYMENT_METHOD.TOKENIZATION_AMEX];

const optionalState = [
  "memberPointRedeem",
  "memberCouponId",
  "promoCode",
  "savedCardId",
  "saveCardPaymentMethodId", // credit card payment then save card may use different payment method id => used to replace selectedPaymentMethodId if user tick the box
  "optin",
];

const mandatoryState = ["firstName", "lastName", "mobileNumber", "email", "selectedPaymentMethodId", "agree"];

export const checkoutState: OrderCheckoutType = {
  firstName: "",
  lastName: "",
  countryCode: "852",
  mobileNumber: "",
  email: "",
  cardHolder: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  savedCardCVV: "",
  saveCardEnabled: false,
  selectedPaymentMethodId: PAYMENT_METHOD.INIT,
  merchantName: "",
  merchantId: "",
  gateway: "",
  gatewayMerchantId: "",
  agree: false,
  optin: true, // default -> true
};

export const initialCheckoutState: OrderCheckoutType & { error: OrderCheckoutFormErrorType } = {
  ...checkoutState,
  error: Object.assign(
    Object.keys(checkoutState).reduce((prev, curr) => {
      if (optionalState.includes(curr)) {
        return prev;
      }

      return {
        ...prev,
        [curr]: {
          hasError: false,
          isEditing: false,
        },
      };
    }, {} as OrderCheckoutFormErrorType),

    ...mandatoryState.map(key => ({
      [key]: {
        hasError: true,
        isEditing: false,
      },
    }))
  ),
};

const orderCheckoutSliceReducer = createSlice({
  name: "orderCheckoutSliceReducer",
  initialState: initialCheckoutState,
  reducers: {
    setSavedCardFormData: (state, action: PayloadAction<{savedCardId?: string; savedCardCVV?: string;}>) => {
      state.savedCardId = action.payload.savedCardId ?? state.savedCardId;
      state.savedCardCVV = action.payload.savedCardCVV ?? state.savedCardCVV;
    },
    setCheckoutFormData: (
      state,
      action: PayloadAction<{
        [T in keyof OrderCheckoutType]?: OrderCheckoutType[T];
      }>
    ) => {
      // contact info
      state.firstName = action.payload.firstName ?? state.firstName;
      state.lastName = action.payload.lastName ?? state.lastName;
      state.countryCode = action.payload.countryCode ?? state.countryCode;
      state.mobileNumber = action.payload.mobileNumber ?? state.mobileNumber;
      state.email = action.payload.email ?? state.email;

      state.selectedPaymentMethodId = action.payload.selectedPaymentMethodId ?? state.selectedPaymentMethodId;
      state.agree = action.payload.agree ?? state.agree;

      // crdit card
      state.cardHolder = action.payload.cardHolder ?? state.cardHolder;
      state.cardNumber = action.payload.cardNumber ?? state.cardNumber;
      state.expiryMonth = action.payload.expiryMonth ?? state.expiryMonth;
      state.expiryYear = action.payload.expiryYear ?? state.expiryYear;
      state.cvv = action.payload.cvv ?? state.cvv;
      state.saveCardEnabled = action.payload.saveCardEnabled ?? state.saveCardEnabled;

      // merchant info
      state.merchantName = action.payload.merchantName ?? state.merchantName;
      state.merchantId = action.payload.merchantId ?? state.merchantId;
      state.gateway = action.payload.gateway ?? state.gateway; // google pay
      state.gatewayMerchantId = action.payload.gatewayMerchantId ?? state.gatewayMerchantId; // google pay

      // optional
      state.memberPointRedeem = action.payload.memberPointRedeem ?? state.memberPointRedeem;
      state.memberCouponId = action.payload.memberCouponId ?? state.memberCouponId;
      state.promoCode = action.payload.promoCode ?? state.promoCode;
      
      state.saveCardPaymentMethodId = action.payload.saveCardPaymentMethodId ?? state.saveCardPaymentMethodId; // credit card payment then save card may use different payment method id => used to replace selectedPaymentMethodId if user tick the box
      state.optin = action.payload.optin ?? state.optin;
    },
    setCheckoutFormErrorData: (
      state,
      action: PayloadAction<{
        key: keyof OrderCheckoutFormErrorType;
        hasError: ErrorInfoType["hasError"];
        message?: ErrorInfoType["message"];
        isSkipPaymentChecking?: boolean;
      }>
    ) => {
      state.error[action.payload.key] = {
        hasError: action.payload.hasError,
        isEditing: true,
        message: action.payload.message,
      };

      const paymentKey: {
        mobilePayment: (keyof OrderCheckoutFormErrorType)[];
        creditCardPayment: (keyof OrderCheckoutFormErrorType)[];
        savedCardPayment: (keyof OrderCheckoutFormErrorType)[];
      } = {
        mobilePayment: ["merchantName", "merchantId", "gateway", "gatewayMerchantId"],
        creditCardPayment: ["cardHolder", "cardNumber", "expiryMonth", "expiryYear", "cvv", "saveCardEnabled"],
        savedCardPayment: ["savedCardCVV"],
      };

      if (action.payload.isSkipPaymentChecking) {
        Object.values(paymentKey).forEach(value => {
          value.forEach(field => {
            state.error[field] = {
              hasError: false,
              isEditing: state.error[field].isEditing,
            };
          });
        });
      } else {
        // update payment error status base on the "selectedPaymentMethodId"

        let targetKeys: string[] = [];
        let otherKeys: string[] = [...paymentKey.mobilePayment, ...paymentKey.creditCardPayment, ...paymentKey.savedCardPayment];
        switch (true) {
          case isSelectedApplePay(state.selectedPaymentMethodId):
            targetKeys = [paymentKey.mobilePayment[0], paymentKey.mobilePayment[0]];
            break;
          case isSelectedGooglePay(state.selectedPaymentMethodId):
            targetKeys = paymentKey.mobilePayment;
            break;
          case isSelectedCreditCard(state.selectedPaymentMethodId):
            targetKeys = paymentKey.creditCardPayment;
            break;
          case isSelectedSavedCard(state.selectedPaymentMethodId):
            targetKeys = paymentKey.savedCardPayment;
            break;
          default:
            break;
        }
        otherKeys = otherKeys.filter(key => !targetKeys.includes(key));

        (targetKeys as (keyof OrderCheckoutFormErrorType)[]).forEach(key => {
          state.error[key] = {
            hasError:
              key === action.payload.key
                ? action.payload.hasError
                : state.error[key].hasError || !String(state[key])?.length,
            isEditing: key === action.payload.key ? true : state.error[key].isEditing,
            message: key === action.payload.key ? action.payload.message : state.error[key].message,
          };
        });

        (otherKeys as (keyof OrderCheckoutFormErrorType)[]).forEach(key => {
          state.error[key] = {
            hasError: false,
            isEditing: false,
            message: "",
          };
        });
      }
    },
  },
});

export const useOrderCheckoutSlice = () => orderCheckoutSliceReducer.actions;
export default orderCheckoutSliceReducer.reducer;

export const {
  setCheckoutFormErrorData
} = orderCheckoutSliceReducer.actions;
