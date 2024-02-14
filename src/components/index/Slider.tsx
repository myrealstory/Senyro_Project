"use client";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import "../../style/index/indexUsed.scss";
import Image from "next/image";
import PrevDark from "@/../../images/icons/Icon_Prev-Dark@3x.png";
import NextDark from "@/../../images/icons/Icon_Next-Dark@3x.png";
import { BannerProps } from "@/types/index/indexType";
import { useWindowSize } from "@/hook/useWindowSize";
import { usePathname } from "next/navigation";
import { getLangFromString } from "@/utils/commonUtils";
import { useTranslation } from "@/app/i18n/client";
import { HeroBannerType } from "@/types/api/apiTypes";

export const Slider: React.FC<BannerProps> = ({ images, isProduct, remark, darkmode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPageReady, setIsPageReady] = useState(false);
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate: t } = useTranslation(lang);
  const { width } = useWindowSize();
  const isMobileView = width < 1024;
  const [hoverActive, setHoverActive] = useState(false);

  useEffect(() => {
    if (width > 0) {
      setIsPageReady(true);
    }
  }, [width]);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    if (images?.length > 1) {
      setHoverActive(true);
    }
  };
  const handleMouseLeave = () => {
    setHoverActive(false);
  };

  const gotoDeepLink = (link: string | null) => {
    if (link !== null) window.open(link, "_blank");
  };

  //the floating content and CTA button
  const renderContent = (data: HeroBannerType[]) => {
    if (typeof data !== "string" && !isMobileView && !isProduct) {
      return (
        <>
          {data.map((banner, index: number) => (
            <div
              className={`absolute bottom-[25%] left-[200px] z-[99] max-w-[75%] transition-transform duration-500 ease-in
          ${hoverActive && currentIndex === index ? "opacity-100" : "opacity-0"}
          `}
              key={index}
            >
              <p className="mb-[1.77vw] text-24 font-medium text-white md:w-fit md:leading-[3vw] xl:text-[52px] xl:leading-[4.06vw]">
                {banner.title}
              </p>
              <p className=" mb-6 w-fit max-w-[600px] text-14 leading-7 tracking-wide text-primarySand xl:mb-10">
                {banner.description}
              </p>
              <a
                className="rounded-full bg-primarySand px-7 py-3 text-14 font-bold uppercase text-primaryDark xl:px-14 xl:py-5"
                href={banner?.ctaUrl ?? ""}
                target={banner.ctaUrlNewTab ? "_blank" : "_self"}
              >
                {banner.ctaButtonName ? banner.ctaButtonName : t("tabs.bannerView")}
              </a>
            </div>
          ))}
        </>
      );
    }
    // this doesn't work in isProduct as true
    return <></>;
  };

  //swipe Content render
  const renderSwipeContent = () => {
    return (
      <SwipeableViews
        index={currentIndex}
        onChangeIndex={(index: number) => setCurrentIndex(index)}
        style={{ height: "100%", width: "100%" }}
        autoPlay
        enableMouseEvents
      >
        {images.map((banner, index: number) => (
          <div key={typeof banner !== "string" ? banner.id : index} className="relative h-full w-full overflow-hidden">
            {typeof banner === "string" ? (
              <div className={"Carousel-items h-auto"}>
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${banner}`}
                  alt={`${index}`}
                  sizes="800vw"
                  width={0}
                  height={0}
                  className={"aspect-square h-full w-full object-cover"}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${banner}`}
                />
              </div>
            ) : (
              <div
                className={`Carousel-items h-[220px] w-screen bg-lightGrey md:h-[480px] ${
                  hoverActive ? "Carousel-hoverEffect" : ""
                }
                ${width < 1024 && banner.ctaUrl !== "" ? "cursor-pointer" : "cursor-default"}`}
                style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGE_URL}/${banner.webHomepageBanners})` }}
                onClick={() => {
                  width < 1024 && banner.ctaUrl !== "" ? gotoDeepLink(banner.ctaUrl) : null;
                }}
              />
            )}
          </div>
        ))}
      </SwipeableViews>
    );
  };

  if (!isPageReady) {
    return <></>;
  }

  return (
    <div
      className={`Carousel relative ${isProduct ? "overflow-hidden rounded-xl md:rounded-3xl " : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`-tranlate-y-1/2 absolute left-12 top-1/2 z-[99] rounded-full bg-secondaryLightSand60 px-5 py-4 transition-transform duration-1000 ease-in
        ${hoverActive ? "opacity-100" : "opacity-0"}
        `}
        onClick={handlePrev}
        type="button"
      >
        <Image src={PrevDark} alt="prev" className=" h-4 w-2" />
      </button>
      <button
        className={`absolute right-12 top-1/2 z-[99] rounded-full bg-secondaryLightSand60 px-5 py-4 transition-transform duration-1000 ease-in
        ${hoverActive ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleNext}
        type="button"
      >
        <Image src={NextDark} alt="prev" className=" h-4 w-2" />
      </button>
      {typeof images !== "string" && renderContent(images as HeroBannerType[])}
      <div className={`Carousel-content ${isProduct ? "h-auto w-full " : "h-[220px] w-full md:h-[480px] "}`}>
        {renderSwipeContent()}
      </div>
      <div
        className={`absolute w-full ${
          isProduct && remark ? "bottom-[66px] md:bottom-[58px] lg:bottom-[70px] 2xl:bottom-[90px]" : "bottom-7 "
        } buttonBox left-1/2 z-[10] flex -translate-x-1/2 items-center justify-center`}
      >
        {images?.map((banner, index) => {
          const isDarkMode =
            darkmode !== undefined && typeof banner === "string"
              ? darkmode
              : typeof banner !== "string" && banner.darkBackground === true;
          return (
            <button
              key={index}
              // key={typeof banner !== "string"? banner.id : index}
              className={`${
                isProduct
                  ? `product-dot ${isDarkMode ? "border-primaryGold" : "border-primaryDark"}`
                  : `btn-dot ${isDarkMode ? "border-primaryGold" : "border-primaryDark"}`
              } 
            ${
              index === currentIndex
                ? `btn-active ${isDarkMode ? "border-primaryGold bg-primaryGold" : "border-primaryDark bg-primaryDark"}`
                : ""
            }
            ${typeof banner !== "string" ? "" : index === currentIndex ? "btn-active" : ""}
            `}
              onClick={() => handleDotClick(index)}
              // onClick={() => handleDotClick(typeof banner !== "string"? banner.id : index)}
            />
          );
        })}
      </div>
      {isProduct && remark ? (
        <div
          className={`productRemarkLeading absolute bottom-0 left-0 w-full ${
            darkmode === true ? "bg-white text-primaryDark" : "bg-primaryGold/70 text-white"
          }  z-[1] px-5 py-3 -tracking-tighter md:px-[1.6vw] md:py-[1vw] md:text-18 2xl:text-24`}
          dangerouslySetInnerHTML={{ __html: remark }}
        />
      ) : (
        ""
      )}
    </div>
  );
};
