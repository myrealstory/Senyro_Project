"use client";
import { NoCouponsCard } from "./NoCouponsCard";
import { ActiveCouponsType } from "@/types/api/apiTypes";
import { LocaleKeysType } from "@/app/i18n";
import { CouponCard } from "./CouponCard";
import { useState } from "react";
import { LoadMoreBtn } from "../LoadMoreBtn";
import { useWindowSize } from "@/hook/useWindowSize";
import "@/style/member/member.scss";
import { useTranslation } from "@/app/i18n/client";
interface ValidCouponProps {
  lang: LocaleKeysType;
  validCoupons: ActiveCouponsType[];
}

export const ValidCouponCard = ({ lang, validCoupons }: ValidCouponProps) => {
  const { translate: t } = useTranslation(lang);
  const [loadMore, setLoadMore] = useState(false);
  const { width } = useWindowSize();
  const initialCouponsToShow = loadMore ? validCoupons.length : 10;

  const handleLoadMore = () => {
    setLoadMore(!loadMore);
  };

  const isMobileView = width < 768;

  return (
    <>
      {validCoupons.length === 0 && <NoCouponsCard text={t("coupons.noValidCoupon")} />}
      <div className="couponsValidContainer">
        {validCoupons.length > 0 &&
          validCoupons
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
                validCoupons={true}
              />
            ))}
      </div>
      <div className="couponsContainer">
        {validCoupons.length > 5 ? <LoadMoreBtn onLoadMore={handleLoadMore} loadMore={loadMore} lang={lang} /> : null}
      </div>
    </>
  );
};
