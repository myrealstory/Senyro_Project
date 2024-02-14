"use client";

import { LocaleKeysType } from "@/app/i18n";
import { InboxAndEdit } from "@/components/member/InboxAndEdit";
import { Sidebar } from "@/components/member/Sidebar";
import { useGetCouponsQuery } from "@/redux/api/memberApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hook/useWindowSize";
import { ROUTES } from "@/constants";
import "@/style/member/member.scss";

export default function CouponLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const profileData = useSelector((state: RootState) => state.profile);
  const { data: couponsResponse, isSuccess } = useGetCouponsQuery();
  const { width } = useWindowSize();
  const path = usePathname();

  const pathIncludes =
    path.includes(`/${params.lang}/${ROUTES.COUPON_VALID}`) ||
    path.includes(`/${params.lang}/${ROUTES.COUPON_EXPIRED}`) ||
    path.includes(`/${params.lang}/${ROUTES.PAY_WITH_CARDS}`);

  return (
    <main className="profileLayoutContainer">
      <section className="profileSidebarContainer">
        {profileData ? (
          <Sidebar
            lang={params.lang}
            numberOfCoupons={isSuccess ? couponsResponse?.data?.activeCouponCount : 0}
            user={profileData}
          />
        ) : null}

        <div className="w-full md:mx-auto md:max-w-[600px]">
          {width >= 1024 && pathIncludes && <InboxAndEdit lang={params.lang} />}
          {children}
        </div>
      </section>
    </main>
  );
}
