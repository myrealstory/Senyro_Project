"use client";

import QRCode from "@/images/icons/profile_QR_code.png";
import Image from "next/image";
import { SemiCircleProgress } from "./SemiCircleProgress";
import { HowToUpgrade } from "./HowToUpgrade";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { ProfileResType } from "@/types/api/apiTypes";
import { useState } from "react";
import { createPortal } from "react-dom";
import { UserQRCodeCard } from "./UserQRCodeCard";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants";

export const RenderBasicCard = ({ lang, user }: { lang: LocaleKeysType; user: ProfileResType["data"] }) => {
  const [showQRCodeCard, setShowQRCodeCard] = useState(false);
  const { translate: t } = useTranslation(lang);
  const memberTierCode = Number(user?.memberTierCode);
  const spending = user?.currentSpending;
  const tierValid = user?.tierExpiryDate;
  const tierSpending = user?.tierSpending;
  const path = usePathname();
  const mobileQRCode = path === `/${lang}/${ROUTES.MEMBER}`;

  const handleShowQRCodeCard = () => {
    setShowQRCodeCard(!showQRCodeCard);
  };

  return (
    <>
      <div className="memberBasicCardContainer">
        <h2>{t("memberBasic.pointStatus")}</h2>
        {mobileQRCode && (
          <button className="memberBasicImage" onClick={handleShowQRCodeCard}>
            <Image src={QRCode} width={0} height={0} className="lg:h-auto " alt="Your profile QR code" />
          </button>
        )}
        <div>
          <SemiCircleProgress
            spending={spending}
            requiredSpending={user?.tierSpending[0].upgradeSpending}
            memberTierCode={memberTierCode}
          />
        </div>

        <HowToUpgrade memberTier={memberTierCode} expiryDate={tierValid} lang={lang} tierSpending={tierSpending} />
      </div>
      {showQRCodeCard &&
        createPortal(
          <UserQRCodeCard
            memberNo={user?.memberNo}
            tierExpiryDate={user?.tierExpiryDate}
            memberTier={user?.memberTier}
            close={() => setShowQRCodeCard(false)}
            lang={lang}
            isShowQRCode={showQRCodeCard}
          />,
          document.body
        )}
    </>
  );
};
