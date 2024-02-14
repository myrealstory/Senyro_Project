"use client";

import { LocaleKeysType } from "@/app/i18n";
import { useGetSingleCouponQuery } from "@/redux/api/memberApi";
import { SingleCouponCard } from "@/components/member/SingleCouponCard";
import { useTranslation } from "@/app/i18n/client";

import { usePathname } from "next/navigation";
import { Disclaimer } from "@/components/member/Disclaimer";
import "@/style/member/member.scss";
import { useWindowSize } from "@/hook/useWindowSize";

export const ExpiredCouponContainer = ({ couponId, lang }: { couponId: string; lang: LocaleKeysType }) => {
  const { data: singleCouponResponse, isSuccess } = useGetSingleCouponQuery(couponId);
  const { translate: t } = useTranslation(lang);
  const { width } = useWindowSize();
  const couponDetails = singleCouponResponse?.data;
  const path = usePathname();
  const isMobileView = width < 768;

  const CouponDisclaimers = [
    t("transactionDisclaimer.remarks1"),
    t("transactionDisclaimer.remarks2"),
    t("transactionDisclaimer.remarks3"),
    t("transactionDisclaimer.remarks4"),
    t("transactionDisclaimer.remarks5"),
  ];

  return (
    <section className="singleCouponContainer">
      {isSuccess ? (
        <SingleCouponCard
          lang={lang}
          title={couponDetails?.title ?? ""}
          imageUrl={(isMobileView ? couponDetails?.imageUrl : couponDetails?.imageHdUrl) ?? null}
          tags={couponDetails?.channels ?? []}
          effectiveDate={couponDetails?.effectiveDate ?? ""}
          expiryDate={couponDetails?.expiryDate ?? ""}
          id={couponId}
          couponStatus={couponDetails?.status}
          path={path}
        />
      ) : null}
      <Disclaimer title={t("transactionDisclaimer.title")} remarks={CouponDisclaimers} />
    </section>
  );
};
