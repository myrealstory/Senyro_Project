"use client";

import { useState, MouseEvent, useEffect, useRef } from "react";
import { ChipProps, GenderEnum } from "@/types/form/formTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import ChipUnit from "./ChipUnit";
import { useTranslation } from "@/app/i18n/client";

export const Chip = ({
  title,
  items,
  editValue,
  lang,
  onClick,
  setChipVal,
  isSuccess,
  path,
  titleNameIsChanged,
  setTitleNameIsChanged,
  reset,
}: ChipProps) => {
  const [selectedIndx, setSelectedIndx] = useState<number | null>(null);
  const [selectedChip, setSelectedChip] = useState(editValue ? editValue : "");
  const [disabledFemale, setDisabledFemale] = useState(false);
  const [disabledMale, setDisabledMale] = useState(false);
  const { translate: t } = useTranslation(lang as LocaleKeysType);

  const titleName = useSelector((state: RootState) => state.title.title);
  type chipValType = { gender: string; preferredLan: string; hasChild: string };
  const titleRef = useRef(titleName);

  useEffect(() => {
    if (reset) {
      setSelectedIndx(null);
      setSelectedChip("");
    }
  }, [reset]);

  useEffect(() => {
    if (titleName !== titleRef.current) {
      setTitleNameIsChanged && setTitleNameIsChanged(true);
    }
  }, [titleName, titleRef.current]);

  useEffect(() => {
    if (titleName === t("personalInfo.mr") && title === t("registrationStep2.gender")) {
      titleNameIsChanged && setSelectedIndx(GenderEnum.Male);
      setChipVal && setChipVal((preValue => ({ ...preValue, ["gender"]: "male" } as chipValType)));
      setDisabledFemale(true);
      setDisabledMale(false);
      titleNameIsChanged && setSelectedChip("male");
    }

    if (
      titleName === t("personalInfo.mrs") ||
      titleName === t("personalInfo.ms") ||
      (titleName === t("personalInfo.miss") && title === t("registrationStep2.gender"))
    ) {
      titleNameIsChanged && setSelectedIndx(GenderEnum.Female);
      setDisabledMale(true);
      setDisabledFemale(false);
      setChipVal && setChipVal((preValue => ({ ...preValue, ["gender"]: "female" } as chipValType)));
      titleNameIsChanged && setSelectedChip("female");
    }

    if (
      (titleName === t("personalInfo.dr") || titleName === t("personalInfo.prof")) &&
      title === t("registrationStep2.gender")
    ) {
      titleNameIsChanged && setSelectedIndx(null);
      setDisabledFemale(false);
      setDisabledMale(false);
      setChipVal && setChipVal((preValue => ({ ...preValue, ["gender"]: "Undisclosed" } as chipValType)));
      titleNameIsChanged && setSelectedChip("");
    }
  }, [titleName, titleNameIsChanged, title, setChipVal]);

  const handleChipSelectClick = (i: number, e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const value = e.currentTarget.value;

    setSelectedChip(value);
    onClick(e);
    setSelectedIndx(i);
  };

  useEffect(() => {
    isSuccess && editValue && setSelectedChip(editValue);
  }, [isSuccess, editValue]);

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex gap-4">
        {path !== `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` &&
          items.map(item => (
            <ChipUnit
              key={item.id}
              item={item}
              lang={lang as LocaleKeysType}
              selectedChip={selectedChip}
              selectedIndx={selectedIndx as number}
              disabledFemale={disabledFemale}
              disabledMale={disabledMale}
              handleChipSelectClick={handleChipSelectClick}
            />
          ))}

        {path === `/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}` &&
          isSuccess &&
          items.map(item => (
            <ChipUnit
              key={item.id}
              item={item}
              lang={lang as LocaleKeysType}
              editValue={editValue as string}
              selectedChip={selectedChip}
              selectedIndx={selectedIndx as number}
              disabledFemale={disabledFemale}
              disabledMale={disabledMale}
              handleChipSelectClick={handleChipSelectClick}
            />
          ))}
      </div>
    </div>
  );
};
