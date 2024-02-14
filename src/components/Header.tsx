"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "./Navbar";
import { ComponentType } from "@/app/[lang]/page";
import { useWindowSize } from "@/hook/useWindowSize";
import { useSelector } from "react-redux";
import { GetHeaderDisplay } from "@/utils/clientUtils";
import { usePathname } from "next/navigation";
import { RootState } from "@/redux/store";
import { PromotionBar } from "./index/PromotionBar";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { ROUTES } from "@/constants";
import { deleteCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { Loading } from "./Loading";
import { CouponResponseType, InboxUnreadCount } from "@/types/api/apiTypes";

export const Header = ({
  lang,
  inboxUnreadCount,
  coupon,
}: ComponentType & { inboxUnreadCount: InboxUnreadCount; coupon: CouponResponseType }) => {
  const heightRef = useRef<HTMLDivElement | null>(null);
  const [isPageReady, setIsPageReady] = useState(false);
  const path = usePathname();
  const slug = getRouteNameFromPathname(path);
  const { apiData } = useSelector((state: RootState) => state.cart);
  const { isLoadingScreenDisplay } = useSelector((state: RootState) => state.generalState);
  const isIndex = slug.secondSlug === ROUTES.INDEX;
  const isProduct = slug.secondSlug === ROUTES.PRODUCT;
  const { width } = useWindowSize();

  useEffect(() => {
    if (slug.secondSlug !== ROUTES.LOGIN) {
      deleteCookie(CookiesKey.addCartBeforeMemberLogin);
      deleteCookie(CookiesKey.targetPageToBeRedirectedTo);
    }
  }, []);

  useEffect(() => {
    if (width > 0) {
      setIsPageReady(true);
    }
  }, [width]);

  const headerPositionClasses = useMemo(() => {
    const style = {
      blankSpaceClasses: `${
        GetHeaderDisplay(width, slug.secondSlug, apiData.cart?.branch) === "fixed" ? "block" : "hidden"
      }`,
    };
    return style;
  }, [width, apiData.cart?.branch]);

  const promotionBarHeight = lang === "tc" ? 30 : 34;

  if (!isPageReady) {
    return <></>;
  }

  return (
    <>
      {isLoadingScreenDisplay && <Loading />}
      {(isIndex || isProduct) && <PromotionBar height={promotionBarHeight} showBar={true} lang={lang} />}
      <div id="header" className={"sticky left-0 top-0 z-[100] h-full"} ref={heightRef}>
        <Navbar lang={lang} inboxUnreadCount={inboxUnreadCount} coupon={coupon} />
      </div>
      <div className={`${!isIndex ? headerPositionClasses.blankSpaceClasses : "hidden"}`}></div>
    </>
  );
};
