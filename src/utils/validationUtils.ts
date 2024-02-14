import { CreditCardType } from "@/types/checkout/checkoutTypes";
import { TFunction } from "i18next";

export const validateEmail = (email: string) => {
  const emailRegex = /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email) === true) {
    return true;
  }
  if (emailRegex.test(email) === false) {
    return false;
  }
};

export const checkNameWithEngChar = (firstName: string, lastName: string) => {
  const nameRegex = /^[a-zA-Z]+$/;
  if (nameRegex.test(firstName) === true && nameRegex.test(lastName) === true) {
    return true;
  }
  if (nameRegex.test(firstName) === false && nameRegex.test(lastName) === false) {
    return false;
  }
};

export const checkIsEmailMatched = (email: string, confirmEmail: string) => {
  if (email !== confirmEmail) {
    return false;
  } else {
    return true;
  }
};

// check if CreditCardPaymentDetial filled in
export function isCreditCardPaymentDetailFilled(cardDetails: CreditCardType) {
  if (!Object.entries(cardDetails).every(e => e[1] != "" && e[1] != "00/00")) return false;
  if ((cardDetails?.cardNumber?.replace(/ /g, "")?.length || 0) < 14) return false; // might be a 15 digits card number
  if (cardDetails?.expiryMonth?.includes("00")) return false;
  if (cardDetails?.expiryYear?.includes("00")) return false;
  if ((cardDetails?.cvv?.length || 0) < 3) return false;
  return true;
}

// Render error message based on return code
export const getErrorMessage = (returnCode: string, t: TFunction<string, string, string>) => {
  switch (returnCode) {
    case "40001":
      return t("otpErrorMsgs.sessionExpired");
    case "40005":
      return t("otpErrorMsgs.invalidLoginInformation");
    case "40007" || "40017":
      return t("otpErrorMsgs.exceedFailedOtpLimit");
    case "40008":
      return t("otpErrorMsgs.invalidLoginInformation");
    case "40009":
      return t("otpErrorMsgs.exceedRequestLimit");
    case "40010" || "40015":
      return t("otpErrorMsgs.invalidSmsMessageVerificationSession");
    case "40011" || "40021":
      return t("otpErrorMsgs.duplicateEmailAddress");
    case "40012" || "40006":
      return t("otpErrorMsgs.duplicateMobileNumber");
    case "40013":
      return t("otpErrorMsgs.invalidReceiptDate");
    case "40014":
      return t("otpErrorMsgs.exceedRequestFrequency");
    case "40016":
      return t("otpErrorMsgs.exceedSessionAttemptLimit");
    case "40017":
      return t("otpErrorMsgs.duplicateMobileNumber");
    case "40018":
      return t("otpErrorMsgs.pendingForApproval");
    case "40019":
      return t("otpErrorMsgs.registrationIsRejected");
    case "40020":
      return t("otpErrorMsgs.pendingForEmailVerification");
    case "32007":
      return t("otpErrorMsgs.invalidRegistrationToken");
    default:
      return "An error occurred";
  }
};
