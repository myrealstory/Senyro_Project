"use client";

import QRCode from "@/images/icons/profile_QR_code.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hook/useWindowSize";
import { useState } from "react";
import { ProfileResType } from "@/types/api/apiTypes";
import { ROUTES } from "@/constants";
import { MemberTier } from "./MemberTier";
import { createPortal } from "react-dom";
import { UserQRCodeCard } from "./UserQRCodeCard";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";

export const Profile = ({ user, lang }: { user?: ProfileResType["data"]; lang: LocaleKeysType }) => {
  const [showQRCodeCard, setShowQRCodeCard] = useState(false);
  const { width } = useWindowSize();
  const { translate: t } = useTranslation(lang);
  const path = usePathname();

  const desktopQRCode =
    path.includes(`/${lang}/${ROUTES.MEMBER}`) ||
    path.includes(`/${lang}/${ROUTES.TRANSACTION_INSTORE}`) ||
    path.includes(`/${lang}/${ROUTES.TRANSACTION_ONLINE}`) ||
    path.includes(`/${lang}/${ROUTES.COUPON_VALID}`) ||
    path.includes(`/${lang}/${ROUTES.PAY_WITH_CARDS}`) ||
    path.includes(`/${lang}/${ROUTES.INBOX_PERSONAL}`) ||
    path.includes(`/${lang}/${ROUTES.INBOX_PROMOTION}`) ||
    (path.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`) && width >= 1024);

  const handleShowQRCodeCard = () => {
    setShowQRCodeCard(!showQRCodeCard);
  };

  if (!user?.memberNo) {
    return <></>;
  }

  return (
    <>
      <div className="profileContainer ">
        <div className="profileMemberContainer">
          <h3>{user?.firstName}</h3>
          <div className="hidden lg:block">
            <MemberTier tierCode={user?.memberTierCode?.toString()} lang={lang} />
          </div>
        </div>
        <div className="profileQRcodeContainer">
          {desktopQRCode && (
            <button onClick={handleShowQRCodeCard}>
              <Image src={QRCode} width={0} height={0} alt="Your profile QR code" />
            </button>
          )}
          <div className="flex items-center justify-center gap-3">
            <div>
              <span className="profileMemberId">{t("memberArea.memberIdMobile")} </span>
              <span className="profileMemberId">{user?.memberNo}</span>
            </div>
            <div className="lg:hidden">
              <MemberTier tierCode={user?.memberTierCode?.toString()} lang={lang} />
            </div>
          </div>
          <div className="profileMemberNoContainer">
            <span className="profileMemberNo">{t("memberArea.memberNo")}</span>
            <span className="profileMemberNoText">{user?.memberNo}</span>
          </div>
        </div>
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
