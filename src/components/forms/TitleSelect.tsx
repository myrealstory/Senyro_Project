"use client";

import { SelectProps } from "@/types/form/formTypes";
import { useState, ChangeEvent } from "react";

interface Props {
  items: SelectProps;
  storeValue?: string;
  path?: string;
  lang?: string;
  onCheckType: () => void;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TitleSelect = ({ items, path, lang, onChange, onCheckType }: Props) => {
  const [selected, setSelected] = useState<string>("");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (onChange !== undefined) onChange(e);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={items.labelFor}
        className=" text-[14px] font-semibold leading-7 text-primaryDark lg:text-primaryGold"
      >
        {items.labelText}
      </label>
      <div className="relative w-full">
        <select
          onClick={onCheckType}
          name={items.name}
          id={items.id}
          className={` h-[50px]
        ${
          path === `${lang}/store-location` && selected === ""
            ? "bg-transparent font-medium text-primaryGold text-opacity-40"
            : " font-semibold text-primaryDark"
        }
        ${selected === "" ? "bg-transparent text-primaryGold text-opacity-40" : ""}
        h-full w-full rounded-full border-[1px] border-primaryGold px-[20px] py-[11px] text-[14px]  focus:border-primaryGold focus:outline-none focus:ring-1 focus:ring-primaryGold md:h-[50px]`}
          onChange={handleSelectChange}
          value={selected}
        >
          <option value="" hidden>
            {items.id === "title" && "- Select Title -"}
          </option>
          {items.items &&
            items.items.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};
