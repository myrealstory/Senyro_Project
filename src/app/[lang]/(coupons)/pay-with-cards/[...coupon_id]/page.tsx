import { LocaleKeysType } from "@/app/i18n";
import { PayWithCards } from "@/components/member/PayWithCards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay with Cards",
};

export default function PayWithCardsForCouponPage({ params }: { params: { coupon_id: number; lang: LocaleKeysType } }) {
  return <PayWithCards lang={params.lang} />;
}
