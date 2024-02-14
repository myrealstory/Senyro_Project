// "use client";

import { LocaleKeysType } from "@/app/i18n";
import { ExpiredCouponContainer } from "@/components/member/ExpiredCouponContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expired Coupon",
};

export default function SingleExpiredCouponPage({ params }: { params: { coupon_id: string; lang: LocaleKeysType } }) {
  return <ExpiredCouponContainer couponId={params.coupon_id} lang={params.lang} />;
}
