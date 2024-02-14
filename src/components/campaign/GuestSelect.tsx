"use client";

import { SelectProps } from "@/types/form/formTypes";
import { ChangeEvent, useState } from "react";

export const GuestSelect = ({
  items,
  onChange,
  onCheckType,
}: {
  items: SelectProps;
  path?: string;
  lang?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCheckType: () => void;
}) => {
  const [selected, setSelected] = useState<string>("");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    if (onChange !== undefined) onChange(e);
  };

  const selectStyle = `focusRing rounded-full border border-primaryGold bg-transparent py-3 ${
    selected ? "font-semibold text-primaryDark" : "text-primaryGold text-opacity-40"
  }`;
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={items.labelFor} className="labelText font-semibold leading-5">
        {items.labelText}
      </label>
      <select
        className={selectStyle}
        onChange={handleSelectChange}
        value={selected}
        onClick={onCheckType}
        name={items.name}
        id={items.id}
      >
        <option value="" hidden>
          {items.id === "numberOfGuests" && "- Select No. Of Guests -"}
        </option>
        {items.items &&
          items.items.map((item, index) => (
            <option value={item} key={index}>
              {item}
            </option>
          ))}
      </select>
    </div>
  );
};
