"use client";
import React from "react";
import { useSelector } from "react-redux";

import CartPickup from "@/components/cart/CartPickup";
import { RootState } from "@/redux/store";
import { LocaleKeysType } from "@/app/i18n";
import { SetProductPopup } from "@/components/product/SetProductPopup";
import { Loading } from "@/components/Loading";

export default function CartLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const { isCartPickupOpen, isSetProductPopupOpen, isLoadingScreenDisplay } = useSelector((state: RootState) => state.generalState);

  return (
    <>
      {isLoadingScreenDisplay && <Loading />}
      {isCartPickupOpen.isOpen === true && <CartPickup lang={params.lang} mode="EDIT" />}
      {/* set product */}
      {isSetProductPopupOpen === true && <SetProductPopup />}

      <section>{children}</section>
    </>
  );
}
