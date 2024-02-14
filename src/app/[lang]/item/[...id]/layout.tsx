"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { LocaleKeysType } from "@/app/i18n";
import { SetProductPopup } from "@/components/product/SetProductPopup";
import CartPickup from "@/components/cart/CartPickup";
import { closeAllPopup } from "@/redux/slice/generalStateSlice";
export default function IndexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const { isSetProductPopupOpen, isCartPickupOpen } = useSelector((state: RootState) => state.generalState);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(closeAllPopup())
    }
  }, [])

  return (
    <>
      {isSetProductPopupOpen === true && <SetProductPopup />}
      {isCartPickupOpen.isOpen === true && <CartPickup lang={params.lang} mode="NEW" />}

      <section>{children}</section>
    </>
  );
}
