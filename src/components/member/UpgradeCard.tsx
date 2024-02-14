"use client";

import Image from "next/image";
import PrestigeHeader from "@/images/Prestige_header.svg";
import EliteHeaderSilver from "@/images/Elite_header-silver.svg";
import { BenefitItems } from "./BenefitItems";
import { SemiCircleProgress } from "./SemiCircleProgress";
import { LocaleKeysType } from "@/app/i18n";
import { formatDateToISO } from "../forms";
import { useTranslation } from "@/app/i18n/client";
import { RenewResponseType } from "@/types/api/apiTypes";
import "@/style/member/member.scss";
import { useCallback } from "react";

export const UpgradeCard = ({
  upgradeData: {
    nextTier,
    expiryDate,
    effectiveDate: ED,
    upgradeSpending,
    upgradeRquiredSpending,
    remainingToUpgradeSpending,
  },
  lang,
  secondContainerClass,
}: {
  upgradeData: RenewResponseType["data"]["upgradeMemberTier"];
  lang: LocaleKeysType;
  secondContainerClass?: string;
}) => {
  const deadLine = formatDateToISO(expiryDate);
  const effectiveDate = formatDateToISO(ED);
  const { translate: t } = useTranslation(lang);
  const formattedSpending = remainingToUpgradeSpending.toLocaleString();
  const upgradeSpendings = 13000;

  const tierText = useCallback((nextTier: string) => {
    if (nextTier.toLocaleLowerCase() === "elite") {
      return t("upgrade.elite");
    }

    if (nextTier.toLocaleLowerCase() === "prestige") {
      return t("upgrade.prestige");
    }
  }, []);

  const headerBGColorSrc = useCallback((nextTier?: string) => {
    if (nextTier?.toLocaleLowerCase() === "elite") {
      return EliteHeaderSilver;
    }
    if (nextTier?.toLocaleLowerCase() === "prestige") {
      return PrestigeHeader;
    }
  }, []);

  const renderUpgradeNotFulfilledText = (
    <>
      {lang === "en" ? (
        <div className="flex flex-col lg:gap-[3px]">
          <span className="block">
            {t("upgrade.by")}
            <strong>{deadLine}</strong>
          </span>

          <span className="block">
            {t("upgrade.spend")}
            <strong>${formattedSpending}</strong>
            {t("upgrade.more")}
          </span>
        </div>
      ) : (
        <div className="flex flex-col lg:gap-[3px]">
          <span className="block">
            {t("upgrade.by")}
            <strong>{deadLine}</strong>,
          </span>
          <span>
            {t("upgrade.spend")}
            {t("upgrade.more")} <strong>${formattedSpending}</strong>
          </span>
        </div>
      )}
    </>
  );

  const renderUpgradeHeadingText = (
    <>
      <h4 className="pb-[2px] font-light">
        {t("upgrade.to")}
        <strong className="font-extrabold">{tierText(nextTier)}</strong>
        {t("upgrade.member")}
      </h4>
      {upgradeSpendings < upgradeRquiredSpending || upgradeSpendings === upgradeRquiredSpending ? (
        renderUpgradeNotFulfilledText
      ) : (
        <div className="flex flex-1 flex-col">
          <span className="block">{t("upgrade.upgradeFulfilledP1")}</span>
          <span className="block">{t("upgrade.upgradeFulfilledP2")}</span>
        </div>
      )}
    </>
  );

  const upgradeFulfilledContent = (
    <div className="upgradeOpenRenewalContentContainer">
      <span className="upgradeExpiryDate">
        {t("upgrade.startAt")}
        {effectiveDate}
        <br />
        <span>{t("upgrade.upgradeReminder")}</span>
      </span>
    </div>
  );

  return (
    <div className="upgradeCardFirstContainer">
      <div className={`upgradeCardSecondContainer ${secondContainerClass}`}>
        <div className="w-full">
          <figure className="relative">
            <Image
              src={headerBGColorSrc(nextTier.toLowerCase())}
              width={345}
              height={142}
              alt="Header"
              className="upgradeCardHeaderImg"
            />

            <div className="upgradeCardHeaderContainer">
              <span className="upgradeCardTitle">{t("upgrade.upgrade")}</span>

              <div className="upgradeCardDescriptionContainer">{renderUpgradeHeadingText}</div>
            </div>
          </figure>
          <div>
            <SemiCircleProgress spending={upgradeSpending} requiredSpending={upgradeRquiredSpending} />
          </div>
          <div className="upgradeCardSpendingContainer">{upgradeFulfilledContent}</div>
          <div className="upgradeCardBenefitContainer">
            <BenefitItems lang={lang} nextTier={nextTier.toLowerCase()} />
          </div>
        </div>
      </div>
    </div>
  );
};
