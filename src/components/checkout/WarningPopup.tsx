"use client";

import React from "react";
import Mask from "../Mask";
import Tooltip from "@/images/icons/Icon_tooltip.png";
import { LocaleKeysType } from "@/app/i18n";
import Link from "next/link";
import CloseIcon from "@/images/icons/Action Menu.png";
import Image from "next/image";
import { ROUTES } from "@/constants/routes";
import "@/style/popup/popup.scss";
import { useTranslation } from "@/app/i18n/client";

type WarningPopup = {
  messages: string[];
  lang: LocaleKeysType;
  path?: string;
  goBackToPrePage?: boolean;
  buttonGroup?: boolean;
  numberOfAttempts?: number;
  handler: () => void;
};
export default function WarningPopup({
  messages,
  path,
  goBackToPrePage,
  lang,
  buttonGroup,
  numberOfAttempts,
  handler,
}: WarningPopup) {
  const isLoginPage = path === `/${lang}/${ROUTES.LOGIN}`;
  const isRegistrationPage = path === `/${lang}/${ROUTES.REGISTRATIONPAGEPATH}`;
  const isRegistrationInfo = path === `/${lang}/${ROUTES.REGISTRATION_INFO}`;
  const { translate } = useTranslation(lang);

  return (
    <Mask>
      <div className="popupContainer">
        {isLoginPage || isRegistrationPage ? (
          <div className="mb-4">
            <Image src={Tooltip} width={30} height={30} alt="Click to open tooltip" />
          </div>
        ) : null}
        {messages.length > 1 ? (
          <div className="popupTitles">
            <p className="popupTitleMsgOne">{messages[0]}</p>

            {isLoginPage ? (
              <p className="popupTitleLoginMsg">
                [ {numberOfAttempts} {messages[1]} ]
              </p>
            ) : (
              ""
            )}
            <p className="block">{messages[2]}</p>
          </div>
        ) : (
          <p className="popupTitleNormalMsg">{messages}</p>
        )}
        {isRegistrationInfo && !goBackToPrePage && (
          <div className="popupRegistrationInfoButton">
            <button onClick={handler}>OK</button>
          </div>
        )}

        {isRegistrationInfo && buttonGroup && goBackToPrePage && (
          <div className="popupRegistrationLeavePageButtons">
            <Link href={`/${lang}/${ROUTES.REGISTRATIONPAGEPATH}`}>{translate("popup.leave")}</Link>
            <button onClick={handler}> {translate("popup.cancel")}</button>
          </div>
        )}
        {!isRegistrationInfo && buttonGroup && goBackToPrePage && (
          <button onClick={handler} className="popupButtons">
            {translate("popup.confirm")}
          </button>
        )}
        {/* Floating Button */}
        <div className="popupFloatingBtnContainer">
          <div>
            {isLoginPage || isRegistrationPage ? (
              <button onClick={handler}>
                <Image src={CloseIcon} width={0} height={0} alt="Click to close popup alert" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </Mask>
  );
}
