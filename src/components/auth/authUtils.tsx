import Image from "next/image";
import Credit from "@/images/icons/Icon_credit-card-gold.png";
import Visa from "@/images/icons/Icon_VISA@3x.png";
import MasterCard from "@/images/icons/Icon_Master-font@3x.png";
import AmericanExpress from "@/images/icons/Icon_AE@3x.png";
import { Dispatch, SetStateAction } from "react";

export const focusToNextInput = (target: HTMLInputElement) => {
  const nextEle = target.nextElementSibling as HTMLInputElement | null;
  if (nextEle) nextEle.focus();
}; //used

export const focusToPreInput = (target: HTMLInputElement) => {
  const preEle = target.previousElementSibling as HTMLInputElement | null;
  if (preEle) preEle.focus();
}; //used

export const getCardType = (cardNumber: string): string => {
  const firstFourDigits = cardNumber.replace(/\s/g, "").replace(/-/g, "").slice(0, 4);

  if (firstFourDigits.startsWith("4")) return "VISA";

  const firstTwoDigits = parseInt(firstFourDigits.slice(0, 2), 10);
  const firstFourDigitsInt = parseInt(firstFourDigits, 10);

  if ((firstTwoDigits >= 51 && firstTwoDigits <= 55) || (firstFourDigitsInt >= 2221 && firstFourDigitsInt <= 2720))
    return "MPGS";

  if (["34", "37"].includes(firstFourDigits.slice(0, 2))) return "AmericaExpressx";

  return "JCB";
};

export const renderCreditCardImage = (value: string) => {
  const cardType = getCardType(value);

  if (value === "") {
    return (
      // eslint-disable-next-line react/jsx-no-undef
      <Image src={Credit} width={0} height={0} alt="Credit card" className=" creditCardImage w-[23px] opacity-50" />
    );
  }
  if (cardType === "VISA") {
    return <Image src={Visa} width={0} height={0} alt="Visa" className=" creditCardImage w-[45px]" />;
  }
  if (cardType === "MPGS") {
    return <Image src={MasterCard} width={0} height={0} alt="MasterCard" className="creditCardImage w-[40px]" />;
  }
  if (cardType === "AmericaExpressx") {
    return (
      <Image src={AmericanExpress} width={0} height={0} alt="American Express" className="creditCardImage w-[30px]" />
    );
  }
};

export const getYears = (startYear: number, endYear: number): number[] => {
  const years: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

export const validateEmail = (email: string, setIsValidEmail: Dispatch<SetStateAction<boolean>>) => {
  const emailRegex = /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(email);

  setIsValidEmail(isValid);
  return isValid;
};

export const validateMobile = (mobile: string, setIsMobileValid: Dispatch<SetStateAction<boolean>>) => {
  const mobileRegex = /^(5|6|9)\d{7}$/;
  if (mobileRegex.test(mobile) === true) {
    setIsMobileValid(true);
    return true;
  }

  if (mobileRegex.test(mobile) === false) {
    setIsMobileValid(false);
    return false;
  }
};

export const checkNameWithEngOrChineseChar = (
  cha: string,
  setFirstIsNameValid: Dispatch<SetStateAction<boolean>>,
  setLastIsNameValid: Dispatch<SetStateAction<boolean>>
) => {
  const nameRegex = /^[\u4E00-\u9FFF\u3400-\u4DBF\u2000-\u206F\u0020\u0041-\u005A\u0061-\u007A]*$/u;

  if (nameRegex.test(cha) === true) {
    setFirstIsNameValid(true);
    setLastIsNameValid(true);
    return true;
  } else {
    setFirstIsNameValid(false);
    setLastIsNameValid(false);
    return false;
  }
};

export const checkIsEmailMatched = (
  email: string,
  confirmEmail: string,
  setIsEmailMatching: Dispatch<SetStateAction<boolean>>
) => {
  if (email !== confirmEmail) {
    setIsEmailMatching(false);
    return false;
  } else {
    setIsEmailMatching(true);
    return true;
  }
};
