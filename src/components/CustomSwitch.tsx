"use client";
import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { CustomSwitchType } from "@/types/componentTypes";
import { getLangFromString } from "@/utils/commonUtils";
import {
  setIsPopupOpen,
  setIsSwitchOfLang,
  setIsClickedLangSwitch,
  setLoadingScreenDisplay,
} from "@/redux/slice/generalStateSlice";

export const CustomSwitch = ({ type, label, mobile, pick, onClick }: CustomSwitchType) => {
  const path = usePathname();
  const searchParams = useSearchParams();
  const lang = getLangFromString(path);
  const dispatch = useDispatch();
  const [langText, setLangText] = React.useState<"中" | "EN">(lang === "en" ? "EN" : "中");
  const { isLoadingScreenDisplay } = useSelector((state: RootState) => state.generalState);

  useEffect(() => {
    if (isLoadingScreenDisplay === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isLoadingScreenDisplay]);

  const toogleSwitch = () => {
    let query = "";
    const targetLang = lang === "en" ? "tc" : "en";
    dispatch(setLoadingScreenDisplay(true));
    setLangText(langText === "EN" ? "中" : "EN");
    dispatch(setIsSwitchOfLang(lang === "en" ? true : false));
    dispatch(setIsPopupOpen(false));
    dispatch(setIsClickedLangSwitch(true));

    searchParams.forEach((value, key) => {
      if (!query.length) {
        query += "?";
      } else {
        query += "&";
      }
      query += `${key}=${value}`;
    });
    window.location.href = path.replace(`/${lang}/`, `/${targetLang}/`) + query;
  };

  return (
    <>
      {type === "language" ? (
        <button onClick={toogleSwitch} className="customSwitchContainer">
          <div
            className={`switchBody ${lang === "tc" ? "tcBox" : "enBox"}
            `}
          >
            <span>{langText}</span>
            <div className={"dot"} />
          </div>
        </button>
      ) : (
        <div></div>
      )}
      {type === "add-on" ? (
        <>
          <div className={`addonContainer ${mobile ? "mobile" : "desktop"}  `}>
            <button
              className={`
              ${pick ? "pick" : "unpick"} addOnButton `}
              onClick={() => {
                if (onClick) {
                  onClick();
                }
              }}
            >
              <div className={" dot"}></div>
            </button>
            <span>{label}</span>
          </div>
          {/*mobile here*/}
          {/* <div className="flex w-full items-center justify-between py-4 md:hidden ">
            <span className="text-[16px] font-normal leading-[22.4px] text-primaryDark">{label}</span>
            <button
              className={`
              ${
                pick ? "justify-end bg-primaryGold" : "justify-start bg-lightGrey"
              } flex h-[23px] w-[40px] items-center rounded-full p-[3px]`}
              onClick={() => {
                if (onClick) {
                  onClick();
                }
              }}
            >
              <div className={"h-full w-[16px] rounded-full bg-white"}></div>
            </button>
          </div> */}
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default CustomSwitch;
