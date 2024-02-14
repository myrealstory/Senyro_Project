import React, { useEffect, useState } from "react";
import Image from "next/image";
import alertTriangleIcon from "@/images/icons/Icon_alert-triangle.png";
import alertIcon from "@/images/icons/alert-circle.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getCookie, deleteCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { usePathname } from "next/navigation";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { setStaticMessageOnTargetPage } from "@/redux/slice/generalStateSlice";
import { alertModalStaticMessageMapper } from "@/utils/clientUtils";
import { useTranslation } from "@/app/i18n/client";

interface InnerAlertProps {
  containerStyle?: string;
}

export const InnerAlert = ({ containerStyle }: InnerAlertProps) => {
  const [isDisplay, setIsDisplay] = useState(false);
  const [isDisplaySecond, setIsDisplaySecond] = useState(false);
  const { isDisplayStaticMessage, staticMessageType, staticMessageTitle, staticMessageContent, staticMessageItems,
    isDisplaySecondStaticMessage, secondStaticMessageType, secondStaticMessageTitle, secondStaticMessageContent, secondStaticMessageItems
  } = useSelector(
    (state: RootState) => state.generalState
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const slugs = getRouteNameFromPathname(pathname);
  const { translate } = useTranslation(slugs.firstSlug);

  useEffect(() => {
    const staticMessageContent = getCookie(CookiesKey.staticMessageContent) as string;

    if (staticMessageContent?.length) {
      const content = JSON.parse(staticMessageContent);
      if (content.page === slugs.secondSlug) {
        const alertInfo = alertModalStaticMessageMapper({
            alertCode: content.alertCode,
            translate,
            alertList: content.alertList,
            lang: slugs.firstSlug,
        });
    
        dispatch(setStaticMessageOnTargetPage({
          isDisplayStaticMessage: true,
          staticMessageType: alertInfo.staticMessageType,
          staticMessageTitle: alertInfo.staticMessageTitle,
          staticMessageItems: alertInfo.staticMessageItems,
          staticMessageContent: alertInfo.staticMessageContent,
        }))
      }

      deleteCookie(CookiesKey.staticMessageContent);
    }
  }, [])

  useEffect(() => {
    setIsDisplay(isDisplayStaticMessage);
  }, [isDisplayStaticMessage])

  useEffect(() => {
    setIsDisplaySecond(isDisplaySecondStaticMessage);
  }, [isDisplaySecondStaticMessage])

  const content = ({
    type,
    title,
    content,
    items,
  }: {
    type: typeof staticMessageType;
    title: typeof staticMessageTitle;
    content: typeof staticMessageContent;
    items: typeof staticMessageItems;
  }) => {
    return (<div
      className={`relative w-full rounded-lg py-5 pl-14 pr-4 md:rounded-2xl md:px-10 xl:px-14 ${type === "ERROR" ? "bg-primaryPurple30" : "bg-alert"} ${containerStyle}`}
    >
      <Image
        src={type === "ERROR" ? alertTriangleIcon : alertIcon}
        alt="alertIcon"
        width={0}
        height={0}
        sizes="100vw"
        className="absolute left-4 top-5 h-5 w-6  xl:h-6 xl:w-7 "
      />
      <p className="mb-1 text-14 font-semibold leading-5 text-primaryPurple md:mb-3 md:leading-6">{title}</p>
      <p className="mb-1 text-14 font-semibold leading-5 text-primaryPurple md:mb-3 md:leading-6">{content}</p>
      {items && (
        <ul>
          {items.map((item, index) => (
            <li key={index} className=" flex items-center text-14 text-primaryPurple">
              <span className="mr-2 md:hidden"> - </span>
              <span className="mr-3 hidden aspect-square h-auto w-[6px] rounded-full bg-primaryPurple md:block"></span>
              <span className="mb-1 text-center leading-5">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>)
  }

  return (
    <>
      {isDisplay && content({
        type: staticMessageType,
        title: staticMessageTitle,
        content: staticMessageContent,
        items: staticMessageItems,
      })}
      {isDisplaySecond && content({
        type: secondStaticMessageType,
        title: secondStaticMessageTitle,
        content: secondStaticMessageContent,
        items: secondStaticMessageItems,
      })}
    </>
  );
};
