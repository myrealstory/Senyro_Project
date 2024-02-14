import { InputProps } from "@/types/form/formTypes";
import { ChangeEvent, createRef, KeyboardEvent } from "react";

export const firstName: InputProps = {
  labelFor: "firstName",
  labelText: "Your Name*",
  placeholder: "First Name",
  type: "text",
  autoComplete: "on",
  required: true,
  name: "firstName",
  id: "firstName",
  errorMsg: "Incorrect format",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 25,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const lastName: InputProps = {
  labelFor: "lastName",
  labelText: "Your Name*",
  placeholder: "Last Name",
  type: "text",
  autoComplete: "on",
  required: true,
  name: "lastName",
  id: "lastName",
  errorMsg: "Incorrect format",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 25,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const email: InputProps = {
  labelFor: "email",
  labelText: "Email*",
  placeholder: "Your Email",
  type: "email",
  autoComplete: "on",
  required: true,
  name: "email",
  id: "email",
  errorMsg: "Incorrect format",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 100,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const confirmMail: InputProps = {
  labelFor: "confirmEmail",
  labelText: "Confirm Email*",
  placeholder: "Confirm Your Email",
  type: "email",
  autoComplete: "on",
  required: true,
  name: "confirmEmail",
  id: "confirmEmail",
  errorMsg: "Email is not matched",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 100,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const mobile: InputProps = {
  labelFor: "mobile",
  labelText: "Mobile Number",
  placeholder: "Your Mobile",
  type: "tel",
  autoComplete: "on",
  required: true,
  name: "mobile",
  id: "mobile",
  errorMsg: "",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 100,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const mobileForContact: InputProps = {
  labelFor: "mobile",
  labelText: "Mobile Number*",
  placeholder: "Only HK Number is allowed",
  type: "tel",
  autoComplete: "on",
  required: true,
  name: "mobile",
  id: "mobileForContact",
  errorMsg: "",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 100,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const orderReceipt: InputProps = {
  labelFor: "orderReceipt",
  labelText: "Details of Enquiry / Feedback",
  placeholder: "Order / Receipt Number(Optional)",
  type: "text",
  autoComplete: "off",
  required: false,
  name: "orderReceipt",
  id: "orderReceipt",
  errorMsg: "",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 100,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const budget: InputProps = {
  labelFor: "budget",
  labelText: "Approximate Budget (HKD)",
  placeholder: "Budget (HKD)",
  type: "number",
  autoComplete: "off",
  required: false,
  name: "budget",
  id: "budget",
  errorMsg: "",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 10000,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};

export const company: InputProps = {
  labelFor: "company",
  labelText: "Company*",
  placeholder: "Company Name",
  type: "text",
  autoComplete: "on",
  required: true,
  name: "company",
  id: "company",
  errorMsg: "",
  successMsg: "",
  disabled: false,
  minLength: 0,
  maxLength: 100,
  onChange: (e: ChangeEvent<HTMLInputElement>) => {
    e;
  },
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
    e;
  },
  storeValue: "",
  innerRef: createRef<HTMLInputElement>(),
  isValid: false,
  value: "",
  path: "",
  lang: "",
};
