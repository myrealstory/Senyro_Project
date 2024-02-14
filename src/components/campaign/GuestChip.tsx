"use client";

import { ChipProps } from "@/types/form/formTypes";
import { MouseEvent, useState } from "react";

interface Props {
  items: ChipProps;
  storeValue?: string;
  path?: string;
  lang?: string;
  buttonClass?: string;
  onCheckType?: () => void;
  onChange: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const GuestChip = ({ items, onChange, lang }: Props) => {
  const [, setChipGuestSelected] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleChipSelect = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setChipGuestSelected(e.currentTarget.value);
    setSelectedIndex(i);
    onChange(e);
  };

  return (
    <div className="flex w-full flex-col gap-1">
      <label
        htmlFor={items.title}
        className="text-[14px] font-semibold leading-5 text-primaryDark lg:text-primaryGold xl:text-[16px]"
      >
        {lang === "en" ? items.title : "活動人數*"}
      </label>
      <div className="flex w-full justify-between">
        {items.items.map((item, index) => (
          <button
            className={`${
              selectedIndex === index ? "bg-primaryGold font-semibold text-white" : "bg-transparent text-primaryGold "
            } w-[30%] rounded-full  border border-primaryGold py-[18px]  text-[20px] leading-4`}
            key={item.id}
            value={item.label}
            aria-label={item.label}
            tabIndex={item.tabIndex}
            name={item.name}
            id={item.id}
            onClick={e => handleChipSelect(item.tabIndex, e)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
