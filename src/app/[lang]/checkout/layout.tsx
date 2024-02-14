"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CartPickup from "@/components/cart/CartPickup";
import { RootState } from "@/redux/store";
import { LocaleKeysType } from "@/app/i18n";
import { CreditCardInfoPopUp } from "@/components/checkout/CreditCardInfoPopUp";
import { closeAllPopup } from "@/redux/slice/generalStateSlice";

export default function CheckoutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const { isOpen } = useSelector((state: RootState) => state.generalState.isCartPickupOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(closeAllPopup())
    }
  }, [])

  return (
    <>
      {isOpen === true && <CartPickup lang={params.lang} mode={"EDIT"} />}
      <CreditCardInfoPopUp />
      <section>{children}</section>
    </>
  );
}
