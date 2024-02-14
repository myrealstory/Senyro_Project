import { CreditCardFormType } from "@/types/checkout/checkoutTypes";
import { InputProps } from "@/types/form/formTypes";

import { createRef } from "react";

export const cardholderName: InputProps = {
  labelFor: "cardHolder",
  labelText: "Cardholder name*",
  placeholder: "Cardholder Name",
  type: "text",
  autoComplete: "off",
  required: true,
  name: "cardHolder",
  id: "cardHolder",
  errorMsg: "Invalid cardholder name",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 25,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const cardNumber: InputProps = {
  labelFor: "cardNumber",
  labelText: "Credit Card number*",
  placeholder: "Card Number",
  type: "tel",
  autoComplete: "off",
  required: true,
  name: "cardNumber",
  id: "cardNumber",
  errorMsg: "Invalid card number",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 16,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
  pattern: "\d*",
};

export const expiryMonth: InputProps = {
  labelFor: "expiryMonth",
  labelText: "Expiry date*",
  placeholder: "MM",
  type: "text",
  autoComplete: "off",
  required: true,
  name: "expiryMonth",
  id: "expiryMonth",
  errorMsg: "Invalid expiry date",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 2,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const expiryYear: InputProps = {
  labelFor: "expiryYear",
  labelText: "Expiry date*",
  placeholder: "YY",
  type: "text",
  autoComplete: "off",
  required: true,
  name: "expiryYear",
  id: "expiryYear",
  errorMsg: "Invalid expiry date",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 2,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const CVV: InputProps = {
  labelFor: "cvv",
  labelText: "CVV*",
  placeholder: "CVV",
  type: "text",
  autoComplete: "off",
  required: true,
  name: "cvv",
  id: "cvv",
  errorMsg: "Invalid CVV",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 4,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const CreditCardFormFormat: CreditCardFormType[] = [
  {
    id: 0,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1691721729/visa_Master_ns29c6.png",
  },
  {
    id: 1,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1691721787/Icon_AE_3x_iy05vs.png",
  },
  {
    id: 2,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1691721825/Icon_AlipayHK_3x_tewmtn.png",
  },
  {
    id: 4,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1695542089/Wechat_Pay_uynekg.png",
  },
  {
    id: 5,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1691721773/Icon_PayMe_3x_k8efeh.png",
  },
  {
    id: 6,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1691721743/Icon_Octopus_3x_hqdwhb.png",
  },
  {
    id: 7,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1695542095/Icon_ApplePay_3x_jsszmc.png",
  },
  {
    id: 8,
    type: "text",
    imgUrl: "https://res.cloudinary.com/dxbcg5dvk/image/upload/v1695542083/Icon_Google_Pay_3x_co6jbw.png",
  },
];
