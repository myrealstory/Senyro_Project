"use client";

import Link from "next/link";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import { tierSpendingType } from "@/types/api/apiTypes";
import { useTranslation } from "@/app/i18n/client";
import { formatDate } from "../forms";

export const HowToUpgrade = ({
  memberTier,
  expiryDate,
  lang,
  tierSpending,
}: {
  memberTier: number;
  expiryDate: string;
  lang: LocaleKeysType;
  tierSpending: tierSpendingType[];
}) => {
  const { translate: t } = useTranslation(lang);
  const tierSpendingEffectiveDate = formatDate(tierSpending[0].effectiveDate);
  const tierSpendingExpiredDate = formatDate(tierSpending[0].expiryDate);

  return (
    <div className="memberHowToUpgradeContainer">
      <div className="memberHowToUpgradeContentContainer">
        {memberTier === 2 || memberTier === 3 ? (
          <>
            <h2>{t("memberElitePrestigeWithZeroPoint.howToEarnPoints")}</h2>
            <p>{t("memberElitePrestigeWithZeroPoint.content")}</p>
          </>
        ) : (
          <>
            <h2>{t("memberBasic.howToUpgrade")}</h2>
            <p>{t("memberBasic.description")}</p>
          </>
        )}
      </div>
      <Link href={`/${lang}/${ROUTES.MEMBERSHIP_PROGRAM}`}>{t("memberBasic.knowMore")}</Link>
      {memberTier === 1 && (
        <>
          <span className="hidden">{expiryDate}</span>

          <span className="memberHowUpgradeTime">
            {t("memberBasic.validFrom")}
            <br /> {tierSpendingEffectiveDate} - {tierSpendingExpiredDate}
          </span>
        </>
      )}
    </div>
  );
};
