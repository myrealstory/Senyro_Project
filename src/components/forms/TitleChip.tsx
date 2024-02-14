"use client";

import { ChipItem } from "@/types/form/formTypes";
import { useState, MouseEvent } from "react";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/component/formComponents.scss";

interface Props {
  items: ChipItem[];
  labelFor: string;
  editValue?: string;
  path?: string;
  lang: LocaleKeysType;
  buttonClass?: string;
  onCheckType: () => void;
  onChange: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const TitleChip = ({ items, onCheckType, onChange, buttonClass, editValue, lang }: Props) => {
  const [chipSelected, setChipSelected] = useState(editValue ? editValue : "");
  const [, setSelectedIndex] = useState<number | null>(null);

  const handleChipSelect = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    onCheckType();

    setChipSelected(value);
    setSelectedIndex(i);
    onChange(e);
  };

  return (
    <div className="titleChipContainer">
      <div className="titleChipButtonContainer">
        {items.map((item, index) => (
          <button
            className={`titleChipButton ${
              (lang === "en" && chipSelected === item.label && "titleChipButtonSelected") ||
              (lang === "tc" && chipSelected === item.labelTC && "titleChipButtonSelected")
            } 
          
            ${buttonClass}
            `}
            value={lang === "en" ? item.label : item.labelTC}
            key={index}
            aria-label={lang === "en" ? item.label : item.labelTC}
            tabIndex={item.tabIndex}
            name={item.name}
            onClick={e => handleChipSelect(item.tabIndex, e)}
          >
            {lang === "tc" ? item.labelTC : item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
