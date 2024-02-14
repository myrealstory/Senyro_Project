"use client";

import Image from "next/image";
import WarningPopup from "../checkout/WarningPopup";
import Tooltip from "@/images/icons/Icon_tooltip.png";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { GetOtpInput } from "./GetOtpInput";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { ROUTES } from "@/constants/routes";
import "@/style/auth/auth.scss";

export const OtpForm = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);
  const path = usePathname();
  const [showModal, setShowModal] = useState(false);
  const isRegistrationPage = path && getRouteNameFromPathname(path).secondSlug === ROUTES.REGISTRATIONPAGEPATH;
  const isLoginPage = path && getRouteNameFromPathname(path).secondSlug === ROUTES.LOGIN;

  return (
    <>
      <div className="otpContainer">
        <label htmlFor="mobile" className="labelText labelTextLayout pb-[3px]">
          <div onClick={() => setShowModal(true)} className="flex items-center">
            <span className="inline-block">{t("login.mobileNum")}</span>
            <Image
              src={Tooltip}
              width={28}
              height={27}
              alt="Click to open tooltip"
              className="h-auto w-[20px] cursor-pointer"
            />
          </div>
        </label>
        <GetOtpInput lang={lang} isFullScreenOverlayDisplayed={showModal} />
      </div>
      {isRegistrationPage && showModal && (
        <WarningPopup
          lang={lang}
          path={path}
          messages={[t("registrationStep1.popupWarning")]}
          handler={() => setShowModal(!showModal)}
        />
      )}
      {isLoginPage && showModal && (
        <WarningPopup
          lang={lang}
          path={path}
          messages={[t("login.tooltipMsg")]}
          handler={() => setShowModal(!showModal)}
        />
      )}
    </>
  );
};
