"use client";

import EliteHeaderSilver from "@/images/Elite_header-silver.svg";
import PrestigeHeader from "@/images/Prestige_header.svg";
import BasicHeader from "@/images/BasicColor.svg";
import Chevron from "@/images/icons/Icon_chevron-open-white.png";
import Image from "next/image";
import { SemiCircleProgress } from "./SemiCircleProgress";
import { useEffect, useState } from "react";
import { formatDateToISO } from "../forms";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { RenewResponseType } from "@/types/api/apiTypes";
import "@/style/member/member.scss";

export const RenewalCard = ({
  renewalData: {
    tierCode,
    expiryDate,
    effectiveDate: ED,
    renewalSpending,
    renewRequiredSpending,
    remainingToRenewSpending,
  },
  lang,
}: {
  renewalData: RenewResponseType["data"]["renewMemberTier"];
  lang: LocaleKeysType;
}) => {
  const deadLine = formatDateToISO(expiryDate);
  const effectiveDate = formatDateToISO(ED);
  const [openRenewal, setOpenRenewal] = useState(false);
  const { translate: t } = useTranslation(lang);
  const formattedRemainingToRenewSpending = remainingToRenewSpending.toLocaleString();
  const fullFilledRenewal = renewalSpending === renewRequiredSpending || renewalSpending > renewRequiredSpending;

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpenRenewal(!openRenewal);
  };

  const headerBGColorSrc = (tierCode: number | null) => {
    if (tierCode === 1) {
      return BasicHeader;
    }
    if (tierCode === 2) {
      return EliteHeaderSilver;
    }
    if (tierCode === 3) {
      return PrestigeHeader;
    }
  };

  useEffect(() => {
    if (tierCode === 3) {
      setOpenRenewal(true);
    }
  }, [tierCode]);

  const renderText = (
    <>
      {lang === "en" ? (
        <div className="flex flex-col lg:gap-[3px]">
          <span className="block">
            {t("upgrade.by")}
            <strong>{deadLine}</strong>
          </span>

          <span className="block">
            {t("upgrade.spend")}
            <strong>${formattedRemainingToRenewSpending}</strong>
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
            {t("upgrade.more")} <strong>${formattedRemainingToRenewSpending}</strong>
          </span>
        </div>
      )}
    </>
  );

  const renderRenewalfulfilledHeading = (
    <>
      {fullFilledRenewal ? (
        <h4 className="upgradeRequirementText text-12 leading-4 sm:text-14 lg:leading-5 xl:text-16">
          {t("renewal.renewalFulfilled")}
        </h4>
      ) : (
        renderText
      )}
    </>
  );

  const renderHeading = (
    <>
      <h2 className="text-12 font-bold leading-4 sm:text-14 lg:leading-5 xl:text-16">{t("renewal.renewalCriteria")}</h2>
      {renderRenewalfulfilledHeading}
    </>
  );

  const renewalFulfilledContent = (
    <div className="upgradeOpenRenewalContentContainer">
      <span className="upgradeExpiryDate">
        {t("upgrade.startAt")}
        {effectiveDate}
      </span>
      {tierCode === 2 && <span className="text-center">{t("renewal.reminderElite")}</span>}
      {tierCode === 3 && <span className="text-center text-primaryGold">{t("renewal.reminderPrestige")}</span>}
    </div>
  );

  return (
    <div className="upgradeRenewalCardContainer">
      <figure>
        <Image
          src={headerBGColorSrc(tierCode)}
          width={345}
          height={142}
          alt="Header"
          className={`upgradeRenewalHeader ${
            openRenewal === true ? "rounded-t-[20px] lg:rounded-t-[36px]" : "rounded-full"
          } ${fullFilledRenewal && lang === "en" ? "h-[100px] sm:h-[100px]" : "h-[80px]"} `}
        />
        <div
          className={`upgradeRenewalCard ${
            openRenewal && fullFilledRenewal && lang === "en" ? "top-[50px] md:top-[49px] lg:top-[47px] " : "top-[41px]"
          }`}
        >
          <span className="upgradeRenewalText">{t("upgrade.renew")}</span>
          <div className="upgradeRenewalDescription ">{renderHeading}</div>
          <button
            onClick={handleOpen}
            className="flex flex-1 justify-center"
            // className={`absolute right-[2.5rem] ${
            //   fullFilledRenewal && lang === "en" ? "top-[40px] xl:top-[33px]" : "top-[17px] lg:top-[13px]"
            // } md:right-[3rem] lg:right-[3rem]`}
          >
            <Image
              src={Chevron}
              width={0}
              height={0}
              alt="Click to open or close"
              className={` ${openRenewal === true ? "rotate-0" : "rotate-180"}`}
            />
          </button>
        </div>

        {openRenewal === true ? (
          <>
            <div>
              <SemiCircleProgress spending={renewalSpending} requiredSpending={renewRequiredSpending} />
            </div>
            <div className="upgradeOpenRenewalContentContainer">
              {renewalFulfilledContent}
              {renewalSpending === renewRequiredSpending && renewalFulfilledContent}
            </div>
          </>
        ) : null}
      </figure>
    </div>
  );
};
