"use client";

import { NoCouponsCard } from "./NoCouponsCard";
import { inactiveCouponsType } from "@/types/api/apiTypes";
import { LocaleKeysType } from "@/app/i18n";
import { CouponCard } from "./CouponCard";
import { LoadMoreBtn } from "../LoadMoreBtn";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { useWindowSize } from "@/hook/useWindowSize";

interface ExpiredCouponProps {
  lang: LocaleKeysType;
  expiredCoupons: inactiveCouponsType[];
}

export const ExpiredCouponCard = ({ lang, expiredCoupons }: ExpiredCouponProps) => {
  const [loadMore, setLoadMore] = useState(false);
  const { width } = useWindowSize();
  const initialCouponsToShow = loadMore ? expiredCoupons.length : 10;
  const { translate: t } = useTranslation(lang);
  const handleLoadMore = () => {
    setLoadMore(!loadMore);
  };

  const isMobileView = width < 768;

  return (
    <>
      {expiredCoupons.length === 0 && <NoCouponsCard text={t("coupons.noUsedOrExpiredCoupon")} />}
      <div className="couponsExpiredContainer">
        {expiredCoupons.length > 0 &&
          expiredCoupons
            .slice(0, initialCouponsToShow)
            .map(item => (
              <CouponCard
                key={item.id}
                id={item.id}
                lang={lang}
                imageUrl={isMobileView ? item.imageUrl : item.imageHdUrl}
                title={item.title}
                tags={item.channels}
                effectiveDate={item.effectiveDate}
                expiryDate={item.expiryDate}
                validCoupons={false}
                couponStatus={item.status}
              />
            ))}
      </div>
      <div className="couponsContainer">
        {expiredCoupons.length > 5 ? <LoadMoreBtn onLoadMore={handleLoadMore} loadMore={loadMore} lang={lang} /> : null}
      </div>
    </>
  );
};
