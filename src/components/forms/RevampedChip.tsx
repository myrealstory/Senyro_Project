"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface ChipProps {
  unSelectAble?: boolean;
  items: {
    label: string;
    code: string | boolean | undefined;
    isIconButton?: boolean;
    iconSrc?: string | StaticImport;
    buttonStyle?: string;
    disabled?: boolean;
  }[];
  onClick: (...params: any) => any;
  value?: string | boolean;
  hasError?: boolean;
  error?: string;
}

export const RevampedChip = ({ unSelectAble, items, onClick, value, hasError, error }: ChipProps) => {
  const [selectedValue, setSelectedValue] = useState<string | boolean | undefined>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value])

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex gap-4">
        {items.map((item, index) => {
          if (item.code === undefined) {
            return <></>;
          }

          return (
            <div
              className={`chipBasicStyle flex cursor-pointer items-center justify-center
              ${item.disabled ? "opacity-50": ""}
              ${selectedValue === item.code && "chip-Selected"}
              ${hasError ? "border-primaryPurple" : "border-primaryGold"}
              ${item.buttonStyle}
              `}
              key={`${index}-${item.label}`}
              aria-label={item.label}
              onClick={() => {
                if (item.disabled) {
                  return;
                }
                let newValue: boolean | string | undefined = item.code;
                if (unSelectAble && item.code === selectedValue) {
                  newValue = undefined;
                }

                onClick && onClick(newValue);
                setSelectedValue(newValue);
              }}
            >
              {item.isIconButton && item.iconSrc ? (
                <Image
                  src={item.iconSrc}
                  width={0}
                  height={0}
                  alt="Gender Icon"
                  className="block h-auto w-[10px] self-center"
                />
              ) : (
                item.label
              )}
            </div>
          );
        })}
      </div>
      {hasError && error && error?.length > 0 && (
        <span className={"mt-2 text-14 font-semibold text-primaryPurple md:text-xl"}>{error}</span>
      )}
    </div>
  );
};
