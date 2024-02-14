"use client";

import { LocaleKeysType } from "@/app/i18n";
import { InboxAndEdit } from "@/components/member/InboxAndEdit";
import { Sidebar } from "@/components/member/Sidebar";
import { useWindowSize } from "@/hook/useWindowSize";
import { useGetCouponsQuery } from "@/redux/api/memberApi";
import { RootState } from "@/redux/store";
import "@/style/member/member.scss";
import { useSelector } from "react-redux";

export default function CouponLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const { data: couponsResponse, isSuccess } = useGetCouponsQuery();
  const profileData = useSelector((state: RootState) => state.profile);
  const { width } = useWindowSize();

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
          {width >= 1024 && <InboxAndEdit lang={params.lang} />}
          {children}
        </div>
      </section>
    </main>
  );
}
