"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "../../style/index/indexUsed.scss";
import nextImg from "@/../images/icons/Icon_Next-white@3x.png";
import prevImg from "@/../images/icons/Icon_Prev-white@3x.png";
import { promotionData } from "@/constants/header";
import { useGetPromotinoalMsgSiteTopQuery } from "@/redux/api/generalApi";
import { LocaleKeysType } from "@/app/i18n";

export const PromotionBar = ({ showBar, height, lang }: { showBar: boolean; height: number; lang: LocaleKeysType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === promotionData.length ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? promotionData.length : prevIndex - 1));
  };

  useEffect(() => {
    const timeout = setTimeout(goToNextSlide, 3000);
    return () => clearInterval(timeout);
  }, [currentIndex]);

  const { data: promotionalMsgData, isSuccess: isPromotionalMsgSuccess } = useGetPromotinoalMsgSiteTopQuery({
    lang,
  });
  const promotionalMsg = promotionalMsgData?.data.message;

  return (
    <>
      <div
        className={`relative w-full transform bg-primaryDark duration-100 ${
          showBar ? "-translate-y-0" : "-translate-y-${height}px"
        }`}
        style={{
          height: showBar ? height : 0,
        }}
      >
        <div className="relative mx-auto my-0 flex h-full w-full transform items-center justify-center px-12 duration-500 md:w-[47.6vw] md:px-6 lg:w-[43.6vw]">
          <div className="flex w-full">
            {promotionalMsg &&
              isPromotionalMsgSuccess &&
              promotionalMsg.map((promotion, index) => {
                const haveLink = promotion.indexOf("<a") !== -1;
                if(haveLink && promotionalMsgData.data?.urlNewTab?.[index]) {
                  promotion = promotion.replaceAll("<a", `<a target="message_${index}" `);
                }
                return (
                  <a
                    key={index}
                    className={`customSlide h-full animate-[x-fadeOut] truncate text-center text-secondaryLightGold2 duration-[5000] ${
                      index === currentIndex ? "active" : "hidden"
                    }
                    ${haveLink ? "cursor-pointer" : ""}
                    `}
                  >
                    <span
                      className="text-13 text-secondaryLightGold2"
                      style={{
                        lineHeight: `${height}px`,
                      }}
                    >
                      <p className="" dangerouslySetInnerHTML={{ __html: promotion as string }}></p>
                    </span>
                  </a>
                )
              })}
          </div>
          <button
            className="absolute left-6 top-0 flex h-full w-1.5 items-center  md:-left-[7.7vw] md:w-[4px]"
            onClick={goToPrevSlide}
          >
            <Image
              src={prevImg}
              alt={"prev promotion"}
              className="h-2.5 w-full md:h-[8px] "
              width="0"
              height="0"
              sizes="100vw"
            />
          </button>
          <button
            className="absolute right-6 top-0 flex h-full w-1.5 items-center md:-right-[7.7vw] md:w-[4px] "
            onClick={goToNextSlide}
          >
            <Image
              src={nextImg}
              alt={"next promotion"}
              className="h-2.5 w-full md:h-[8px]"
              width={0}
              height={0}
              sizes="100vw"
            />
          </button>
        </div>
      </div>
    </>
  );
};
