"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Mask from "@/components/Mask";
import Close from "@/images/icons/Action Menu.png";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { QRcode } from "./QRcode";
import BasicMemberIcon from "@/images/icons/qr_code_basic@3x.png";
import EliteMemberIcon from "@/images/icons/qr_code_elite@3x.png";
import PrestigeMemberIcon from "@/images/icons/qr_code_prestige@3x.png";

interface PickupProps {
  lang: LocaleKeysType;
  onClose: () => void;
  isPopupOpen?: boolean;
  qrCodeString?: string;
  memberTier?: string;
  pickupNo: string;
}

export const PickupQRCode = ({ lang, onClose, isPopupOpen, qrCodeString, memberTier, pickupNo }: PickupProps) => {
  const { translate: t } = useTranslation(lang);

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isPopupOpen]);

  const memberTierInfo = useMemo(() => {
    if (!memberTier) {
      return {};
    }
    const lowerCaseMemberTier = memberTier.toLocaleLowerCase();
    if (lowerCaseMemberTier === "basic") {
      return {
        icon: BasicMemberIcon.src,
      };
    }

    if (lowerCaseMemberTier === "elite") {
      return {
        icon: EliteMemberIcon.src,
      };
    }

    if (lowerCaseMemberTier === "prestige") {
      return {
        icon: PrestigeMemberIcon.src,
      };
    }

    return {};
  }, [memberTier]);

  if (!isPopupOpen) {
    return null;
  }

  return (
    <Mask>
      <figure className=" mx-auto w-full max-w-fit">
        <div
          className={`relative mx-auto mt-[6rem] ${
            lang === "en" ? "h-[450px]" : "h-[420px]"
          } w-[320px] rounded-[20px]  bg-[#ECD6B5] shadow-sm lg:mt-[10rem] xl:w-[336px] 2xl:mt-[14rem]`}
        >
          <div className="flex w-full flex-col items-center justify-center py-4 text-18 font-extrabold leading-6 text-primaryGold">
            <span>{t("transactions.pickupQRcodeTitle")}</span>
            <span>{t("transactions.pickupQRcodeSubtitle")}</span>
          </div>
          <div className="absolute left-[11%] top-[70px] h-[300px] w-[260px]">
            <div className="cardPopupThirdContainer">
              {qrCodeString?.length && memberTierInfo.icon && (
                <QRcode qrCodeStr={qrCodeString} qrSize={250} errorLevel="M" margin={3} scale={4} />
              )}
              <div className="cardPopupInnerContainer">
                <p>{t("transactions.pickupQrcode")}</p>
                <span>#{pickupNo}</span>
              </div>
              <p className="text-center text-[14px] text-mineShaft">
                {t("transactionOnlineDetails.pickupQrcodeDescription")}
              </p>
            </div>

            <div className="mt-[2rem] flex flex-col items-center gap-5">
              <button onClick={onClose} className="cardPopupCloseBtn">
                <Image src={Close} width={0} height={0} alt="Click this to close modal" />
              </button>
            </div>
          </div>
        </div>
      </figure>
    </Mask>
  );
};
