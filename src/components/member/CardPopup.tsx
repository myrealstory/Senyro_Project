"use client";
import Image from "next/image";
import Mask from "../Mask";
import cardBG from "@/images/card-bg.gif";
import Close from "@/images/icons/Action Menu.png";
import { ProfileResType, SaveCardType } from "@/types/api/apiTypes";
import { formatDateToISO, reFormattedCardNum } from "@/components/forms/FormattedUtils";
import { CreditCardIcon } from "./CreditCardIcon";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshQrcode } from "./RefreshQrcode";
import "@/style/popup/popup.scss";
import "../../../public/fonts/fontStyle.css";

interface Props {
  card: SaveCardType;
  profile?: ProfileResType["data"];
  checkoutForm?: boolean;
  close: () => void;
  lang: LocaleKeysType;
  isShowPopup?: boolean;
}

export const CardPopup = ({ card, close, profile, lang, isShowPopup }: Props) => {
  const cardNumber = reFormattedCardNum({ cardNum: card.cardNumber, type: "FourAsterisks" });
  const formattedValidDate = profile && formatDateToISO(profile?.tierExpiryDate);
  const memberTier = profile?.memberTier;
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerEleRef = useRef<HTMLButtonElement>(null);
  const [isQrcodeLoading, setIsQrcodeLoading] = useState(false);
  const { translate: t } = useTranslation(lang);
  const RefreshQRcodeMemo = useMemo(
    () => <RefreshQrcode card={card} type="SAVED_CARD" lang={lang} onReady={() => setIsQrcodeLoading(true)} />,
    []
  );

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

  const renderMemberTier = useCallback(
    (memberTier: string, contentMode?: boolean) => {
      const lowerCaseMemberTier = memberTier.toLocaleLowerCase();

      if (contentMode === true) {
        switch (lowerCaseMemberTier) {
          case "basic":
            return t("qrCode.showQRCodeBasic");
            break;
          case "elite":
          case "prestige":
            return t("qrCode.showQRCodeElitePrestige");
            break;
        }
      }

      if (lowerCaseMemberTier === "basic") {
        return t("qrCode.basic");
      }

      if (lowerCaseMemberTier === "elite") {
        return t("qrCode.elite");
      }

      if (lowerCaseMemberTier === "prestige") {
        return t("qrCode.prestige");
      }
    },
    [memberTier, t]
  );

  useEffect(() => {
    if (isShowPopup) {
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
  }, [isShowPopup]);

  return (
    <Mask>
      <figure className="mx-auto w-full max-w-full">
        <div
          ref={modalRef}
          className="relative mx-auto my-auto h-full w-full overflow-hidden bg-primaryGold shadow-sm md:mt-[6rem] md:h-[580px] md:w-[380px] md:rounded-[20px]"
        >
          <Image src={cardBG} width={0} height={0} alt="QR code bg" className="cardPopupBG" />
          <div className="cardPopupCreditCardSecondContainer">
            <div className="cardPopupThirdContainer h-full">
              {isQrcodeLoading && (
                <div className="cardPopupInnerContainer">
                  {/* not accept JCB card for now, but API data is sending JCB here. Needed to delete this when connecting to real db */}
                  <CreditCardIcon cardType={card.cardBankType} />
                  <p>({cardNumber})</p>
                </div>
              )}
              {RefreshQRcodeMemo}

              {isQrcodeLoading && (
                <div className="cardPopupContentContainer">
                  <h3 className="cardPopupCardNum pb-4">{card.cardNumber}</h3>
                  <div className={`pt-2  ${lang === "en" && "flex items-center justify-center gap-1"}`}>
                    <span
                      className={`text-16 font-bold ${
                        lang === "en" ? "philosopher uppercase" : "mb-[-1px]"
                      } ${memberTierTextColor(memberTier)}`}
                    >
                      {memberTier && renderMemberTier(memberTier)}
                    </span>
                    <span
                      className={`text-16 font-bold ${lang === "en" ? "philosopher" : ""} text-16 ${memberTierTextColor(
                        memberTier
                      )}`}
                    >
                      {t("cardPopup.member")}
                    </span>
                  </div>

                  <div className="cardPopupContentContainer pt-2">
                    <span className="text-[12px] text-primaryMine">
                      {t("cardPopup.memberNo")} {profile?.memberNo}
                    </span>
                    <span className="text-[12px] text-primaryMine">
                      {t("cardPopup.validUntil")} {formattedValidDate}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {memberTier && (
              <div className={"mt-[1.5rem] w-full text-center"}>
                <p className="text-[.9rem] font-semibold leading-5 text-white">{renderMemberTier(memberTier, true)}</p>
              </div>
            )}
            {isQrcodeLoading && (
              <div className="cardPopupMsgContainer">
                <button onClick={close} className="cardPopupCloseBtn">
                  <Image src={Close} width={0} height={0} alt="Click this to close modal" />
                </button>
              </div>
            )}
          </div>
        </div>
      </figure>
    </Mask>
  );
};
