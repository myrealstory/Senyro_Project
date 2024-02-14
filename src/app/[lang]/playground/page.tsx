"use client";
import { MobileBottomSheet } from "@/components/MobileBottomSheet";

export default function Playground() {
  return (
    <MobileBottomSheet
      onProcess={function (...params: any) {
        throw new Error("Function not implemented.", params);
      }}
    />
  );
}
