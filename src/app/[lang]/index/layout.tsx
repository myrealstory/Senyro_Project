"use client";
import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import { SetProductPopup } from "@/components/product/SetProductPopup";
import { LocaleKeysType } from "@/app/i18n";
import { useWindowSize } from "@/hook/useWindowSize";
import { RootState } from "@/redux/store";
import CartPickup from "@/components/cart/CartPickup";
import gotoTop from "@/images/icons/Icon_up@3x.png";
import { Loading } from "@/components/Loading";

export default function IndexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const { isCartPickupOpen, isSetProductPopupOpen, isLoadingScreenDisplay } = useSelector(
    (state: RootState) => state.generalState
  );
  const { selectedBranchCode } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const { scrollY } = useWindowSize();

  return (
    <>
      {isLoadingScreenDisplay && <Loading />}
      {isCartPickupOpen.isOpen === true && (
        <CartPickup lang={params.lang} mode={selectedBranchCode !== undefined ? "EDIT" : "NEW"} />
      )}
      {scrollY > 150 && (
        <div>
          <button
            className="fixed bottom-[88px] right-4 z-[999] flex aspect-square h-auto w-full max-w-[48px] items-center justify-center rounded-full bg-white60 lg:bottom-8 lg:right-8 lg:max-w-[60px]"
            onClick={() => {
              typeof window !== undefined &&
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
            }}
          >
            <Image src={gotoTop} alt="gototop" width={0} height={0} className="h-auto w-1/2 object-cover " />
          </button>
        </div>
      )}

      {/* set product */}
      {isSetProductPopupOpen && <SetProductPopup />}

      <section>{children}</section>
    </>
  );
}
