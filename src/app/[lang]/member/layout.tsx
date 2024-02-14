"use client";

import CartPickup from "@/components/cart/CartPickup";
import { Sidebar } from "@/components/member/Sidebar";
// import { Profile } from "@/components/member/Profile";
import { LocaleKeysType } from "@/app/i18n";
import { useLayoutEffect, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetCouponsQuery, useGetProfileQuery } from "@/redux/api/memberApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCouponCount } from "@/redux/slice/generalStateSlice";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { InboxAndEdit } from "@/components/member/InboxAndEdit";
import { useWindowSize } from "@/hook/useWindowSize";
import { CreditCardInfoPopUp } from "@/components/checkout/CreditCardInfoPopUp";
import "@/style/member/member.scss";

export default function MemberLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const route = useRouter();
  const path = usePathname();
  const { data: profile } = useGetProfileQuery();
  const { data: couponsResponse, isSuccess } = useGetCouponsQuery();
  const { isCartPickupOpen } = useSelector((state: RootState) => state.generalState);
  const { selectedBranchCode } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const { width } = useWindowSize();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (isAlreadyLogin === true && path.startsWith("/login")) {
      route.push("/index");
    }
  }, [params.lang, path, route, isAlreadyLogin]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        setCouponCount({
          activeCount: couponsResponse?.data?.activeCouponCount,
          expiredCount: couponsResponse?.data?.inactiveCouponCount,
        })
      );
    }
  }, [couponsResponse?.data?.activeCouponCount, couponsResponse?.data?.inactiveCouponCount, dispatch, isSuccess]);

  return (
    <>
      {isCartPickupOpen.isOpen && (
        <CartPickup lang={params.lang} mode={selectedBranchCode !== undefined ? "EDIT" : "NEW"} />
      )}
      <main className="profileLayoutContainer">
        <section className="profileSidebarContainer">
          {profile?.statusCode === 200 ? (
            <Sidebar
              lang={params.lang}
              numberOfCoupons={isSuccess ? couponsResponse?.data?.activeCouponCount : 0}
              user={profile.data}
            />
          ) : null}
          <div className="w-full md:mx-auto md:max-w-[500px] lg:max-w-[670px]">
            {width >= 1024 && <InboxAndEdit lang={params.lang} />}
            <CreditCardInfoPopUp />
            {children}
          </div>
        </section>
      </main>
    </>
  );
}
