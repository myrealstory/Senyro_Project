import { LocaleKeysType } from "@/app/i18n";
import { CouponContainer } from "@/components/member/CouponContainer";
import { Metadata } from "next";
import "@/style/member/member.scss";

export const metadata: Metadata = {
  title: "Coupons",
};

export default function CouponsPage({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <div>
      <CouponContainer lang={params.lang} />
    </div>
  );
}
