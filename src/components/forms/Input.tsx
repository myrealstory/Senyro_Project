"use client";
import { useState } from "react";
import { renderCreditCardImage } from "@/components/auth/authUtils";
import { RenderIcons } from "./RenderIcons";
import { ROUTES } from "@/constants";
import { InputProps } from "@/types/form/formTypes";
import Image from "next/image";
import Tooltip from "@/images/icons/Icon_tooltip.png";
import Mask from "@/components/Mask";
import CreditCardCvvPopUp from "@/components/member/CreditCardCvvPopUp";
import "@/style/component/formComponents.scss";
import { LocaleKeysType } from "@/app/i18n";

const RenderTooltip = ({ lang }: { lang: LocaleKeysType }) => {
  const [triggerTips, setTriggerTips] = useState(false);

  const handleMouseEnter = () => {
    setTriggerTips(true);
  };

  const handleMouseLeave = () => {
    setTriggerTips(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {triggerTips && (
        <Mask>
          <CreditCardCvvPopUp
            isOpen={triggerTips}
            onMouseLeave={handleMouseLeave}
            onClose={handleMouseLeave}
            lang={lang}
          />
        </Mask>
      )}

      <button className="inputCreditCardCvvPopup">
        <Image src={Tooltip} width={0} height={0} alt="Tooltip" />
      </button>
    </div>
  );
};

export const Input = ({
  labelFor,
  labelText,
  placeholder,
  type,
  lang,
  path,
  autoComplete,
  required,
  name,
  id,
  errorMsg,
  minLength,
  maxLength,
  onChange,
  onKeyDown,
  value,
  isValid,
  innerRef,
  editValue,
  defaultValue,
  contactFormHeight,
  onBlur,
  onFocus,
  firstNameBlur,
  lastNameBlur,
  emailBlur,
  confirmEmailBlur,
  isEditing,
}: InputProps) => {
  const fieldIds = [
    "firstName",
    "lastName",
    "email",
    "confirmEmail",
    "mobile",
    "mobileForContact",
    "cardHolder",
    "cardNumber",
    "expiryMonth",
    "expiryYear",
    "cvv",
    "memberNumber",
  ];

  const renderIconsConditionally = (fieldId: string, index?: number) => {
    if ((id === fieldId && value && value.length > 0) || (id === fieldId && editValue && editValue.length > 0)) {
      return (
        <RenderIcons
          key={index}
          isValid={isValid !== undefined && isValid}
          isCreditCardNumber={id === "cardNumber" ? true : false}
        />
      );
    }
  };

  const inputCommonStyle =
    "relative w-full rounded-full border-primaryGold placeholder:tracking-tighter placeholder:text-[16px]  px-[12px] py-4 pl-[20px] font-semibold placeholder-primaryGold placeholder-opacity-40 placeholder:pl-[5px] placeholder:font-medium ";
  const focusRing =
    "focus:border-primaryGold focus:bg-transparent focus:outline-none focus:ring-1 focus:ring-primaryGold";
  const errorRing = "focus:border-primaryPurple focus:outline-none focus:ring-1 focus:ring-primaryPurple ";
  const defaultValueStyle = "bg-primaryGold/20 text-primaryGold safariTextColor";
  const lastNameLabelStyle = "invisible mt-[-9px] lg:mt-0";
  const expiryYearLabelStyle = "invisible mt-0";
  const mobileForContactStyle = "relative flex flex-wrap items-center justify-start gap-1";

  return (
    <div className="inputContainer">
      <label
        htmlFor={labelFor}
        className={`text-16 font-semibold leading-5 lg:text-primaryGold xl:text-17  ${
          id === "lastName" && lastNameLabelStyle
        } ${id === "expiryYear" && expiryYearLabelStyle} `}
      >
        {labelText}
      </label>
      <div
        className={`${path?.includes("contact") ? mobileForContactStyle : "relative"} ${
          path?.includes("campaign") && "w-full"
        }`}
      >
        <div className={`${id === "mobileForContact" ? "absolute left-5  top-[15px]  z-10" : "hidden"}`}>
          <p className="font-semibold">+852</p>
        </div>
        <div className="relative w-full">
          <input
            onFocus={onFocus}
            onBlur={onBlur}
            id={id}
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            type={type}
            disabled={
              (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "mobile" && editValue !== "") ||
              (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "firstName" && editValue !== "") ||
              (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "lastName" && editValue !== "") ||
              (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "email" && editValue !== "") ||
              (id === "mobile" && value !== "") ||
              (id === "mobile" && editValue !== "")
                ? true
                : false
            }
            autoComplete={autoComplete}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            onChange={onChange}
            onKeyDown={onKeyDown}
            ref={innerRef}
            value={value || editValue || ""}
            className={`inputPlaceholder ${inputCommonStyle}
        ${value && value.length > 0 && isValid === false ? errorRing : focusRing}
        ${id === "mobileForContact" && "pl-[4.5rem]"}
        ${contactFormHeight && "h-[50px]"}
        ${
          id === "mobile" ||
          (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "firstName" && editValue !== "") ||
          (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "lastName" && editValue !== "") ||
          (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "email" && editValue !== "")
            ? // (path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` && id === "mobile" && editValue !== "")
              defaultValueStyle
            : "bg-transparent"
        }
        `}
          />
          {fieldIds.map((fieldId, index) => renderIconsConditionally(fieldId, index))}
        </div>

        {!isValid && (value || isEditing) && (
          <div className="pl-5 pr-1">
            <span className="h-fit text-[12px] font-semibold leading-3 text-primaryPurple">{errorMsg}</span>
          </div>
        )}
        {firstNameBlur && value === "" && (
          <span className="h-fit pl-[20px]  text-[12px]  font-semibold leading-3 text-primaryPurple">{errorMsg}</span>
        )}
        {lastNameBlur && value === "" && (
          <span className="h-fit pl-[20px]  text-[12px]  font-semibold leading-3 text-primaryPurple">{errorMsg}</span>
        )}
        {emailBlur && value === "" && (
          <span className="h-fit pl-[20px]  text-[12px]  font-semibold leading-3 text-primaryPurple">{errorMsg}</span>
        )}
        {confirmEmailBlur && value === "" && (
          <span className="h-fit pl-[20px]  text-[12px]  font-semibold leading-3 text-primaryPurple">{errorMsg}</span>
        )}
      </div>

      {id === "cardNumber" && isValid && renderCreditCardImage(value as string)}
      {id === "cvv" && value !== undefined && value.length === 0 && <RenderTooltip lang={lang as LocaleKeysType} />}
    </div>
  );
};
