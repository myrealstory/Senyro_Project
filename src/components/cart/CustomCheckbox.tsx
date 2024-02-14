"use client";
import React, { useMemo } from "react";
import { CustomCheckboxType } from "@/types/componentTypes";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";

export default function CustomCheckbox({
  label,
  description,
  onCheck,
  children,
  isChecked,
  disable,
  containerClasses,
  extraInfo,
}: CustomCheckboxType) {
  const newContainerClasses = useMemo(() => {
    const style = `relative flex flex-col rounded-2xl px-4 py-[15px] md:py-[0.78vw] bg-transparent bg-white after:border-secondaryLightGold1 after:absolute after:top-0 after:left-0 after:rounded-2xl after:bg-transparent after:inset-0 shadow-[0_4px_12px_0px] shadow-[#8D7A5B33]
      ${disable ? "cursor-default opacity-40" : "cursor-pointer"}
      ${isChecked ? "after:border-2 after:border-primaryDark" : "after:border "}
      ${containerClasses}
    `;
    return style;
  }, [disable, isChecked]);

  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  const renderTopRightInfo = () => {
    if (disable) {
      return (
        <div className="flex max-w-[190px] items-center gap-[8px] rounded-full bg-primaryGold px-3 py-1">
          <span className="text-[13px] font-semibold leading-5 text-white whitespace-nowrap">
            {translate("SingleProduct.notAvailable")}
          </span>{" "}
        </div>
      );
    }
    if (extraInfo?.topRightText) {
      return extraInfo?.topRightText;
    }
    return <></>;
  };

  const rednerBottomText = () => {
    const div = (children: string | JSX.Element) => (
      <div className={"flex w-full"}>
        <div className="grid w-[10%]" />
        <div className="w-[90%] md:w-full md:text-xl">{children}</div>
      </div>
    );
    if (extraInfo?.bottomText) {
      return div(extraInfo?.bottomText);
    }

    return <></>;
  };

  return (
    <label>
      <div className={newContainerClasses}>
        <span
          className={`absolute left-5 top-1/2 mr-6 block h-[20px] w-[20px] -translate-y-1/2 justify-self-center rounded-full border-[1.5px] border-primaryGold bg-secondaryLightGold2 after:absolute after:left-1/2 after:top-1/2 after:h-[12px] after:w-[12px] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-primaryGold after:content-[''] md:left-8 ${
            isChecked ? "after:block" : "after:hidden"
          }`}
        ></span>
        <div
          className={`flex w-full items-center  justify-between ${
            isChecked ? "border-secondaryLightGold1" : null
          } md:justify-between`}
        >
          <div className="grid w-[10%]"></div>
          <div className="w-[90%] text-10 md:w-full">
            <div className="flex w-full items-center justify-end md:hidden">{renderTopRightInfo()}</div>
            <div className="mb-1 flex items-center justify-between leading-5 md:mb-2 md:leading-6">
              <h4 className="overflow-hidden text-ellipsis whitespace-nowrap text-18 font-semibold md:text-16  xl:text-18">
                {label}
              </h4>
              <div className="hidden md:flex">{renderTopRightInfo()}</div>
            </div>
            {description}
          </div>
          <input
            type="radio"
            checked={isChecked}
            onChange={() => onCheck && onCheck()}
            className="hidden"
            id={label}
            disabled={disable}
          />
        </div>

        {rednerBottomText()}

        <div
          className={`flex w-full items-center justify-between ${
            isChecked ? "border-secondaryLightGold1" : null
          } md:justify-between`}
        >
          <div className="grid w-[10%]" />
          <div className="w-[90%] md:w-full md:text-xl">{isChecked && children}</div>
        </div>
      </div>
    </label>
  );
}
