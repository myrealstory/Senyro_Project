import React, { useEffect, useState } from "react";
import Image from "next/image";

import MinusIconGold from "@/../images/icons/Icon_minus_Gold@3x.png";
import PlusIconGold from "@/../images/icons/Icon_plus_Gold@3x.png";

type QTYType = {
  qty?: number;
  spec?: number;
  limit: number;
  size: string;
  disabled?: boolean;
  soldOut?: boolean;
  color?: boolean;
  incrementAmount?: (() => void) | undefined;
  decrementAmount?: (() => void) | undefined;
};
export default function QTY({
  qty,
  limit,
  size,
  disabled,
  soldOut,
  spec,
  color,
  incrementAmount,
  decrementAmount,
}: QTYType) {
  const [buttonFunctional, setButtonFunctional] = useState([false, true]);

  useEffect(() => {
    const isStartButtonWork = qty !== 0;
    const isEndButtonWork = qty !== limit;
    setButtonFunctional([isStartButtonWork, isEndButtonWork]);
  }, [limit, qty]);

  const smSize = "text-[24px] leading-7";
  const mdSize = "text-[28px] leading-[33px]";
  const lgSize = "text-[40px] leading-[47px]";
  const smIconSize = "h-[24px] w-[24px]";
  const mdIconSize = "h-[35px] w-[35px]";
  const lgIconSize = "h-[52px] w-[52px]";
  const smButtonSize = "w-[148px] h-[52px]";
  const mdButtonSize = "w-[164px] h-[56px]";
  const lgButtonSize = "w-[240px] h-[84px]";

  const setFontStyle = (size: string) => {
    switch (size) {
      case "sm":
        return smSize;
      case "md":
        return mdSize;
      case "lg":
        return lgSize;
    }
  };
  const setIconStyle = (size: string) => {
    switch (size) {
      case "sm":
        return smIconSize;
      case "md":
        return mdIconSize;
      case "lg":
        return lgIconSize;
    }
  };
  const setButtonStyle = (size: string) => {
    switch (size) {
      case "sm":
        return smButtonSize;
      case "md":
        return mdButtonSize;
      case "lg":
        return lgButtonSize;
    }
  };

  const fontStyle = setFontStyle(size);
  const iconStyle = setIconStyle(size);
  const buttonStyle = setButtonStyle(size);
  return (
    <div
      className={`flex items-center rounded-2xl bg-white p-2 ${buttonStyle} ${
        soldOut ? "justify-center text-center opacity-10" : "justify-between"
      } ${disabled ? "pointer-events-none opacity-40" : ""}`}
    >
      {soldOut ? (
        <h3 className={`${fontStyle}`}>Sold Out</h3>
      ) : (
        <>
          <button
            onClick={decrementAmount}
            className={`${buttonFunctional[0] ? "" : "pointer-events-none opacity-[0.1]"}`}
          >
            <Image src={MinusIconGold} alt="" className={`${iconStyle}`} />
          </button>
          <span
            className={`w-5 text-center font-medium ${fontStyle} ${color ? "text-primaryGold" : "text-primaryDark"}`}
          >
            {spec ? spec : qty}
          </span>
          <button
            onClick={incrementAmount}
            className={`${buttonFunctional[1] ? "" : "pointer-events-none opacity-50"}`}
          >
            <Image src={PlusIconGold} alt="" className={`${iconStyle}`} />
          </button>
        </>
      )}
    </div>
  );
}
