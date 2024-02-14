"use client";
import React from "react";
import alertIcon from "@/images/icons/Icon_alert-triangle.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import "@/style/Maintenance-page/maintenancePage.scss";
import { useUnsubscribeMutation } from "@/redux/api/generalApi";

export default function Unsubscribe() {
  const [inputValue, setInputValue] = React.useState("");
  const [isEmailFormatError, setIsEmailFormatError] = React.useState(false);
  const [isApiError, setIsApiError] = React.useState(false);
  const [isApiSuccess, setIsApiSuccess] = React.useState(false);
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const [unsubscribe, { isLoading }] = useUnsubscribeMutation();

  const validateEmail = (email: string) => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*\.[a-zA-Z]{2,}$/;

    if (emailRegex.test(email) === false) {
      setIsEmailFormatError(true);
      return;
    }
    if (emailRegex.test(email) === true) {
      setIsEmailFormatError(false);
      return;
    }
  };

  React.useEffect(() => {
    if (inputValue === "") {
      setIsEmailFormatError(false);
    }
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    validateEmail(event.target.value);
    setIsApiError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    unsubscribe({ email: inputValue })
      .unwrap()
      .then(res => {
        if (res.statusCode === 200) {
          setIsApiError(false);
          setIsApiSuccess(true);
        } else if (res.returnCode === "39001") {
          setIsApiError(true);
          setIsApiSuccess(false);
        } else {
          setIsApiError(true);
          setIsApiSuccess(false);
        }
      });
  };

  return (
    <main
      className={`unsubPageMainContainer
      ${isEmailFormatError ? "mb-[87px] mt-[42px] " : "mb-[60px] mt-[5px] "}`}
    >
      <h1 className="">{translate("unsubscribe.title")}</h1>

      <div
        className={` unsubPageEmailInputContainer
           ${isEmailFormatError || isApiError ? "border-primaryPurple" : "unsubnPageEmailInputContainerIsValid"} 
        `}
      >
        <input
          className={`unsubPageEmailInput 
                    ${isEmailFormatError || isApiError ? "h-[19px] w-full xl:h-[1.625rem] " : "w-full"}
                    `}
          type="email"
          required
          placeholder={`${translate("unsubscribe.enterEmail")}`}
          value={inputValue}
          onChange={handleInputChange}
          id="email"
          name="email"
        />
        <div className="unsubPageAlertIconContainer">
          <Image
            src={alertIcon}
            width={0}
            height={0}
            alt="alertIcon"
            className={`object-contain  ${isEmailFormatError || isApiError ? " block " : "hidden"}`}
          />
        </div>
      </div>

      {isEmailFormatError && (
        <div className="unsubPageAlertMsgContainer ">
          <p className="text-primaryPurple ">{translate("unsubscribe.invalidEmail")}</p>
        </div>
      )}
      {isApiError && (
        <div className="unsubPageAlertMsgContainer ">
          <p className="text-primaryPurple ">{translate("unsubscribe.submitFail")}</p>
        </div>
      )}
      {isApiSuccess && (
        <div className="unsubPageAlertMsgContainer ">
          <p className="text-primaryGold ">{translate("unsubscribe.submitSuccess")}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-12">
        <button
          className={`unsubPageBtn bg-primaryGold text-white ${
            isApiError || isEmailFormatError || inputValue === ""
              ? "bg-secondaryLightGold1 text-white"
              : "bg-primaryGold text-white"
          }`}
          type="submit"
          disabled={isLoading ?? isApiError ?? isEmailFormatError ?? inputValue === ""}
        >
          {translate("unsubscribe.button")}
        </button>
      </form>
    </main>
  );
}
