"use client";

import Image from "next/image";
import Chevron from "@/images/icons/chervon-for-select.png";
import { useId, useState, useRef, useEffect } from "react";
import { LocaleKeysType } from "@/app/i18n";
// import { useWindowSize } from "@/hook/useWindowSize";
import "@/style/scrollBar/scrollBar.css";
import { toTitleCase } from "./FormattedUtils";
import { useTranslation } from "@/app/i18n/client";
import { getLangFromString } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";

interface ITextMap {
  [key: string]: {
    [subKey: string]: string;
  };
}

interface SelectProps {
  items?: string[];
  id: string;
  lang?: LocaleKeysType;
  name: string;
  labelText?: string;
  selectVal?: string;
  defaultSelectVal?: string;
  onCheckType?: () => void;
  onChange?: (name: string, value: string) => void;
  onChangeMap?: (name: string, value: string) => void;
  isClicked?: boolean;
  isSecondSelectDisabled?: boolean;
  countryCode?: string;
  path?: string;
  isFullModal?: boolean;
  onShow?: (index: number) => void;
  isActive?: boolean;
  disabled?: boolean;
  isMapRegionDisabled?: boolean;
  openModal?: boolean;
}

export const Select = ({
  items,
  id,
  selectVal,
  onCheckType,
  onChange,
  onChangeMap,
  isClicked,
  isSecondSelectDisabled,
  // labelText,
  defaultSelectVal,
  name,
  onShow,
  isActive,
  disabled,
  isMapRegionDisabled,
  // openModal,
  isFullModal,
}: // path,
SelectProps) => {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate: t } = useTranslation(lang);

  const optionTextObj: ITextMap = {
    default: {
      title: t("personalInfo.selectTitlePlaceHolder"),
      monthsWithNumbers: t("registrationStep2.month"),
      years: t("registrationStep2.year"),
      years2: t("transactions.YYYY"),
      monthWithEngText: t("transactions.MMM"),
      country: t("registrationStep2.selectLivingCountry"),
      contactEnquiry: t("contactUs.typeofEnquiryPlaceHolder"),
      regionWithoutAllArea: t("registrationStep2.livingRegion"),
      regionWithAllArea: t("storeLocator.dropdownDefualtArea"),
      districtWithoutAllDistrict: t("registrationStep2.livingDistrict"),
      districtWithAllDistrict: t("storeLocator.dropdownDefualtDistrict"),
      districtWithout: t("registrationStep2.livingDistrict"),
      campaignEnquiry: t("campaignPage.selectEventPlaceHolder"),
      numOfGuests: t("campaignPage.selectNumberOfGuestPlaceHolder"),
      numberOfGuests: t("campaignPage.selectNumberOfGuestPlaceHolder"),
      hours: t("campaignPage.HH"),
      minutes: t("campaignPage.MM"),
    },
  };
  // contactEnquiry: translate("contactUs.typeofEnquiryPlaceHolder"),

  const getOptionText = (id: string) => {
    return optionTextObj["default"]?.[id] || "";
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultSelectVal ? toTitleCase(defaultSelectVal) : getOptionText(id));
  const [isLoginContactClicked, setIsLoginContactClicked] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storeValue = localStorage.getItem("isLoginContactClicked");
      return storeValue === "true";
    }
  });
  const [isSubmitPageContactClicked, setIsSubmitPageContactClicked] = useState(() => {
    if (typeof localStorage !== "undefined") {
      const storedValue = localStorage.getItem("isContactClickedInRegisterSubmittedPage");
      return storedValue === "true";
    }
  });
  const [selectedTextSize] = useState(lang === "en" ? 13 : 17);
  const randomId = useId();
  const selectContainerRef = useRef<HTMLDivElement>(null);
  // const isContactClicked = useSelector((state: RootState) => state.generalState.isContactClicked);
  const [selectHeight, setSelectHeight] = useState(0);

  useEffect(() => {
    if (selectVal && isClicked) {
      setSelected(selectVal);
    }
    if (name === "districtCode" && selectVal === "") {
      setSelected(getOptionText(id));
    }

    if (
      selectVal === "" &&
      (name === "fromYear" ||
        name === "toYear" ||
        name === "fromMonth" ||
        name === "toMonth" ||
        (name === "region" && !defaultSelectVal) ||
        name === "district")
    ) {
      setSelected(getOptionText(id));
    }
  }, [selectVal, isClicked, name, id]);

  useEffect(() => {
    defaultSelectVal && setSelected(defaultSelectVal ? toTitleCase(defaultSelectVal) : getOptionText(id));
  }, []);

  useEffect(() => {
    if (!isLoginContactClicked || !isSubmitPageContactClicked) {
      setIsLoginContactClicked(false);
      setIsSubmitPageContactClicked(false);
    } else {
      setIsLoginContactClicked(true);
      setIsSubmitPageContactClicked(true);
    }
    if (lang === "en" && isLoginContactClicked && id === "contactEnquiry") {
      if (onChange) {
        setSelected("Account Login");
        onChange("contactEnquiry", "Account Login");
      }
    } else if (lang === "tc" && isLoginContactClicked && id === "contactEnquiry") {
      if (onChange) {
        setSelected("會員登入");
        onChange("contactEnquiry", "會員登入");
      }
    }

    if (lang === "en" && isSubmitPageContactClicked && id === "contactEnquiry") {
      if (onChange) {
        setSelected("Member Registration/ Recruitment");
        onChange("contactEnquiry", "Member Registration/ Recruitment");
      }
    } else if (lang === "tc" && isSubmitPageContactClicked && id === "contactEnquiry") {
      if (onChange) {
        setSelected("會員登記/募集");
        onChange("contactEnquiry", "會員登記/募集");
      }
    }

    return () => {
      localStorage.removeItem("isLoginContactClicked");
      localStorage.removeItem("isContactClickedInRegisterSubmittedPage");
    };
  }, [lang, id, isLoginContactClicked, isSubmitPageContactClicked, onChange]);

  useEffect(() => {
    if (isSecondSelectDisabled || isMapRegionDisabled) {
      setIsOpen(false);
    }
  }, [isSecondSelectDisabled, isMapRegionDisabled]);

  // useEffect(() => {
  //   if (selected.length > 15 && selected !== getOptionText(id)) setSelectedTextSize(12);
  //   else setSelectedTextSize(12);
  // }, [selected]);

  useEffect(() => {
    setSelectHeight((items && items?.length * 47) || 0);
  }, [items]);

  const handleItemClick = (item: string) => {
    setSelected(item);
    setIsOpen(false);

    if (onChange) onChange(name, item);
    if (onChangeMap !== undefined) onChangeMap(name, item);
  };

  const handleClick = () => {
    if (isSecondSelectDisabled || isMapRegionDisabled) return;

    if (onShow) {
      onShow(1);
    }

    if (disabled === true) {
      setIsOpen(false);
    } else {
      setIsOpen(!isOpen);
    }

    onCheckType && onCheckType();
  };

  useEffect(() => {
    // hide the dropdown if click outside dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (selectContainerRef.current && !selectContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={"relative flex w-full flex-col"} ref={selectContainerRef}>
        <div
          onClick={handleClick}
          className={`item-center flex h-[48px] w-full items-center justify-between rounded-full border border-primaryGold px-1 py-2
        ${disabled === true || isSecondSelectDisabled ? "" : "cursor-pointer"}
        ${isSecondSelectDisabled ? "bg-[#DDD7CE]" : ""}
       
        ${
          id === "numberOfGuests" || id === "hours" || id === "minutes" || id === "campaignEnquiry" ? "z-[0]" : "z-[31]"
        }
        ${
          ((id === "monthsWithNumbers" || (id === "years" && isSecondSelectDisabled)) && defaultSelectVal) ||
          (isSecondSelectDisabled && id === "districtWithAllDistrict") ||
          isMapRegionDisabled
            ? "bg-primaryGold/20 font-semibold text-primaryGold "
            : "bg-transparent"
        }
        `}
        >
          <span
            className={` flex items-center pl-4 pt-[2px] leading-5 ${
              selected !== getOptionText(id)
                ? "font-semibold text-primaryDark"
                : "text-16 font-medium tracking-[-0.44px] text-primaryGold/40"
            } ${
              selected === getOptionText(id) && (id === "regionWithAllArea" || id === "districtWithAllDistrict")
                ? "text-16 font-medium tracking-[0.5px] text-primaryGold/40 lg:pl-6 lg:text-17"
                : ""
            }
            text-[${selectedTextSize}px] ${
              (id === "monthsWithNumbers" || (id === "years" && isSecondSelectDisabled)) && defaultSelectVal
                ? "text-primaryGold text-opacity-90"
                : ""
            }`}
          >
            {selected}
          </span>
          <Image
            src={Chevron}
            width={0}
            height={0}
            alt="Click to open dropdown list"
            className={`mr-[5px] h-[20px] w-[20px] ${isOpen && isActive ? "rotate-180" : "rotate-0"}`}
          />
        </div>
        <ul
          style={{ display: isOpen ? "block" : "none" }}
          className={`select-scrollbar absolute z-40 flex w-full flex-col gap-1 overflow-y-scroll rounded-b-[20px] border-none bg-white shadow-lg 
          ${
            (id === "regionWithAllArea" || id === "districtWithAllDistrict") && !isFullModal
              ? `${
                  items && items?.length > 3 ? "top-[-200px]" : "top-[-150px]"
                } border-0 lg:top-[50px] h-[${selectHeight}px] max-h-[188px] `
              : "top-[60px] max-h-[188px] overflow-y-scroll border"
          } `}
        >
          {items &&
            isActive &&
            items.map(item => (
              <li
                key={`${item}-${randomId}`}
                className={`cursor-pointer border-lightGrey bg-opacity-25 py-[8px] hover:bg-primaryGold05
            ${"flex h-[47px] items-center border-b-[0.2px] border-opacity-[50%] px-5"}
            `}
                onClick={() => handleItemClick(item)}
              >
                <span className="text-12 leading-5 ">{item}</span>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};
