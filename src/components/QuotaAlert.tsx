"use client";
import React, { useRef } from "react";
import Image from "next/image";

import Alert_Icon from "@/images/icons/alert-circle-purple.png";
import Added_Icon from "@/images/icons/Icon_Mobile_Tick@3x.png";
import Alert_CTA_Icon from "@/images/icons/alert-circle_Purple.png";
import Added_CTA_Icon from "@/images/icons/Tick_Circle_Black.png";
import { QuotaAlertType } from "@/types/componentTypes";
import { usePathname } from "next/navigation";
import { getLangFromString } from "../utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { ROUTES } from "../constants";
import "@/style/component/component.scss";

export const QuotaAlert = ({ isOpen, containerStyle, content, style }: QuotaAlertType) => {
  const ImageRef = useRef<HTMLImageElement>(null);
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate: t } = useTranslation(lang);
  const isAlertIconCenter = style === "MARK_ICONCTA" || style === "MARK_ICONTITLE";
  const isNeutralIconCenter = style === "TICK_TEXTCTA";
  const isNeutralInnerIcon = style === "TICK";
  const isAlertInnerIcon = style === "MARK";
  const isUrl = style === "TICK_CTA" || style === "TICK_TEXTCTA" || style === "MARK_CTA" || style === "MARK_ICONCTA";

  if (!isOpen) {
    return <></>;
  }

  function hasTick(style: string) {
    const lowerCaseStyle = style.toLowerCase();
    return lowerCaseStyle.includes("tick");
  }

  const generateIcon = (mode: "InnerAlert" | "InnerNeutral" | "OuterAlert" | "OuterNeutral") => {
    switch (mode) {
      case "InnerAlert":
        return (
          <Image
            src={Alert_Icon}
            alt="Alert_Icon"
            width={0}
            height={0}
            sizes="100vw"
            className="mr-2 aspect-square h-auto w-8 object-cover md:w-7 xl:w-9 "
          />
        );
        break;

      case "InnerNeutral":
        return (
          <Image
            src={Added_Icon}
            alt="icon"
            width={0}
            height={0}
            sizes="100vw"
            className="mr-2 block aspect-square h-auto w-8 object-cover md:w-7 xl:w-9 "
          />
        );
        break;

      case "OuterAlert":
        return (
          <Image
            src={Alert_CTA_Icon}
            alt="icon"
            ref={ImageRef}
            width={0}
            height={0}
            sizes="100vw"
            className="absolute -top-5 left-1/2 aspect-square h-auto w-10 origin-center -translate-x-1/2 object-cover lg:-top-5 lg:w-8 2xl:-top-6 2xl:w-10"
          />
        );
        break;

      case "OuterNeutral":
        return (
          <Image
            src={Added_CTA_Icon}
            alt="icon"
            ref={ImageRef}
            width={0}
            height={0}
            sizes="100vw"
            className="absolute -top-6 left-1/2 aspect-square h-auto w-8 origin-center -translate-x-1/2 object-cover lg:-top-5 lg:w-8 2xl:-top-6 2xl:w-10"
          />
        );
        break;
      default:
        return <></>;
    }
  };

  return (
    <div
      className={`ToolTipsContainer ${hasTick(style) === true ? "bg-alert" : "bg-primaryPurpleBG"} ${
        isUrl ? "flex-col" : ""
      }  ${containerStyle}`}
    >
      {isAlertIconCenter && generateIcon("OuterAlert")}
      {isNeutralIconCenter && generateIcon("OuterNeutral")}
      <div className={"box-content flex w-full items-center justify-center  text-center "}>
        {isAlertInnerIcon && generateIcon("InnerAlert")}
        {isNeutralInnerIcon && generateIcon("InnerNeutral")}
        <div
          className={` text-base font-medium leading-4 lg:text-base lg:leading-5 2xl:text-md 2xl:leading-5 ${
            hasTick(style) === true ? "text-primaryDark" : "text-primaryPurple"
          } ${
            style === "TICK_TEXTONLY" || style === "MARK_TEXTONLY"
              ? "px-5 py-1 text-center lg:px-4 lg:py-2 xl:px-5"
              : ""
          } `}
          dangerouslySetInnerHTML={{ __html: content ?? "" }}
        />
      </div>
      {isUrl === true && (
        <a
          className={`mt-1 cursor-pointer text-center text-base leading-4 underline lg:text-base lg:leading-4 2xl:text-md 2xl:leading-4 ${
            hasTick(style) === true ? "text-primaryDark/50" : "text-primaryPurple/50"
          }`}
          href={`/${lang}/${ROUTES.CART}`}
        >
          {t("alertModal.viewCart")}
        </a>
      )}
    </div>
  );
};
