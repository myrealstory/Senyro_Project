"use client";

import debounce from "lodash.debounce";
import placeholderImage from "@/images/icons/Icon_PlaceholderSquare@3x.png";
import Submitted from "@/images/icons/Icon_submitted.png";
import appStore from "@/images/icons/Icon_AppleDownload@3x.png";
import googlePlay from "@/images/icons/Icon_AndroidDownload@3x.png";
import Image from "next/image";
import Link from "next/link";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import "@/style/auth/auth.scss";
import { FetchFailResponse } from "@/types/commonTyps";
import { useCallback, useEffect, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";
import { getCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import moment from "moment";

export const VerifyEmail = ({
  lang,
  error,
  session,
}: {
  lang: LocaleKeysType;
  error?: FetchFailResponse["error"];
  session: string;
}) => {
  const { translate: t } = useTranslation(lang);
  const dispatch = useDispatch();

  const debounceCallback = useCallback(
    debounce(async () => {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: true,
          alertTitle: t(`alertModal.${error?.returnCode}_popup_title`),
          alertContent: t(`alertModal.${error?.returnCode}_popup_content`),
          leftButtonText: t(`alertModal.${error?.returnCode}_popup_left_button_text`),
          rightButtonText: t(`alertModal.${error?.returnCode}_popup_right_button_text`),
          onLeftButtonClick: () => {
            handleToContact();
          },
        })
      );
    }, 300),
    [error]
  );

  useEffect(() => {
    if (error) {
      const verifyEmailToken = getCookie(CookiesKey.verifyEmailToken) as string;
      if (!verifyEmailToken || !verifyEmailToken?.length) {
        debounceCallback();
      }
    } else if (!error && session?.length) {
      setCookie(CookiesKey.verifyEmailToken, session, {
        expires: moment().add(10, "minutes").toDate(),
      });
    }
  }, [error, session]);

  const handleToContact = (e?: MouseEvent<HTMLButtonElement>) => {
    e && e.preventDefault();

    localStorage.setItem("isContactClickedInRegisterSubmittedPage", "true");
    if (window !== undefined) {
      window.location.href = `/${lang}/${ROUTES.CONTACT}`;
    }
  };

  return (
    <main className="registerPendingContainer">
      <div className="registerPendingSecondContainer">
        <div className="registerPendingImageContainer">
          <Image src={Submitted} width={83} height={83} alt="Email sent icon" />
        </div>
        <div className="registerPendingTextsContainer">
          <h1>{t("registrationPending.submitted")}</h1>
          <p>{t("registrationPending.greeting")}</p>
          <p>
            {t("registrationPending.forFurtherAssistance")}
            <button onClick={handleToContact} className="border-b text-[16px]">
              {t("registrationPending.contact")}
            </button>
          </p>
          <p className="pt-16">{t("registrationPending.downloadApp")}</p>
        </div>

        <div className="registerPendingImgsContainer">
          <div>
            <Image
              src={placeholderImage}
              width={168}
              height={168}
              alt="placeholder"
              className="registerPendingPlaceholderImg"
            />
            <Image src={appStore} width={137} height={46} alt="App store logo" className="registerPendingAppStore" />
          </div>
          <div>
            <Image
              src={placeholderImage}
              width={168}
              height={168}
              alt="placeholder"
              className="registerPendingPlaceholderImg"
            />
            <Image
              src={googlePlay}
              width={155}
              height={46}
              alt="Googleplay logo"
              className="registerPendingGooglePlay"
            />
          </div>
        </div>
        <div className="hidden w-full md:block lg:mb-7 lg:mt-5 lg:px-[6rem]">
          <Link
            href={`/${lang}/${ROUTES.INDEX}`}
            className="block w-full rounded-full bg-primaryGold py-5 text-center text-white md:text-[1.3rem] md:font-semibold"
          >
            {t("registrationStep3.backToHome")}
          </Link>
        </div>
        {/* </section> */}
        <MobileButtonContainer>
          <Link className="registerPendingMobileLink" href={`/${lang}/${ROUTES.INDEX}`}>
            {t("registrationPending.backToHome")}
          </Link>
        </MobileButtonContainer>
      </div>
    </main>
  );
};
