import { StaticImageData } from "next/image";

import { PAYMENT_METHOD } from "@/constants/checkout/payment";

export type FormSubtitleType = {
  text: string;
  containerClasses?: string;
}
export interface CreditCardType {
  cardNumber: string;
  cardHolder: string;
  expiryYear: string;
  expiryMonth: string;
  cvv: string;
}

export type CreditCardFormType = {
  id: number;
  type: string;
  imgUrl: string;
}

export interface PaymentInputType {
  type?: boolean;
  maxLength?: number;
}

export interface FormPaymentType {
  imgUrl: StaticImageData;
}

export type ContactInfoType = {
  firstName: string;
  lastName: string;
  countryCode: string;
  mobileNumber: string;
  email: string;
};

export type CardDetailType = {
  cardHolder?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  saveCardEnabled?: boolean;
};

export type MobileRegionCodeType = "852" | "853" | "86";

export type OrderCheckoutType = {
  // contact info
  firstName: string;
  lastName: string;
  countryCode: MobileRegionCodeType;
  mobileNumber: string;
  email: string;

  selectedPaymentMethodId: PAYMENT_METHOD;
  agree: boolean;

  // crdit card
  cardHolder: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveCardEnabled: boolean;

  // saved card
  savedCardCVV?: string;

  // if its mobile payment
  // merchant info
  merchantName: string;
  merchantId: string;
  gateway: string; // google pay
  gatewayMerchantId: string; // google pay

  // optional info
  memberPointRedeem?: number;
  memberCouponId?: string;
  promoCode?: string;
  savedCardId?: string;
  saveCardPaymentMethodId?: string;
  optin?: boolean;
};

export type ErrorInfoType = {
  hasError: boolean;
  isEditing: boolean;
  message?: string;
};

export type OrderCheckoutFormErrorType = Record<keyof OrderCheckoutType, ErrorInfoType>;
