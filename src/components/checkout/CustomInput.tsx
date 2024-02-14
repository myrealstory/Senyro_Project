import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

import checkIcon from "@/images/icons/Icon_tick_Gold@3x.png";
import warningIcon from "@/images/icons/Icon_warning@3x.png";
import { CustomInputType } from "@/types/componentTypes";

import "./CustomInput.css";

export const CustomInput = ({
  name,
  disabled,
  label,
  type,
  placeholder,
  hasError = false,
  error,
  handleChange,
  value,
  onKeyDown,
  leftComponent,
  rightComponent,
  maxLength,
  pattern,
  onBlur,
  containerClasses,
  remainLabelHeight,
  successMessage,
  errorImg,
  labelClasses,
  textClasses,
  disabledTextClasses,
  path,
}: CustomInputType) => {
  const leftDivRef = useRef<HTMLDivElement>(null);
  const rightDivRef = useRef<HTMLDivElement>(null);
  const [leftPadding, setLeftPadding] = useState<number | undefined>(undefined);
  const [rightPadding, setRightPadding] = useState<number | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!value) {
      setIsEditing(false);
    }
  }, [value]);

  useEffect(() => {
    if (leftDivRef.current) {
      let pr = 0;
      const taregtEle = leftDivRef.current?.childNodes[0];
      if (taregtEle) {
        pr = (taregtEle as Element).getBoundingClientRect().width;
      }
      setLeftPadding(pr);
    }
  }, [leftDivRef.current]);

  useEffect(() => {
    if (rightDivRef.current) {
      let pr = 0;
      const taregtEle = rightDivRef.current?.childNodes[0];
      if (taregtEle) {
        pr = (taregtEle as Element).getBoundingClientRect().width;
      }
      setRightPadding(pr);
    }
  }, [rightDivRef.current]);

  return (
    <div className={`relative flex w-full flex-col ${containerClasses}`}>
      {" "}
      {label && label?.length > 0 ? <label className={`mb-2 text-md font-bold ${labelClasses}`}>{label}</label> : null}
      {remainLabelHeight ? <div className={`mb-[.7rem] h-[16px] text-md ${labelClasses}`} /> : null}
      <div className="relative flex items-center">
        {leftComponent !== undefined && <div ref={leftDivRef}>{leftComponent()}</div>}
        <input
          name={name}
          pattern={pattern}
          disabled={disabled}
          id="input"
          type={type.toLocaleLowerCase()}
          onWheel={e => {
            if (type === "NUMBER" || type === "TEL") {
              (e.target as HTMLElement).blur();
            }
          }}
          maxLength={maxLength}
          className={`h-[50px] w-full rounded-full border 
          px-5 py-[12px] text-md font-semibold text-primaryDark outline-none placeholder:font-normal
          placeholder:text-primaryGold placeholder:text-opacity-50 focus:border-none focus:outline-none focus:ring-2 focus:ring-primaryGold md:h-[45px] ${
            path === "add-cards" ? "pl-4" : "md:px-9"
          }  md:py-0 
          md:text-lg lg:h-[50px] 2xl:h-[55px]
          ${hasError ? "border-primaryPurple" : "border-primaryGold"}
          ${textClasses}
          ${disabled ? `${disabledTextClasses ? disabledTextClasses : "bg-transparent opacity-50"}` : "bg-transparent"}
          `}
          style={{
            paddingLeft: leftPadding ?? undefined,
            paddingRight: rightPadding ?? undefined,
          }}
          placeholder={placeholder}
          value={value ? value : ""}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onBlur={e => {
            setIsEditing(true);
            onBlur && onBlur(e);
          }}
        />
        {rightComponent !== undefined ? (
          <div ref={rightDivRef}>{rightComponent()}</div>
        ) : (
          <>
            <Image
              src={checkIcon}
              alt=""
              sizes="100vw"
              width={0}
              height={0}
              className={`absolute right-5 top-1/2 -translate-y-1/2 ${
                !hasError && value && isEditing ? "block" : "hidden"
              } h-auto w-[12px] cursor-default md:w-[18px]`}
            />
            <Image
              src={warningIcon}
              alt=""
              className={`absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 ${
                hasError ? "block" : "hidden"
              } h-auto w-[20px] cursor-default  md:w-[23px]`}
            />
          </>
        )}
      </div>
      {hasError && error && (
        <div className="flex items-center pl-5 pt-1">
          {errorImg && <Image src={errorImg} alt="" className={"block h-auto w-5"} />}
          <p className={"text-14 font-semibold leading-4 text-primaryPurple md:leading-5"}>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className=" flex items-center pl-5 md:pl-7">
          <p className={"mt-2 text-[14px] font-semibold leading-4 text-primaryPurple md:text-16 md:leading-5"}>
            {successMessage}
          </p>
        </div>
      )}
    </div>
  );
};
