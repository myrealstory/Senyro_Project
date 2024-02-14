"use client";

import Image from "next/image";
import Mask from "@/components/Mask";
import Close from "@/images/icons/Action Menu.png";
import cardBG from "@/images/card-bg.gif";
import { formatDateToISO } from "../forms";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshQrcode } from "./RefreshQrcode";
import "@/style/popup/popup.scss";
import "../../../public/fonts/fontStyle.css";

interface Props {
  close: () => void;
  memberNo?: string;
  memberTier?: string;
  tierExpiryDate?: string;
  lang: LocaleKeysType;
  isShowQRCode?: boolean;
}

export const UserQRCodeCard = ({ memberNo, close, memberTier, tierExpiryDate, lang, isShowQRCode }: Props) => {
  const formattedValidDate = tierExpiryDate && formatDateToISO(tierExpiryDate);
  const { translate: t } = useTranslation(lang);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerEleRef = useRef<HTMLButtonElement>(null);
  const [isQrcodeLoading, setIsQrcodeLoading] = useState(false);
  const RefreshQRcodeMemo = useMemo(() => {
    return <RefreshQrcode type={"PROFILE"} lang={lang} onReady={() => setIsQrcodeLoading(true)} />;
  }, []);

  const memberTierTextColor = useCallback(
    (memberTier?: string) => {
      if (!memberTier) {
        return "";
      }

      const lowerCaseMemberTier = memberTier.toLocaleLowerCase();
      if (lowerCaseMemberTier === "basic") {
        return "text-primaryBasic";
      } else if (lowerCaseMemberTier === "elite") {
        return "text-primaryMine";
      } else if (lowerCaseMemberTier === "prestige") {
        return "text-primaryPurple";
      }
    },
    [memberTier, t]
  );

  const memberTierInfo = useMemo(() => {
    if (!memberTier) {
      return {};
    }
    const lowerCaseMemberTier = memberTier.toLocaleLowerCase();
    if (lowerCaseMemberTier === "basic") {
      return {
        title: t("qrCode.basic"),
        description: t("qrCode.showQRCodeBasic"),
      };
    }

    if (lowerCaseMemberTier === "elite") {
      return {
        title: t("qrCode.elite"),
        description: t("qrCode.showQRCodeElitePrestige"),
      };
    }

    if (lowerCaseMemberTier === "prestige") {
      return {
        title: t("qrCode.prestige"),
        description: t("qrCode.showQRCodeElitePrestige"),
      };
    }

    return {};
  }, [memberTier, t]);

  useEffect(() => {
    if (isShowQRCode) {
      const popup = modalRef.current;
      const firstFocusableEle = popup?.querySelector("button");
      document.body.style.overflow = "hidden";

      firstFocusableEle?.focus();
    } else {
      triggerEleRef.current?.focus();
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isShowQRCode]);

  return (
    <Mask>
      <figure className="mx-auto w-full max-w-full">
        <div
          ref={modalRef}
          className="relative mx-auto h-[525px] w-[350px] max-w-full cursor-pointer rounded-[20px] bg-primaryGold opacity-90 shadow-sm"
        >
          <Image
            src={cardBG}
            width={0}
            height={0}
            alt="QR code bg"
            className="userCardPopupBG mt-[6rem] rounded-[20px] lg:mt-[9rem] 2xl:mt-[10rem]"
          />
          <div className="cardPopupUserCardSecondContainer">
            <div className="cardPopupThirdContainer">
              {isQrcodeLoading && (
                <div className="cardPopupInnerContainer">
                  <p>{t("qrCode.myQRCode")}</p>
                </div>
              )}
              <div className="relative mt-[-10px]">{RefreshQRcodeMemo}</div>
              {isQrcodeLoading && (
                <div className="cardPopupContentContainer font-semibold">
                  <div className={`${lang === "en" && "flex items-center justify-center gap-1"}`}>
                    <span
                      className={`text-16 font-bold  ${
                        lang === "en" ? "philosopher uppercase" : "mb-[-1px]"
                      } ${memberTierTextColor(memberTier)}`}
                    >
                      {memberTierInfo.title}
                    </span>
                    <span
                      className={`text-16 font-bold ${lang === "en" ? "philosopher" : ""} text-16 ${memberTierTextColor(
                        memberTier
                      )}`}
                    >
                      {t("qrCode.member")}
                    </span>
                  </div>

                  <span className="text-[12px] text-primaryMine">
                    {t("qrCode.memberNo")}
                    {memberNo}
                  </span>
                  <span className=" text-[12px] text-primaryMine">
                    {t("qrCode.validUntil")}
                    {formattedValidDate}
                  </span>
                </div>
              )}
            </div>
            {isQrcodeLoading ? (
              <div className="userPopupMsgContainer">
                <p>{memberTierInfo.description}</p>
                <button onClick={close} className="cardPopupCloseBtn">
                  <Image src={Close} width={0} height={0} alt="Click this to close modal" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </figure>
    </Mask>
  );
};
