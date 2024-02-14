"use client";

import { useEffect, useState } from "react";
import { ValidCouponCard } from "./ValidCouponCard";
import { ExpiredCouponCard } from "./ExpiredCouponCard";
import { CustomTab } from "./CustomTab";
import { useGetCouponsQuery } from "@/redux/api/memberApi";
import { LocaleKeysType } from "@/app/i18n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTranslation } from "@/app/i18n/client";
import { useWindowSize } from "@/hook/useWindowSize";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import "@/style/member/member.scss";

export const CouponContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const [mode, setMode] = useState(lang === "en" ? "Available" : "可用");
  const [isNavbarAtTop, setIsNavbarAtTop] = useState(false);
  const { data: couponsResponse, isSuccess } = useGetCouponsQuery();
  const { translate: t } = useTranslation(lang);
  const { width } = useWindowSize();
  const couponCount = useSelector((state: RootState) => state.generalState.couponCount);
  const dispatch = useDispatch();


  const handleModeChange = (mode: string) => {
    setMode(mode);
  };

  const renderContent = () => {
    if (mode) {
      if ((isSuccess && mode === "Available") || (isSuccess && mode === "可用")) {
        return <ValidCouponCard lang={lang} validCoupons={couponsResponse?.data.activeCouponList || []} />;
      } else if (mode === "Used/Expired" || mode === "已使用/已過期") {
        return <ExpiredCouponCard lang={lang} expiredCoupons={couponsResponse?.data.inActiveCouponList || []} />;
      }
    }
    return null;
  };

  useEffect(() => {
    if (window !== undefined) {
      window.onscroll = () => {
        if (window.scrollY > 25) {
          setIsNavbarAtTop(false);
        }
        setIsNavbarAtTop(true);
      };
      return () => {
        window.onscroll = null;
      };
    }
  }, []);

  useEffect(() => {
    dispatch(setLoadingScreenDisplay(false));
  }, [couponsResponse]);

  if (couponsResponse?.statusCode !== 200) {
    return <></>;
  }

  return (
    <div className="couponPageContainer">
      <div className={`sticky top-[60px] z-99 ${width <= 768 ? "bg-MainBG" : null} lg:static`}>
        <CustomTab
          onChange={handleModeChange}
          mode={mode}
          tabs={[t("coupons.valid"), t("coupons.usedOrExpired")]}
          counts={[couponCount && couponCount?.activeCount, couponCount && couponCount?.expiredCount]}
          isNavbarTop={isNavbarAtTop}
        />
      </div>
      {renderContent()}
    </div>
  );
};
