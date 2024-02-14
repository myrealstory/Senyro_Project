"use client";

import Image from "next/image";
import Chevron from "@/images/icons/chervon-for-select.png";
import { useState, useRef, useEffect } from "react";
import "@/style/scrollBar/scrollBar.css";
import { useComponentLostFocus } from "@/hook/useComponentLostFocus";

interface RevampedSelectType {
  items: {
    label: string;
    code: string | number | undefined | null;
    defaultLabel?: string | undefined | null;
  }[];
  onChange?: (...params: any) => any;
  disabled?: boolean;
  value?: string | number | undefined;
  hasError?: boolean;
  error?: string;
  forceDisplay?: boolean;
}

export const RevampedSelect = ({ items, onChange, disabled, value, hasError, error, forceDisplay }: RevampedSelectType) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDisplayDropDown, setIsDisplayDropDown] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined | null>(value);

  useEffect(() => {
    setSelectedValue(value);
  }, [value])

  useComponentLostFocus(
    wrapperRef,
    () => {
      if (isDisplayDropDown) {
        setIsDisplayDropDown(false);
        onChange && onChange(selectedValue);
      }
    },
    [isDisplayDropDown]
  );

  const renderSelectedLabel = () => {
    const found = items?.find(item => item.code === value ?? item.code === selectedValue);

    if (found) {
      return found.label;
    }
    return forceDisplay ? selectedValue : "error";
  };

  return (
    <>
      <div className={"relative flex w-full flex-col"} ref={wrapperRef}>
        <div
          onClick={() => !disabled && setIsDisplayDropDown(!isDisplayDropDown)}
          className={`item-center flex h-[50px] w-full justify-between rounded-full border px-2 py-3
          ${disabled ? "bg-[#DDD7CE]" : "cursor-pointer"}
          ${hasError ? "border-primaryPurple" : "border-primaryGold"}
          `}
        >
          <span
            className={` flex items-center pl-4 pt-[2px] leading-5 
            ${
              selectedValue !== undefined
                ? disabled
                  ? "font-semibold text-primaryGold"
                  : "font-semibold text-primaryDark"
                : "text-[14px] font-medium tracking-[-0.44px] text-primaryGold/40"
            }
            `}
          >
            {renderSelectedLabel()}
          </span>
          <Image
            src={Chevron}
            width={0}
            height={0}
            alt="Click to dropdown list"
            className={`mr-[5px] h-auto w-[23px] ${isDisplayDropDown ? "rotate-180" : "rotate-0"}`}
          />
        </div>
        <ul
          style={{ display: isDisplayDropDown ? "block" : "none" }}
          className={`select-scrollbar absolute top-[60px] z-40 flex max-h-[188px] w-full flex-col gap-1 overflow-y-scroll rounded-b-[20px] border 
          border-none bg-white shadow-lg`}
        >
          {items &&
            items.map((item, index) => {
              // skip if code === undefined
              if (!item.code && !item?.defaultLabel) {
                return null;
              }

              return (
                <li
                  key={`${item}-${index}`}
                  className={
                    "flex h-[47px] cursor-pointer items-center border-b-[0.2px] border-lightGrey border-opacity-[50%] bg-opacity-25 px-5 py-[8px] hover:bg-primaryGold05                    "
                  }
                  onClick={() => {
                    onChange && onChange(item.code);
                    setSelectedValue(item.code);
                    setIsDisplayDropDown(false);
                  }}
                >
                  <span className="text-[14px] leading-5 ">{item.label}</span>
                </li>
              );
            })}
        </ul>
        {hasError && error && error?.length > 0 && (
          <span className={"mt-2 text-14 font-semibold text-primaryPurple md:text-xl"}>{error}</span>
        )}
      </div>
    </>
  );
};
