"use client";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import React from "react";

type ProgressType = {
  title: string[];
  progress: number;
  lang: LocaleKeysType;
  containerStyle?: string;
};
export default function Progress({ title, progress, lang, containerStyle }: ProgressType) {
  const { translate } = useTranslation(lang);
  return (
    <ul className={`progressBar [&>*:last-child]:mr-0 ${containerStyle ?? ""}`}>
      {title.map((item, i) => (
        <li key={i} className={` ${i + 1 <= progress ? "" : "opacity-20"}`}>
          <div
            className={`relative flex h-8 w-8 items-center justify-center rounded-full bg-transparent md:h-9 md:w-full md:border  ${
              i + 1 <= progress ? "" : "md:border "
            } ${i + 1 === progress ? "w-auto border" : ""}`}
          >
            <span
              className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primaryDark text-white md:h-full md:w-9  ${
                i + 1 <= progress ? "" : ""
              } `}
            >
              {i + 1}
            </span>
            <p
              className={`ml-10 whitespace-nowrap pr-4 font-medium leading-[18px] text-primaryDark md:ml-12 md:pr-6 md:text-9 lg:text-11 ${
                i + 1 <= progress ? " " : ""
              } ${i + 1 === progress ? "text-14 " : "hidden md:flex md:text-9 lg:text-11"}`}
            >
              {translate(`${item}`)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
