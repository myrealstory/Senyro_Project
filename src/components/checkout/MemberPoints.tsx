import React, { useState, useRef, useMemo, useEffect } from "react";
import "./memberPoints.css";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type MemberPointsType = {
  value?: number;
  handleChange: (value: string | number) => void;
  onTextInput: (value: string | number) => void;
  maxValue: number;
  from: number;
  to: number;
  maxTo: number;
  onTouchEnd: (...params: any) => any; // on released on touch device
  onMouseUp: (...params: any) => any; // on mouse release
};
export const MemberPoints = ({
  value,
  handleChange,
  maxValue,
  onMouseUp,
  onTouchEnd,
  from,
  to,
  maxTo,
  onTextInput,
}: MemberPointsType) => {
  const { resetMemberPoint } = useSelector((state: RootState) => state.generalState);
  const unit = useMemo(() => 10, []);
  const inputRef = useRef<HTMLInputElement>(document.createElement("input"));
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const [theMid, setTheMid] = useState(0);
  const [inputValue, setInputValue] = useState("0");
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  const updateValue = (newValue: string, isTextInput?: boolean) => {
    const sum = Number(isTextInput ? newValue : inputRef.current.value) + (isTextInput ? 0 : unit);
    if (sum > maxValue) {
      newValue = String(Number(newValue) - (sum - Math.floor(maxValue / unit) * unit) + (isTextInput ? 0 : unit));
    }
    inputRef.current.value = newValue?.length ? newValue : "0";
    setTheMid((Number(newValue) / Number(to)) * 100);
    setInputValue(String(Math.floor(Number(newValue) / unit) * unit));
    return isTextInput ? String(Math.floor(Number(newValue) / unit) * unit) : newValue;
  };

  useEffect(() => {
    if (value !== undefined && to !== 0 && maxValue !== 0) {
      setInputValue(String(value));
      updateValue(String(value), true);
    }
  }, [value, to])

  useEffect(() => {
    setInputValue("0");
    setTheMid(0);
  }, [resetMemberPoint])

  if (!isAlreadyLogin || to === 0 || maxValue === 0) {
    return <></>;
  }

  return (
    <div className="mb-12 px-4 md:mb-[66px] md:px-0">
      <h2 className="mb-[26px] text-[20px] font-medium leading-none md:mb-[26px]">
        {translate("checkout.memberTitle")}
      </h2>
      <h4 className="mb-[14px] text-[15px] leading-[22px] md:mb-6 md:leading-[25px]">
        {translate("checkout.pointBalance")} <span className="font-semibold">{maxTo}</span>
      </h4>
      <p className="mb-[8px] text-[16px] leading-[22px] md:mb-4 md:text-xl">
        {translate("checkout.pointContent1")}
        <span className="font-semibold">
          {unit} {translate("checkout.pointContent2")}
        </span>
        {translate("checkout.pointContent3")}
      </p>
      <div className="flex flex-col items-center justify-center rounded-3xl px-6 py-10 md:px-10">
        <div className="mb-12 h-[61px] w-[178px] rounded-[50px] border border-primaryGold lg:w-[282px] 2xl:h-[92px]">
          <input
            className="mb-12 flex h-[61px] w-[178px] items-center justify-center border-0 
            bg-transparent text-center  text-[40px] font-semibold  leading-[58px] text-primaryDark focus:outline-none focus:ring-0 sm:text-h1 
            lg:w-[282px] lg:text-MemberPoint lg:leading-[81px] 2xl:h-[92px]"
            type="tel"
            pattern="\d*"
            value={inputValue}
            onChange={e => {
              if (Number(e.target.value).toString() !== "NaN") {
                setInputValue(e.target.value);
              }
            }}
            onBlur={() => {
              const newValue = updateValue(inputValue, true);
              onTextInput(newValue);
            }}
          />
        </div>
        <input
          onTouchEnd={onTouchEnd}
          onMouseUp={onMouseUp}
          ref={inputRef}
          type="range"
          min={from}
          max={to}
          step={unit}
          className="slider"
          id="myRange"
          value={inputRef.current?.value?.length ? Number(inputRef.current.value) : 0}
          onChange={e => {
            const newValue = updateValue(e.target.value);
            handleChange(newValue);
          }}
          name="memberPoints"
          style={{
            background: `linear-gradient(to right,  #8d7a5b 0%, #8d7a5b ${theMid}%, rgba(141,122,91,0.2) ${theMid}% , rgba(141,122,91,0.2) 100%)`,
          }}
        />
        <div className="mt-6 flex w-full justify-between">
          <div className="m-auto w-1/2 text-left text-[19.4px] font-semibold text-mineShaft lg:text-[26.8px]">
            {from}
          </div>
          <div className="m-auto w-1/2 text-right text-[19.4px] font-semibold text-mineShaft lg:text-[26.8px]">
            {to}
          </div>
        </div>
      </div>
    </div>
  );
};
