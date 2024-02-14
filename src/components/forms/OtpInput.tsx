"use client";

import WarningPopup from "../checkout/WarningPopup";
import { useRef, ChangeEvent, KeyboardEvent, FocusEvent, FormEvent, useState, useEffect, useMemo } from "react";
import { getCookie } from "cookies-next";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { focusToNextInput, focusToPreInput } from "@/components/auth/authUtils";
import { useSendLoginOtpVerifyMutation, useSendRegistrationOTPVerifyMutation } from "@/redux/api/authApi";
import { LocaleKeysType } from "@/app/i18n";
import { CookiesKey } from "@/constants/cookies";
import { ROUTES } from "@/constants/routes";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { useWindowSize } from "@/hook/useWindowSize";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setGlobalAlertStatus, setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import { LoginOTPResponseType } from "@/types/api/apiTypes";
import "@/style/fonts/font.css";

const OTPCount = 6;
export const OtpInput = ({
  callback,
  lang,
  numOfAttempt,
  prefix,
  showOtpInput,
  onOTPInputBlur,
  isOTPValidByIndex,
}: {
  callback: (...params: any) => any;
  lang: LocaleKeysType;
  numOfAttempt?: number;
  prefix?: string;
  showOtpInput?: boolean;
  onOTPInputBlur?: (...params: any) => any;
  isOTPValidByIndex?: Record<number, boolean | undefined>;
}) => {
  const pathname = usePathname();
  const query = useSearchParams();
  const isLoginPage = getRouteNameFromPathname(pathname).secondSlug === ROUTES.LOGIN;
  const isRegistrationPage = getRouteNameFromPathname(pathname).slugWithoutLang === ROUTES.REGISTRATION;
  const redirectUrl = useSelector((state: RootState) => state.generalState.loginRedirectUrl);
  const inputRefs = useRef<HTMLInputElement[]>(
    new Array(OTPCount).fill(null).map(() => document.createElement("input"))
  );
  const [OTPValue, setOTPValue] = useState("");
  const { width } = useWindowSize();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { translate: t } = useTranslation(lang);
  const dispatch = useDispatch();
  const [sendRegistrationOTPVerify] = useSendRegistrationOTPVerifyMutation();
  const [sendLoginOtpVerify] = useSendLoginOtpVerifyMutation();

  const isOTPValid = useMemo(() => {
    if (!isOTPValidByIndex || OTPValue?.length !== OTPCount) {
      return false;
    }
    return Object.values(isOTPValidByIndex).filter(otp => otp === true).length === OTPCount;
  }, [isOTPValidByIndex, OTPValue]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPreInput(target);
    }

    const targetValue = target.value;

    target.setSelectionRange(0, targetValue.length);

    if (e.key !== "Backspace" || targetValue !== "") {
      return;
    }

    focusToPreInput(target);
  };

  useEffect(() => {
    if (showOtpInput) {
      setTimeout(() => {
        const inputElements = inputRefs.current;
        inputElements[0].focus();
        inputElements[0].click();
      }, 100);
    }
  }, [showOtpInput]);

  const redirectToPage = (url: string) => {
    window.location.href = url;
  };

  const handleLoginSuccess = (targetPage: string) => {
    dispatch(setLoadingScreenDisplay(true));

    if (targetPage.includes("index")) {
      redirectToPage(`/${lang}/${ROUTES.MEMBER}`);
    } else {
      redirectToPage(targetPage.replace(/^.{3}/g, `/${lang}`));
    }
  };

  const handleErrorResponse = (response: LoginOTPResponseType, callback: any, redirectUrl: string) => {
    const isInvalidOtp =
      response.statusCode === 400 && (response.returnCode === "40010" || response.returnCode === "40015");

    if (response.returnCode === "32011") {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: true,
          alertTitle: t("alertModal.32011_popup_title"),
          rightButtonText: t("alertModal.32011_popup_right_button_text"),
        })
      );
      inputRefs.current.forEach(input => (input.value = ""));
      setOTPValue("");
      inputRefs.current[0].focus();
      inputRefs.current[0].click();
    } else if (isInvalidOtp) {
      callback &&
        callback(response.returnCode, (response.data?.maxAttemptAllow ?? 0) - (response.data?.numberOfAttempt ?? 0));
      inputRefs.current.forEach(input => (input.value = ""));
      setOTPValue("");
      inputRefs.current[0].focus();
      inputRefs.current[0].click();
    } else {
      redirectToPage(redirectUrl);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const inputElements = inputRefs.current;
    const otp = inputElements.map(input => input.value).join("");
    if (index < inputElements.length - 1) {
      focusToNextInput(e.target);
    }

    if (index === inputElements.length - 1) {
      e.target.blur();
    }

    setOTPValue(otp);

    if (!/\d+/gm.test(otp)) {
      return;
    }

    const loginSessionToken = getCookie(CookiesKey.loginSessionToken) as string;

    if (loginSessionToken && isLoginPage && otp.length === OTPCount) {
      const targetPage = getCookie(CookiesKey.targetPageToBeRedirectedTo) as string;

      sendLoginOtpVerify({ sessionToken: loginSessionToken, otp })
        .unwrap()
        .then(response => {
          if (response.data?.verified && redirectUrl === "") {
            handleLoginSuccess(targetPage ?? `/${lang}/${ROUTES.MEMBER}`);
          } else {
            handleErrorResponse(response, callback, redirectUrl);
          }
        });
    }
  };

  const handleInputFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const prevInputEl = target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }
    target.setSelectionRange(0, target.value.length);
  };

  const handleToNextPage = (e: FormEvent) => {
    e.preventDefault();

    const registrationSessionToken = getCookie(CookiesKey.registrationSessionToken) as string;

    if (registrationSessionToken?.length) {
      sendRegistrationOTPVerify({
        sessionToken: registrationSessionToken,
        otp: OTPValue,
      })
        .unwrap()
        .then(response => {
          if (response?.data && response?.data.verified) {
            const token = query.get("register");
            router.push(`/${lang}/${ROUTES.REGISTRATION_INFO}?token=${token}`);
          } else if (
            (response.statusCode === 400 && response.returnCode === "40010") ||
            (response.statusCode === 400 && response.returnCode === "40015")
          ) {
            callback && callback(response.returnCode);
          }
        });
    }
  };

  return (
    <>
      <div className="OtpInputContainer">
        <label htmlFor="otpinput" className="labelText">
          {t("registrationStep1.otp")}
        </label>
        <form>
          <div>
            {/* <span className="otpInputPrefix">{prefix ? `${prefix}-` : null}</span> */}
            <span className="otpInputPrefix">dre-</span>
            {inputRefs.current.map((ref, index) => (
              <input
                ref={element => {
                  if (element) {
                    inputRefs.current[index] = element;
                  }
                }}
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                autoFocus={index === 0}
                required
                maxLength={1}
                className={`otpInput fontWorkSans ${
                  isOTPValidByIndex && isOTPValidByIndex?.[index] === false ? "otpInputErrorFocus" : "otpFocus"
                }`}
                onChange={e => handleInputChange(e, index)}
                onKeyDown={handleInputKeyDown}
                onFocus={handleInputFocus}
                onBlur={event => {
                  onOTPInputBlur &&
                    onOTPInputBlur({
                      inputValue: event.target.value,
                      inputIndex: index,
                    });
                }}
              />
            ))}
          </div>

          {!isLoginPage &&
            (isRegistrationPage && width <= 768 ? (
              <MobileButtonContainer>
                <button
                  onClick={handleToNextPage}
                  disabled={!isOTPValid}
                  className={`${!isOTPValid ? "otpNextButtonDeactivate" : "otpNextButtonActivate"} otpNextButtonMobile`}
                >
                  {t("registrationStep1.next")}
                </button>
              </MobileButtonContainer>
            ) : (
              <button
                onClick={handleToNextPage}
                disabled={!isOTPValid}
                className={`${!isOTPValid ? "otpNextButtonDeactivate" : "otpNextButtonActivate"} otpNextButtonDesktop`}
              >
                {t("registrationStep1.next")}
              </button>
            ))}
        </form>
      </div>
      {showModal &&
        isLoginPage &&
        createPortal(
          <WarningPopup
            goBackToPrePage={true}
            lang={lang}
            buttonGroup
            messages={[t("login.otpSent"), t("login.attemptsRemaining"), t("login.otpAttemptWarningMsg")]}
            handler={() => setShowModal(!showModal)}
            numberOfAttempts={numOfAttempt}
          />,
          document.body
        )}
      {showModal &&
        isRegistrationPage &&
        createPortal(
          <WarningPopup
            goBackToPrePage={true}
            lang={lang}
            buttonGroup
            messages={[t("login.otpSent"), t("login.attemptsRemaining"), t("login.otpAttemptWarningMsg")]}
            handler={() => setShowModal(false)}
            numberOfAttempts={numOfAttempt}
          />,
          document.body
        )}
    </>
  );
};
