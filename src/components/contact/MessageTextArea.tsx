"use client";
import { MessageProps } from "@/types/form/formTypes";
import { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";

export const MessageTextArea = ({
  name,
  id,
  maxLen,
  minLen,
  rows,
  cols,
  required,
  onChange,
  lang,
  campaignForm,
  onBlur,
}: MessageProps) => {
  const [textCount, setTextCount] = useState(0);
  const { translate } = useTranslation(lang as LocaleKeysType);
  return (
    <>
      <label
        htmlFor="message"
        className="flex flex-col text-[14px] font-semibold leading-5 lg:text-primaryGold xl:text-[16px] "
      >
        <span className="pb-[5px]">{translate("contactUs.yourMessage")}</span>
        <div className="relative flex flex-row rounded-[16px] border-[1px] border-primaryGold">
          <textarea
            placeholder={
              campaignForm
                ? `${translate("campaignPage.msgPlaceHolder")}`
                : `${translate("contactUs.messagePlaceHolder")}`
            }
            id={id}
            name={name}
            maxLength={maxLen}
            minLength={minLen}
            rows={rows}
            cols={cols}
            required={required}
            onChange={event => {
              event.target.value = event.target.value.slice(0, 2000);
              onChange(event);
              setTextCount(event.target.value.length);
            }}
            className="w-full overflow-auto border-0 bg-transparent px-[20px] py-[15px] text-[18px] font-medium leading-5
            text-primaryDark placeholder-primaryGold placeholder-opacity-40 placeholder:pl-[5px] placeholder:text-[16px] placeholder:tracking-tighter focus:border-primaryGold focus:ring-0 lg:placeholder:leading-[21px] xl:h-[300px]"
            style={{ resize: "none" }}
            onBlur={onBlur}
          />
          <span className="absolute bottom-4 right-6 text-[14px] font-medium leading-4 text-primaryGold opacity-50">
            {textCount} / 2000
          </span>
        </div>
      </label>
    </>
  );
};
