"use client";
import React from "react";
import { useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { LocaleKeysType } from "@/app/i18n";
import { SetProductPopup } from "@/components/product/SetProductPopup";

export default function AddonLayout({ children }: { children: React.ReactNode; params: { lang: LocaleKeysType } }) {
  const { isSetProductPopupOpen } = useSelector((state: RootState) => state.generalState);

  return (
    <>
      {/* set product */}
      {isSetProductPopupOpen === true && <SetProductPopup />}

      <section className="h-[100svh] md:h-auto">{children}</section>
    </>
  );
}
