"use client";

import Image from "next/image";
import QRCodeBG from "@/images/card-bg.gif";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { formatDateToISOWithSlash } from "../forms";
import { useCallback, useMemo, useState } from "react";
import { RefreshQrcode } from "./RefreshQrcode";
import "@/style/member/member.scss";
import "../../../public/fonts/fontStyle.css";

interface Props {
  memberNo: string;
  tierExpiryDate: string;
  memberTier: string;
  lang: LocaleKeysType;
  couponId?: string;
}
export const CouponQRCodeCard = ({ memberNo, tierExpiryDate, memberTier, lang, couponId }: Props) => {
  const { translate: t } = useTranslation(lang);
  const [isQrcodeLoading, setIsQrcodeLoading] = useState(false);
  const RefreshQRcodeMemo = useMemo(
    () => <RefreshQrcode couponId={couponId} type={"COUPON"} lang={lang} onReady={() => setIsQrcodeLoading(true)} />,
    [couponId]
  );

  const formattedValidDate = tierExpiryDate && formatDateToISOWithSlash(tierExpiryDate);

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

  const renderMemberTier = (memberTier: string) => {
    const lowerCaseMemberTier = memberTier.toLocaleLowerCase();

    if (lowerCaseMemberTier === "basic") {
      return t("qrCode.basic");
    }

    if (lowerCaseMemberTier === "elite") {
      return t("qrCode.elite");
    }

    if (lowerCaseMemberTier === "prestige") {
      return t("qrCode.prestige");
    }
  };

  return (
    <div>
      {/* <figure className="couponQRCodeCardContainer"> */}
      <figure className="relative mx-auto h-[400px] w-[350px] max-w-full cursor-pointer overflow-hidden rounded-[20px] bg-primaryGold  shadow-sm">
        <Image src={QRCodeBG} width={0} height={0} alt="QR code bg" className="userCardPopupBG " />
        <div className="couponQRCodeContentContainer">
          <figure className={`relative ${isQrcodeLoading ? "bg-white" : "bg-transparent"}`}>
            {RefreshQRcodeMemo}

            {isQrcodeLoading && (
              <div className="couponQRCodeMemberProfileContainer">
                <div className="font-semibold">
                  <span
                    className={`${lang === "en" ? "philosopher uppercase" : "mb-[-1px]"} ${memberTierTextColor(
                      memberTier
                    )}`}
                  >
                    {renderMemberTier(memberTier)}
                  </span>
                  <span
                    className={`font-bold ${lang === "en" ? "philosopher" : ""} text-16 ${memberTierTextColor(
                      memberTier
                    )}`}
                  >
                    {t("couponQRCode.member")}
                  </span>
                </div>
                <h4>
                  {t("couponQRCode.memberNo")} <span>{memberNo}</span>
                </h4>
                <h4>
                  {t("couponQRCode.validUntil")} <span>{formattedValidDate}</span>
                </h4>
              </div>
            )}
          </figure>

          {isQrcodeLoading && (
            <div className="couponQRCodeTextContainer">
              {memberTier.toLocaleLowerCase() === "basic" ? (
                <span>{t("couponQRCode.remarksBasic")}</span>
              ) : (
                <span>{t("couponQRCode.remarks")}</span>
              )}
            </div>
          )}
        </div>
      </figure>
    </div>
  );
};
