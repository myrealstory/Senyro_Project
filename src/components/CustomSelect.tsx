"use client";

import React, { useState, useMemo, useRef } from "react";
import Image from "next/image";
import downIcon from "@/images/icons/Icon_ArrowDown@3x.png";
import upIcon from "@/images/icons/Icon_ArrowUp@3x.png";
import warningIcon from "@/images/icons/Icon_warning@3x.png";
import closedIcon from "@/images/icons/Icon_Tick_Closed.png";
import { useWindowSize } from "@/hook/useWindowSize";
import { getLangFromString } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useComponentLostFocus } from "@/hook/useComponentLostFocus";

type CustomSelectType = {
  label: string;
  data: {
    label: string;
    value?: string | number;
  }[];
  buttonClasses?: string;
  iconClasses?: string;
  disable?: boolean;
  inactive?: boolean;
  value?: string | number;
  error?: string;
  hasError?: boolean;
  containerClasses?: string;
  displayArrow?: boolean;
  onChange?: (...params: any) => any;
  defaultButton?: boolean;
  defaultOnChange?: (...params: any) => any;
  mode?: "COUPON" | "DEFAULT";
  deleteSelector?: () => void;
};

export default function CustomSelect({
  label,
  data,
  buttonClasses,
  iconClasses,
  disable,
  inactive,
  value,
  error,
  hasError,
  containerClasses,
  displayArrow = true,
  onChange,
  defaultButton,
  defaultOnChange,
  mode,
  deleteSelector,
}: CustomSelectType) {
  const wrapperRef = useRef(null);
  const [isArrowUp, setIsArrowUp] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isExpandOptions, setIsExpandOptions] = useState(false);
  const { height, width } = useWindowSize();
  const selectorHeight = height - 500;
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  useComponentLostFocus(wrapperRef, () => {
    setIsArrowUp(false);
    setIsExpandOptions(false);
  });

  const newContainerClasses = useMemo(() => {
    return `w-full cursor-pointer ${containerClasses}`;
  }, [containerClasses]);

  const newButtonClasses = useMemo(() => {
    const defaultButtonClass = `${buttonClasses} focusRing`;
    // ${isSelected ? "" : ""}
    // ${hasError ? "errorRing border-primaryPurple" : "focusRing border-primaryGold"}
    // ${inactive ? "bg-primaryGold15 opacity-50" : ""}
    if (isSelected) return `${defaultButtonClass} selected`;
    if (hasError) return `${defaultButtonClass} errorRing error`;
    if (disable) return `${defaultButtonClass} disable`;
    if (inactive) return `${defaultButtonClass} inactive`;
    return `${defaultButtonClass}`;
  }, [isSelected, hasError, disable, inactive, buttonClasses]);

  const renderText = () => {
    let text = undefined;
    if (value !== undefined) {
      text = data.find(item => item.value === value)?.label;
      return text;
    }
    if (isSelected && value == undefined) {
      return data[0]?.label;
    }
    return label;
  };

  const rightSideIcon = () => {
    //todolist : add icon for coupon
    if (mode === "COUPON") {
      switch (true) {
        // case hasError:
        //   return (
        //     <React.Fragment>
        //       <Image
        //         src={warningIcon}
        //         alt="warningIcon"
        //         className={`${iconClasses ? iconClasses : "h-[12px] w-[13px] md:h-[21px] md:w-[23px]"}`}
        //       />
        //       <Image
        //         src={closedIcon}
        //         alt="closedIcon"
        //         className={`${iconClasses ? iconClasses : "h-[12px] w-[13px] md:h-[21px] md:w-[23px]"}`}
        //       />
        //     </React.Fragment>
        //   );
        //   break;
        case true && displayArrow && value !== undefined:
          return (
            <Image
              src={closedIcon}
              alt="closedIcon"
              className={`${iconClasses ? iconClasses : "h-5 w-5"}`}
              width={0}
              height={0}
              sizes="100vw"
            />
          );
          break;
        case !hasError && displayArrow && value === undefined:
          return (
            <Image
              src={isArrowUp ? upIcon : downIcon}
              alt="isArrowUp"
              className={`${iconClasses ? iconClasses : "h-[20px] w-[20px]"}`}
              width={0}
              height={0}
              sizes="100vw"
            />
          );
          break;
      }
    } else {
      switch (true) {
        case hasError:
          return (
            <Image
              src={warningIcon}
              alt="warningIcon"
              className={`${iconClasses ? iconClasses : "h-[12px] w-[13px] md:h-[21px] md:w-[23px]"}`}
              width={0}
              height={0}
              sizes="100vw"
            />
          );
          break;
        case !hasError && displayArrow:
          return (
            <Image
              src={isArrowUp ? upIcon : downIcon}
              alt="isArrowUp"
              className={`${iconClasses ? iconClasses : "h-[20px] w-[20px]"}`}
              width={0}
              height={0}
              sizes="100vw"
            />
          );
          break;
      }
    }
  };

  return (
    <div ref={wrapperRef} className={newContainerClasses}>
      <div
        role="button"
        className={`customSelectButton ${newButtonClasses} px-5 py-3 ${
          mode === "COUPON" ? "justify-between" : "justify-center"
        }
        ${value !== undefined || data !== undefined ? (hasError ? "error" : "selected") : "inactive"}`}
        onClick={() => {
          if (mode === "COUPON") {
            if (!inactive && value === undefined) {
              setIsArrowUp(!isArrowUp);
              setIsExpandOptions(!isExpandOptions);
            } else if (deleteSelector !== undefined && value !== undefined) {
              deleteSelector();
              setIsSelected(false);
            }
          } else {
            if (!inactive) {
              setIsArrowUp(!isArrowUp);
              setIsExpandOptions(!isExpandOptions);
            }
          }
        }}
      >
        <span className="w-[90%] overflow-hidden overflow-ellipsis whitespace-nowrap text-left text-13 leading-[18px] md:w-full md:pl-3">
          {renderText()}
        </span>

        {rightSideIcon()}
      </div>

      {!inactive && isExpandOptions && (
        <div className="relative w-full">
          <div className={"absolute top-0 z-50 mt-3 w-full "}>
            <div className="rounded-2xl rounded-t-none bg-white pr-[5px] shadow-xl">
              <ul
                className={
                  "custom-scrollbar divide-gray-200 relative h-full divide-y overflow-y-auto rounded-2xl rounded-t-none"
                }
                style={width < 768 ? { maxHeight: selectorHeight } : { maxHeight: "14rem" }}
              >
                {defaultButton && (
                  <li
                    onClick={() => {
                      if (!inactive) {
                        setIsArrowUp(false);
                        setIsExpandOptions(false);
                      }
                    }}
                  >
                    <button
                      className="z-60 relative w-full cursor-pointer border-lightGrey border-opacity-20 px-5 py-4 text-left leading-7 hover:bg-secondaryLightGold2"
                      onClick={() => {
                        setIsSelected(true);
                        defaultOnChange && defaultOnChange();
                      }}
                    >
                      {translate("cart.all")}
                    </button>
                  </li>
                )}
                {data &&
                  data.map((item, i) => {
                    return (
                      <li
                        key={i}
                        onClick={() => {
                          if (!inactive) {
                            setIsSelected(true);
                            setIsArrowUp(false);

                            setIsExpandOptions(false);
                          }
                        }}
                      >
                        <button
                          className={`z-60 relative w-full cursor-pointer border-lightGrey border-opacity-20 bg-white px-5 py-4 text-left leading-7 hover:text-primaryGold4 ${
                            value === item.value ? "font-semibold text-primaryGold" : ""
                          }`}
                          onClick={() => {
                            if (item.value === undefined) {
                              defaultOnChange && defaultOnChange();
                            } else {
                              onChange && onChange(item.value);
                            }
                          }}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      )}
      {hasError && mode !== "COUPON" && <p className="mb-2 mt-2 text-16 font-semibold text-primaryPurple">{error}</p>}
    </div>
  );
}
