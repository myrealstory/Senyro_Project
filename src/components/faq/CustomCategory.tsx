"use client";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useState } from "react";

interface CategoryProps {
  onChange: (category: string) => void;
  category: string;
  tabs: string[];
  lang?: LocaleKeysType;
}

type HoverStatusType = {
  [key: string]: boolean;
};

export const CustomCategory = ({ onChange, category, tabs, lang }: CategoryProps) => {
  const [hoverStatus, setHoverStatus] = useState<HoverStatusType>({});
  const handleHover = (linkTitle: string, isHovering: boolean) => {
    setHoverStatus(prev => ({ ...prev, [linkTitle]: isHovering }));
  };

  return (
    <div
      className={`my-4 flex w-full items-center px-4 
      ${
        category === "Membership" || category === "Privileges" || category === "Account"
          ? "mr-10 justify-center gap-3"
          : ` ${lang === "tc" ? "justify-center" : "justify-start lg:justify-center"}  md:gap-2 2xl:gap-1`
      }`}
    >
      {tabs.map(tab => (
        <div key={tab}>
          <a href={`#${tab.toLowerCase().replace(/ /g, "")}`} role="button">
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={` w-fit whitespace-nowrap rounded-full p-[10px] text-[12px] font-medium leading-4 sm:p-[12px] md:text-[16px] xl:px-[14px] xl:py-[16px] 2xl:text-[1.25rem] 2xl:font-normal ${
                category === tab || hoverStatus[tab] ? "bg-primaryGold text-primaryGold05 " : "text-primaryGold"
              }`}
              onMouseEnter={() => handleHover(tab, true)}
              onMouseLeave={() => handleHover(tab, false)}
            >
              {tab}
            </button>
          </a>
        </div>
      ))}
    </div>
  );
};
