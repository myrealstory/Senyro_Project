"use client";

import Image from "next/image";
import Warning from "@/images/icons/Icon_warning@3x.png";
import Check from "@/images/icons/Icon_tick_Gold@3x.png";

interface Props {
  isValid: boolean;
  errorMsg?: string;
  isCreditCardNumber?: boolean;

  // mobileVal: string;
}

export const RenderIcons = ({ isValid, isCreditCardNumber }: Props) => {
  return (
    <>
      <Image
        src={isValid === false ? Warning : Check}
        width={20}
        height={0}
        alt={isValid === false ? "Incorrect icon" : "Correct icon"}
        className={`absolute right-7 ${isValid ? "top-[40%]" : "top-[30%]"} h-auto 
        w-[18px] ${isCreditCardNumber && isValid ? "hidden" : ""}`}
      />
    </>
  );
};
