import { LocaleKeysType } from "@/app/i18n";
import { ReactNode } from "react";

// ========== textarea ==========
export interface MessageProps {
  name: string;
  id: string;
  maxLen?: number;
  minLen?: number;
  rows?: number;
  cols?: number;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  lang?: LocaleKeysType;
  campaignForm?: boolean;
  onBlur?: (...params: any) => any;
}

// ========== input ==========
type InputType = "text" | "email" | "password" | "number" | "tel" | "checkbox" | "radio";

type InputAutoComplete = "on" | "off";

export interface InputProps {
  isEditing?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  labelFor: string;
  labelText: string;
  placeholder?: string;
  type: InputType;
  autoComplete: InputAutoComplete;
  required: boolean;
  name: string;
  id: string;
  path?: string;
  errorMsg?: string;
  successMsg?: string;
  disabled?: boolean;
  minLength: number;
  maxLength: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  storeValue?: string;
  innerRef?: React.RefObject<HTMLInputElement>;
  isValid?: boolean;
  value?: string;
  lang?: string;
  editValue?: string;
  defaultValue?: string;
  contactFormHeight?: boolean;
  pattern?: string;
  campaignForm?: boolean;
  firstNameBlur?: boolean;
  lastNameBlur?: boolean;
  emailBlur?: boolean;
  confirmEmailBlur?: boolean;
}

// ========== OTP input ==========
export interface OtpInputProps {
  value: string;
  valueLength: number;
  route: string;
  lang: LocaleKeysType;
  showOtpInput: boolean;
  onChange: (value: string) => void;
}

// ========== chip ==========
export interface ChipProps {
  title: string;
  path?: string;
  lang?: string;
  items: ChipItem[];
  labelFor?: string;
  name?: string;
  id?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onCheckType?: (val: string) => void;
  titleValue?: string;
  editValue?: string;
  setChipVal?: React.Dispatch<
    React.SetStateAction<{
      gender: string | undefined;
      preferredLan: string | undefined;
      hasChild: string | boolean | undefined;
    }>
  >;
  isSuccess?: boolean;
  titleNameIsChanged?: boolean;
  setTitleNameIsChanged?: React.Dispatch<React.SetStateAction<boolean>>;
  reset?: boolean;
}

export interface ChipItem {
  id: string;
  name?: string;
  label: string;
  labelTC?: string;
  icon?: ReactNode;
  tabIndex: number;
}

export interface ChipTitleProps {
  type: string;
  title: string;
  labelFor: string;
  labelTitle: string;
  name: string;
  id: string;
  items: ChipItem[];
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

// ========== chip - title ==========
export interface ChipProps {
  title: string;
  items: ChipItem[];
}

// ========== select ==========
export interface SelectProps {
  type?: string;
  labelFor: string;
  labelText?: string;
  defaultOption?: string;
  default?: string;
  name: string;
  id: string;
  items?: string[];
  itemsTC?: string[];
  itemsWithRollingYearEn?: string[];
  itemsWithRollingYearTc?: string[];
  disabled?: boolean;
  storeValue?: string;
}

// ========== checkbox ==========
export interface CheckboxInterface {
  labelFor: string;
  labelText: string | JSX.Element;
  labelButton?: string;
  labelButton2?: string;
  labelButton3?: string;
  type: string;
  name: string;
  id: string;
  lang?: string;
  checked?: boolean;
  required?: boolean;
  index?: number;
  path?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMembership?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickPrivacy?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  containerClass?: string;
}

// Not form related
export interface ProgressType {
  title: string[];
  progress: number;
  path?: string;
}

export interface RegistrationProps {
  labelText?: string;
  labelFor: string;
  id?: string;
  name: string;
  type: string;
  autoComplete: string;
  isRequired: boolean;
  placeHolder?: string;
  isEmailMatching?: boolean;
  isValidEmail?: boolean;
  isFirstNameValid?: boolean;
  isLastNameValid?: boolean;
  isMobileValid?: boolean;
  isMemberDigitValid?: boolean;
  maxLength?: number;
  path?: string;
  lang?: string;
  storeValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export enum GenderEnum {
  Male = 0,
  Female = 1,
  Undisclosed = 2,
}
