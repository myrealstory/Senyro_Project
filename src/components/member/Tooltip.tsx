"use client";

import Image from "next/image";
import alertIcon from "@/images/icons/Icon_tooltip.png";

interface TooltipProp {
  width: number;
  onTooltipClick?: (...params: any) => any;
}

export const Tooltip = ({ width, onTooltipClick }: TooltipProp) => {
  return (
    <div className="absolute right-5 top-0 z-99 flex h-full w-7 cursor-pointer items-center">
      <div
        role="button"
        className="h-7 object-cover"
        onMouseEnter={() => {
          if (width > 500) {
            onTooltipClick && onTooltipClick(true);
          }
        }}
        onMouseLeave={() => {
          if (width > 500) {
            onTooltipClick && onTooltipClick(false);
          }
        }}
        onClick={() => {
          if (width < 500) {
            onTooltipClick && onTooltipClick(true);
          }
        }}
      >
        <Image src={alertIcon} alt="" width={0} height={0} sizes="100vw" className="h-full w-full object-cover" />
      </div>
    </div>
  );
};
