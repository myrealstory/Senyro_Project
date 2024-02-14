import "@/style/member/member.scss";
import { ValidCouponContainer } from "@/components/member/ValidCouponContainer";
import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valid Coupon",
};

export default function SingleValidCouponPage({ params }: { params: { coupon_id: string; lang: LocaleKeysType } }) {
  return <ValidCouponContainer couponId={params.coupon_id} lang={params.lang} />;
}
