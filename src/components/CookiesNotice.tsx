"use client";
import React, { useEffect, useState } from "react";
import "@/style/component/component.scss";
import { getCookie, setCookie } from "cookies-next";
import { ComponentType } from "@/app/[lang]/page";
import { useTranslation } from "@/app/i18n/client";
import { CookiesKey } from "@/constants/cookies";
import { ROUTES } from "@/constants";
import moment from "moment";

export const CookiesNotice = ({ lang }: ComponentType) => {
  const { translate } = useTranslation(lang);
  const isCookieAccepted = getCookie(CookiesKey.isCookieAccepted);
  const [isDisplay, setIsDisplay] = useState(false);

  const acceptCookie = () => {
    setIsDisplay(false);
    setCookie(CookiesKey.isCookieAccepted, "true", {
      expires: moment().add(10, "year").toDate(),
    });
  };

  useEffect(() => {
    if (isCookieAccepted === undefined) {
      setIsDisplay(true);
    }
  }, [isCookieAccepted]);

  if (!isDisplay) {
    return <></>;
  }

  const handleCookieLink = () => {
    window.location.href = `/${lang}/${ROUTES.PRIVACY_AND_POLICY}`;
  };

  return (
    <div
      className={
        "raiseup fixed bottom-0 left-0 z-[9999] w-full bg-primaryDark px-4 py-2 md:flex md:justify-between md:py-3 lg:pl-28 lg:pr-16"
      }
    >
      <div className="mx-auto flex w-full items-center justify-between">
        <div className={`raiseup-content w-[80%] ${lang === "en" ? "md:w-[780px]" : "md:w-[80%]"}`}>
          {lang === "en" ? (
            <>
              <p className="text-12 leading-[15px] text-white md:text-14 md:leading-6 lg:inline">
                <span>{translate("header.cookieNotice")}</span>
              </p>
              <p className="text-12 leading-[15px] text-white md:text-14 md:leading-6">
                <span>{translate("header.cookieNotice1")}</span>
                <span className="cursor-pointer underline" onClick={handleCookieLink}>
                  {translate("header.cookieLink")}
                </span>
                <span>{translate("header.periodAfterHyperLink")}</span>
              </p>
            </>
          ) : (
            <p className="text-12 leading-[15px] text-white md:text-14 md:leading-6 lg:inline">
              <span>{translate("header.cookieNotice")}</span>
              <span className="cursor-pointer underline" onClick={handleCookieLink}>
                {translate("header.cookieLink")}
              </span>
              <span>{translate("header.periodAfterHyperLink")}</span>
            </p>
          )}
        </div>
        <button
          className="btnCloseCookieBar border-white before:bg-white after:bg-white hover:before:bg-lightGrey hover:after:bg-lightGrey"
          onClick={acceptCookie}
        />
      </div>
    </div>
  );
};
