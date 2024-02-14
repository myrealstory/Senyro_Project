"use client";

import React from "react";
import { ChipItem } from "@/types/form/formTypes";
import { useTranslation } from "@/app/i18n/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import MaleIcon from "@/images/icons/Icon_male.png";
import FemaleIcon from "@/images/icons/Icon_female.png";
import SelectedMale from "@/images/icons/Icon_Male-white@3x.png";
import SelectedFemale from "@/images/icons/Icon_Female-white@3x.png";
import { LocaleKeysType } from "@/app/i18n";

type Props = {
  item: ChipItem;
  editValue?: string;
  selectedChip: string;
  selectedIndx: number;
  disabledFemale: boolean;
  disabledMale: boolean;
  lang: LocaleKeysType;
  handleChipSelectClick: (i: number, e: React.MouseEvent<HTMLButtonElement>) => void;
};

const ChipUnit = ({
  item,
  editValue,
  selectedChip,
  selectedIndx,
  disabledFemale,
  disabledMale,
  lang,
  handleChipSelectClick,
}: Props) => {
  const IconStyle = "flex h-[55px] w-[55px] items-center justify-center rounded-full";
  const [isGenderSelected, setIsGenderSelected] = useState(false);
  const { translate: t } = useTranslation(lang);

  // if (item.name === "gender") {
  //   console.log(selectedChip, "selectedChip");
  //   console.log(isGenderSelected, item.name, item.id, item.label, "isGenderSelected");
  //   console.log(selectedIndx, "selectedIndx");
  //   console.log(item.tabIndex, "item.tabIndex");
  //   console.log(isGenderSelected, selectedIndx, item.tabIndex, "isGenderSelected");
  //   console.log(editValue, "editValue");
  // }

  useEffect(() => {
    if (editValue) {
      if (
        selectedChip.toLowerCase() === item.id.toLowerCase() ||
        selectedChip.toLowerCase() === item.label.toLowerCase()
      ) {
        setIsGenderSelected && setIsGenderSelected(true);
      } else {
        setIsGenderSelected && setIsGenderSelected(false);
      }
    }

    if (!editValue && item.name === "gender" && selectedIndx === item.tabIndex) {
      setIsGenderSelected && setIsGenderSelected(true);
    }

    if (!editValue && item.name === "gender" && selectedIndx !== item.tabIndex) {
      setIsGenderSelected && setIsGenderSelected(false);
    }

    if (!editValue) {
      if (item.name !== "gender") {
        if (selectedChip.toLowerCase() === item.label.toLowerCase()) {
          setIsGenderSelected && setIsGenderSelected(true);
        } else if (selectedChip.toLowerCase() !== item.label.toLowerCase()) {
          setIsGenderSelected && setIsGenderSelected(false);
        } else return;
      }
    }
  }, [selectedChip, selectedIndx, editValue, item.name, item.label, item.id, item.tabIndex]);

  const renderMaleOrFemaleIcon = (label: ChipItem) => {
    return (
      <>
        {label.label === "male" ? (
          <Image
            src={isGenderSelected ? SelectedMale : MaleIcon}
            width={0}
            height={0}
            alt="Male Icon"
            className="block h-auto w-[10px] self-center"
          />
        ) : (
          <Image
            src={isGenderSelected ? SelectedFemale : FemaleIcon}
            width={0}
            height={0}
            alt="Female Icon"
            className="block h-auto w-[14px] self-center"
          />
        )}
      </>
    );
  };

  return (
    <button
      disabled={(item.label === "female" && disabledFemale) || (item.label === "male" && disabledMale) ? true : false}
      className={`chipBasicStyle
      ${isGenderSelected && "chip-Selected"}
    
      ${item.label === "male" || item.label === "female" ? IconStyle : ""} 
      ${item.label === t("personalInfo.undisclosed") && "rounded-[40px] px-4"} 
      ${
        item.label === t("personalInfo.yes") ||
        item.label === t("personalInfo.no") ||
        item.label === "繁中" ||
        item.label === "English"
          ? "chipBtn"
          : ""
      }`}
      name={item.name}
      id={item.id}
      value={item.label}
      key={item.id}
      aria-label={item.label}
      onClick={e => handleChipSelectClick(item.tabIndex, e)}
    >
      {item.label !== "male" && item.label !== "female" && <span>{item.label}</span>}
      {item.label === "male" && renderMaleOrFemaleIcon(item)}
      {item.label === "female" && renderMaleOrFemaleIcon(item)}
    </button>
  );
};

export default ChipUnit;
