"use client";
import { ChangeEvent, useEffect, useState, FormEvent, MouseEvent, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useWindowSize } from "@/hook/useWindowSize";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { createPortal } from "react-dom";
import { useSendLoginRequestMutation, useSendRegistrationRequestMutation } from "@/redux/api/authApi";
import { ROUTES } from "@/constants/routes";
import { OtpInput } from "./OtpInput";
import { useDispatch } from "react-redux";
import { getCountryCodeWithMobile } from "@/redux/slice/registrationMobileSlice";
import { LocalStorageUtils, alertMessageMapperForRegistration } from "@/utils/clientUtils";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Chevron from "@/images/icons/Icon_C.png";
import Warning from "@/images/icons/Icon_warning@3x.png";

import WarningPopup from "../checkout/WarningPopup";

interface MobileRegex {
  [key: string]: RegExp;
}

interface MobileMaxLength {
  [key: string]: number;
}

const maxLengths: MobileMaxLength = {
  "852": 9,
  "853": 9,
  "86": 12,
};

export const GetOtpInput = ({
  lang,
  isFullScreenOverlayDisplayed,
}: {
  lang: LocaleKeysType;
  isFullScreenOverlayDisplayed?: boolean;
}) => {
  const countDownSecond = 59;
  const { translate: t } = useTranslation(lang);
  const pathname = usePathname();
  const isLoginPage = getRouteNameFromPathname(pathname).secondSlug === ROUTES.LOGIN;
  const isRegistrationPage = getRouteNameFromPathname(pathname).slugWithoutLang === ROUTES.REGISTRATION;
  const [countryCode, setCountryCode] = useState("852");
  const [mobile, setMobile] = useState("");

  // NOTE: Kindly change back to 59s
  const [countdownSec, setCountdownSec] = useState(countDownSecond);
  const [isCounting, setIsCounting] = useState(false);
  const [buttonText, setButtonText] = useState(t("registrationStep1.getOTP") as string);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [validMobile, setValidMobile] = useState(false);
  const [popupErrorMsg, setPopupErrorMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isOTPValidByIndex, setIsOTPValidByIndex] = useState<Record<number, boolean | undefined>>({
    0: undefined,
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
  });
  const [showModal, setShowModal] = useState(false);
  const formattedMobile = mobile.split(" ").join("");
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const query = useSearchParams();
  const countryCodeFromRedux = useSelector((state: RootState) => state.registrationMobile.code);
  const mobileFromRedux = useSelector((state: RootState) => state.registrationMobile.mobile);
  const [sendLoginRequest, { data: loginRequestResponse }] = useSendLoginRequestMutation();
  const [sendRegistrationRequest, { data: registerRequestResponse }] = useSendRegistrationRequestMutation();
  const [maxLength, setMaxLength] = useState(maxLengths["852"]);
  const numberOfAttempt = loginRequestResponse?.data?.numberOfAttempt;

  const mobileNumber = useMemo(() => {
    return query.get("mobileNumber") ?? "";
  }, [query]);

  useEffect(() => {
    setMobile(mobileNumber ?? "");
    if (mobileNumber?.length) {
      handleOnBlur(mobileNumber);
    }
  }, [mobileNumber]);

  const validateMobileNum = (countryCode: string, mobileNum: string) => {
    const numericValue = mobileNum.replace(/[^0-9]/g, "");
    const fullMobileNum = countryCode + numericValue;

    const mobileRex: MobileRegex = {
      "852": /^852\d{8}$/,
      "853": /^853\d{8}$/,
      "86": /^86\d{11}$/,
    };

    if (countryCode in mobileRex) {
      if (mobileRex[countryCode].test(fullMobileNum)) {
        setValidMobile(true);
        setErrorMsg("");
      }
    }

    return mobileRex[countryCode].test(fullMobileNum);
  };

  const handleOnBlur = (mobileNumber?: string) => {
    if (isFullScreenOverlayDisplayed) {
      return;
    }
    const isValidated = validateMobileNum(countryCode, mobileNumber ?? mobile);
    if (mobile === "" && !isValidated) {
      setValidMobile(false);
      setErrorMsg(t("alertModal.g51_next_to_field_content") ?? "");
    } else if (mobile !== "" && !isValidated) {
      setValidMobile(false);
      setErrorMsg(
        countryCode === "852" || countryCode === "853"
          ? t("registrationStep1.invalidDigitsForHKAndMacau") + ` +${countryCode} ` + t("registrationStep1.mobileNum")
          : t("registrationStep1.invalidDigitsForChina") + ` +${countryCode} ` + t("registrationStep1.mobileNum")
      );
    } else {
      setValidMobile(true);
      setErrorMsg("");
    }
  };

  const handleOnFocus = () => {
    setValidMobile(false);
    setErrorMsg("");
  };

  useEffect(() => {
    setMaxLength(maxLengths[countryCode]);
  }, [countryCode]);

  const handleCountryCodeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    setCountryCode(newCountryCode);
    validateMobileNum(newCountryCode, mobile);
  };

  const handleMobileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMobile = e.target.value;
    const numericValue = newMobile.replace(/[^0-9]/g, "");
    let formattedValue = numericValue;

    if (countryCode === "86") {
      formattedValue = numericValue.replace(/^(\d{2})(\d+)/, "$1 $2");
      setMobile(formattedValue);
    } else {
      formattedValue = numericValue.replace(/(\d{4})/g, "$1 ").trim();
      setMobile(formattedValue);
    }

    validateMobileNum(countryCode, newMobile);

    if (validMobile) {
      setValidMobile(true);
      setErrorMsg("");
    }
  };

  const handleGetOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // NOTE: Kindly change back to 59s
    setCountdownSec(countDownSecond);
    setIsCounting(true);

    if (isLoginPage) {
      sendLoginRequest({ countryCode, mobileNumber: formattedMobile });
      dispatch(getCountryCodeWithMobile({ code: countryCode, mobile: mobile }));
      setShowOtpInput(true);
      setIsCounting(true);
    }

    if (isRegistrationPage) {
      await sendRegistrationRequest({ countryCode, mobileNumber: formattedMobile });
      dispatch(getCountryCodeWithMobile({ code: countryCode, mobile: mobile }));
      LocalStorageUtils.post("MobileNumber", formattedMobile);
      setShowOtpInput(true);
      setIsCounting(true);
    }

    if (isRegistrationPage && mobile !== "" && mobile !== mobileFromRedux && countryCode !== countryCode) {
      await sendRegistrationRequest({ countryCode, mobileNumber: formattedMobile });
      dispatch(getCountryCodeWithMobile({ code: countryCode, mobile: mobile }));
      setShowOtpInput(true);
    }

    if (isLoginPage && mobile !== "" && mobile !== mobileFromRedux && countryCode !== countryCode) {
      sendLoginRequest({ countryCode, mobileNumber: formattedMobile });
      setShowOtpInput(true);
    }
  };
  useEffect(() => {
    const getErrorMessage = (returnCode: string) => {
      switch (returnCode) {
        case "40001":
          return t("otpErrorMsgs.sessionExpired");
        case "40017":
          return t("otpErrorMsgs.exceedFailedOtpLimit");
        case "40009":
          return t("otpErrorMsgs.exceedRequestLimit");
        case "40014":
          return t("otpErrorMsgs.exceedRequestFrequency");
        case "40016":
          return t("otpErrorMsgs.exceedSessionAttemptLimit");
        default:
          return "";
      }
    };

    if (loginRequestResponse && loginRequestResponse.statusCode === 200) {
      LocalStorageUtils.post("LoginSessionToken", loginRequestResponse.data?.sessionToken);
    } else if (loginRequestResponse && loginRequestResponse.statusCode === 400) {
      const errorMsg = loginRequestResponse?.returnCode && getErrorMessage(loginRequestResponse?.returnCode);

      if (errorMsg !== "") {
        setPopupErrorMsg(errorMsg ?? "");
        setShowOtpInput(false);
        setIsCounting(false);
        setShowModal(true);
      }
      if (loginRequestResponse.returnCode === "40005" || loginRequestResponse.returnCode === "40008") {
        setErrorMsg(t("alertModal.40005_member_next_to_field_content") ?? "");
      }
    }

    if (registerRequestResponse && registerRequestResponse.statusCode === 200) {
      LocalStorageUtils.post("RegisterSessionToken", registerRequestResponse.data?.sessionToken);
    } else if (registerRequestResponse && registerRequestResponse.statusCode === 400) {
      const errorMsg = registerRequestResponse?.returnCode && getErrorMessage(registerRequestResponse?.returnCode);

      if (registerRequestResponse.returnCode === "40022") {
        setErrorMsg(t("alertModal.40022_mobile_number_already_exists") ?? "");
      }

      if (errorMsg !== "") {
        setPopupErrorMsg(errorMsg ?? "");
        setShowOtpInput(false);
        setIsCounting(false);
        setShowModal(true);
      }
    }
  }, [loginRequestResponse, registerRequestResponse, t]);

  const onOTPInputBlur = ({ inputValue, inputIndex }: { inputValue: string; inputIndex: number }) => {
    const isValid = /\d+/gm.test(inputValue);
    const validByIndex = {
      ...isOTPValidByIndex,
      [inputIndex]: isValid,
    };
    setIsOTPValidByIndex(validByIndex);

    if (Object.values(validByIndex).filter(value => value === false).length > 0) {
      setErrorMsg(t("registrationStep1.otpErrorMessage") ?? "");
    } else {
      setErrorMsg("");
    }
  };

  const otpNextStepCallback = (code: string, numberOfAttempt?: number) => {
    setSuccessMsg("");
    if (code === "40010" && isRegistrationPage) {
      setErrorMsg(t("alertModal.r9_next_to_field_content") ?? "");
    } else if (
      (code === "40010" || code === "40016" || code === "40017") &&
      isLoginPage &&
      numberOfAttempt &&
      numberOfAttempt <= 2
    ) {
      alertMessageMapperForRegistration({
        alertCode: code,
        lang,
        translate: t,
        dispatch,
        extra: {
          numberOfAttempt,
        },
      });
    } else if (isLoginPage && code === "40010" && !numberOfAttempt) {
      alertMessageMapperForRegistration({
        alertCode: "40017",
        lang,
        translate: t,
        dispatch,
      });
    } else if (isLoginPage && code === "40010" && numberOfAttempt === 5) {
      alertMessageMapperForRegistration({
        alertCode: "40016",
        lang,
        translate: t,
        dispatch,
      });
    } else if (code === "40010") {
      setErrorMsg(t("alertModal.l6_next_to_field_content") ?? "");
    } else if (code === "40015" && isRegistrationPage) {
      setErrorMsg(t("alertModal.r10_next_to_field_content") ?? "");
    } else if (code === "40005") {
      setErrorMsg(t("alertModal.40005_otp_next_to_field_content") ?? "");
    } else {
      setErrorMsg("");
    }
  };

  useEffect(() => {
    if (loginRequestResponse?.statusCode === 200 || registerRequestResponse?.statusCode === 200) {
      if (showOtpInput) {
        setSuccessMsg(t("alertModal.r11_next_to_field_content") ?? "");
      }

      let alertCode = "";
      if (
        (loginRequestResponse?.data as any)?.numberOfAttempt === 3 ||
        (registerRequestResponse?.data as any)?.numberOfAttempt === 3
      ) {
        alertCode = "r13";
      } else if (
        (loginRequestResponse?.data as any)?.numberOfAttempt === 4 ||
        (registerRequestResponse?.data as any)?.numberOfAttempt === 4
      ) {
        alertCode = "r14";
      } else if (
        (loginRequestResponse?.data as any)?.numberOfAttempt === 5 ||
        (registerRequestResponse?.data as any)?.numberOfAttempt === 5
      ) {
        alertCode = "r15";
      }

      if (alertCode !== "") {
        alertMessageMapperForRegistration({
          alertCode,
          lang,
          translate: t,
          dispatch,
        });
      }
    } else if (
      loginRequestResponse?.returnCode === "10023" ||
      loginRequestResponse?.returnCode === "49999" ||
      registerRequestResponse?.returnCode === "10023" ||
      registerRequestResponse?.returnCode === "49999"
    ) {
      alertMessageMapperForRegistration({
        alertCode: "r12",
        translate: t,
        dispatch,
        lang,
        onLeftButtonClick: () => {
          // todo - r12
          return null;
        },
      });
    } else if (
      loginRequestResponse?.returnCode === "40020" ||
      loginRequestResponse?.returnCode === "40018" ||
      loginRequestResponse?.returnCode === "40028" ||
      loginRequestResponse?.returnCode === "40019" ||
      loginRequestResponse?.returnCode === "40026"
    ) {
      alertMessageMapperForRegistration({
        alertCode: loginRequestResponse?.returnCode,
        translate: t,
        dispatch,
        lang,
        onLeftButtonClick: () => {
          // todo - r12
          return null;
        },
      });
    } else if (
      registerRequestResponse?.returnCode === "40007" ||
      registerRequestResponse?.returnCode === "40009" ||
      loginRequestResponse?.returnCode === "40007"
    ) {
      // case R16 + L13
      alertMessageMapperForRegistration({
        alertCode: "40007",
        translate: t,
        dispatch,
        lang,
      });
    } else {
      setSuccessMsg("");
    }
  }, [registerRequestResponse, showOtpInput, loginRequestResponse]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (countryCode !== countryCodeFromRedux) {
      setIsCounting(false);
      setButtonText(t("registrationStep1.getOTP") as string);
      setShowOtpInput(false);
    }

    if (isCounting && countdownSec > 0) {
      interval = setInterval(() => {
        setCountdownSec(prevSec => prevSec - 1);
      }, 1000);
    } else if (countdownSec === 0) {
      setIsCounting(false);
      setButtonText(t("registrationStep1.resend") as string);
    }

    if ((isRegistrationPage && mobile !== mobileFromRedux) || countryCode !== countryCodeFromRedux) {
      setButtonText(t("registrationStep1.getOTP") as string);
      setShowOtpInput(false);
    }

    if ((isLoginPage && mobile !== mobileFromRedux) || countryCode !== countryCodeFromRedux) {
      setButtonText(t("registrationStep1.getOTP") as string);
      setShowOtpInput(false);
    }

    if (registerRequestResponse?.statusCode === 400 || loginRequestResponse?.statusCode === 400) {
      setIsCounting(false);
    }

    return () => clearInterval(interval);
  }, [
    isCounting,
    countdownSec,
    mobile,
    buttonText,
    mobileFromRedux,
    countryCode,
    countryCodeFromRedux,
    validMobile,
    isRegistrationPage,
    isLoginPage,
    t,
    errorMsg,
    registerRequestResponse?.statusCode,
    loginRequestResponse?.statusCode,
  ]);

  const handleToContact = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    localStorage.setItem("isLoginContactClicked", "true");
    if (window !== undefined) {
      window.location.href = `/${lang}/${ROUTES.CONTACT}`;
    }
  };

  return (
    <>
      <form className="otpInputFormContainer">
        <select
          onChange={handleCountryCodeChange}
          value={countryCode}
          name="mobile-country-code"
          id="mobile-country-code"
          aria-label="mobile-country-code"
          form="mobile-otp"
          style={{ backgroundImage: `url(${Chevron.src})` }}
          className="otpFormSelect"
        >
          <option value="852">+852</option>
          <option value="853">+853</option>
          <option value="86">+86</option>
        </select>
        <input
          onFocus={handleOnFocus}
          onBlur={() => handleOnBlur()}
          type="tel"
          id="mobile"
          maxLength={maxLength}
          placeholder={
            width < 1536
              ? (t("registrationStep1.enterMobileNumForSmallScreen") as string)
              : (t("registrationStep1.enterMobileNumForBigScreen") as string)
          }
          onChange={handleMobileChange}
          value={mobile}
          className={`otpFormInput ${mobile && validMobile === true ? "activate" : "deactivate"}`}
        />
        <button
          aria-label="get-tp"
          disabled={mobile === "" || isCounting === true || validMobile === false ? true : false}
          onClick={handleGetOtpSubmit}
          className={`otpFormBtn ${mobile && validMobile === true ? "otpFormBtnActivate" : "otpFormBtnDeactivate"}  ${
            isCounting ? "otpFormBtnDisable" : ""
          } `}
        >
          {isCounting && mobile !== ""
            ? t("registrationStep1.resend") + `(${countdownSec}` + `${t("registrationStep1.seconds")})`
            : buttonText}
        </button>
      </form>
      {errorMsg !== "" && (
        <div className="otpFormErrorMsgContainer pl-[15px]">
          <div>
            <Image
              src={Warning}
              width={30}
              height={30}
              alt="Invalid mobile number, please try again"
              className="otpFormErrorMsg h-auto w-[20px] self-center "
            />
          </div>
          <div>
            <span className="error-msg flex text-start leading-[20px]">{errorMsg}</span>
          </div>
        </div>
      )}
      {(!errorMsg || !errorMsg?.length || errorMsg === "") && successMsg !== "" && (
        <div className="otpFormErrorMsgContainer pl-[15px]">
          <span className="success-msg">{successMsg}</span>
        </div>
      )}
      {isLoginPage && (
        <span className="contactUs">
          {t("login.contact")}
          <button onClick={handleToContact}>{t("login.contactUs")}</button>
        </span>
      )}

      {(loginRequestResponse?.statusCode === 200 && showOtpInput) ||
      (registerRequestResponse?.statusCode === 200 && showOtpInput) ? (
        <OtpInput
          callback={otpNextStepCallback}
          showOtpInput={showOtpInput}
          lang={lang}
          numOfAttempt={numberOfAttempt}
          prefix={loginRequestResponse?.data?.prefix || registerRequestResponse?.data?.prefix}
          onOTPInputBlur={onOTPInputBlur}
          isOTPValidByIndex={isOTPValidByIndex}
        />
      ) : null}

      {showModal &&
        createPortal(
          <WarningPopup
            goBackToPrePage={true}
            lang={lang}
            buttonGroup
            messages={[popupErrorMsg]}
            handler={() => setShowModal(!showModal)}
          />,
          document.body
        )}
    </>
  );
};
