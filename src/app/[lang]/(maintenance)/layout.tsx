"use client";

import { HeaderForErrPage } from "@/components/HeaderForErrPage";

import React from "react";

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={"relative bg-MainBG"}>
        <HeaderForErrPage />
        {children}
      </div>
    </>
  );
}
