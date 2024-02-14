"use client";

import Link from "next/link";
import { Disclaimer } from "@/components/member/Disclaimer";
import { LocaleKeysType } from "@/app/i18n";
import { useGetSingleCouponLazyQuery, useGetSingleCouponQuery } from "@/redux/api/memberApi";
import { SingleCouponCard } from "@/components/member/SingleCouponCard";
import { CouponQRCodeCard } from "@/components/member/CouponQRCodeCard";
import { ROUTES } from "@/constants";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hook/useWindowSize";

export const ValidCouponContainer = ({ couponId, lang }: { couponId: string; lang: LocaleKeysType }) => {
  const { data: singleCouponResponse, isSuccess } = useGetSingleCouponQuery(couponId);
  const [ isComponentReady, setIsComponentReady ] = useState(false);
  const [couponRequest] = useGetSingleCouponLazyQuery();
  const { width } = useWindowSize();
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const profile = useSelector((state: RootState) => state.profile);
  const couponDetails = singleCouponResponse?.data;
  const { memberNo = "", tierExpiryDate = "", memberTier = "" } = profile;
  const { translate: t } = useTranslation(lang);
  const isMobileView = width < 768;

  const onlineTakeawayTag = couponDetails?.channels?.length === 1 && couponDetails?.channels[0] === "onlineTakeaway";

  const CouponDisclaimers = [
    t("transactionDisclaimer.remarks1"),
    t("transactionDisclaimer.remarks3"),
    t("transactionDisclaimer.remarks4"),
    t("transactionDisclaimer.remarks5"),
  ];

  const fetchQrcode = (id: string) => {
    couponRequest(id)
      .unwrap()
      .then(res => {
        if (res.statusCode === 200 && res.data.qrcodeStr?.length) {
          return;
        }
        return Promise.reject({
          status: res.statusCode,
          error: res,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Fetch couponRequest every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQrcode(couponId);
    }, 900000);
    setIntervalId(interval);
    return () => clearInterval(interval);
  }, [couponId]);

  useEffect(() => {
    if (isSuccess) {
      setIsComponentReady(true);
    }
  }, [isSuccess])

  const handleRefreshQrcode = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    fetchQrcode(couponId);

    const interval = setInterval(() => {
      fetchQrcode(couponId);
    }, 900000);

    setIntervalId(interval);
  };

  if (!isComponentReady) {
    return <></>;
  }

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
        />
      ) : null}
      {onlineTakeawayTag ? null : (
        <div className="couponQRCodeContainer" typeof="button" onClick={handleRefreshQrcode}>
          <CouponQRCodeCard
            memberNo={memberNo}
            memberTier={memberTier}
            tierExpiryDate={tierExpiryDate}
            lang={lang}
            couponId={couponId}
          />

          <Link href={`/${lang}/${ROUTES.PAY_WITH_CARDS}/${couponId}`}>{t("couponQRCode.payWithCard")}</Link>
        </div>
      )}
      <Disclaimer title={t("transactionDisclaimer.title")} remarks={CouponDisclaimers} />
    </section>
  );
};
