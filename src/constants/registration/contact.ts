import { InputProps } from "@/types/form/formTypes";
import { ChangeEvent, KeyboardEvent, createRef } from "react";

export const memberNumber: InputProps = {
  labelFor: "memberNumber",
  labelText: "Member Number",
  placeholder: "Member Number",
  type: "text",
  autoComplete: "off",
  required: false,
  name: "memberNumber",
  id: "memberNumber",
  path: "",
  errorMsg: "",
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
  lang: "",
};
