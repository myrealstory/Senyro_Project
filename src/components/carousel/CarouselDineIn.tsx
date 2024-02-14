"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import Image from "next/image";
import LeftIcon from "@/images/icons/Icon_chevron-left-black.png";
import RightIcon from "@/images/icons/Icon_chevron-right-black.png";
import Icon_info_download from "@/images/icons/Icon_info_download.png";
import { MenuDetail } from "@/constants/menu/dineInMenu";
import { ComponentType } from "@/app/[lang]/page";
import EffectCoverflow from "./EffectCoverflow.mjs";
import { Tags } from "../member/Tags";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "@/style/component/component.scss";
import { useCarouselLayout } from "@/hook/useCarouselLayout";
import { useTranslation } from "@/app/i18n/client";
import "@/style/general-information/general-information.scss";
import Link from "next/link";

export interface CarouselProps extends ComponentType {
  slides: MenuDetail[];
  page?: string;
}

export interface ArrowButton {
  type: "Left" | "Right";
  slideCount: number;
  onClick: (params?: any) => any;
}

const ArrowButton = ({ type, slideCount, onClick }: ArrowButton) => {
  const swiper = useSwiper();

  const { centerSlidePosition } = useCarouselLayout(slideCount);

  const commonClasses = "carouselCommonClass";
  // -mt-[22px]

  if (type === "Left") {
    return (
      <div
        onClick={() => {
          swiper.slidePrev();
          onClick();
        }}
        style={{
          transform: `translate3d(${centerSlidePosition.left}px, 0, 0)`,
        }}
        className={commonClasses}
      >
        <Image src={LeftIcon} alt="left" width={0} height={0} sizes="100vw" className="carouselBtns" />
      </div>
    );
  } else if (type === "Right") {
    return (
      <div
        onClick={() => {
          swiper.slideNext();
          onClick();
        }}
        style={{
          transform: `translate3d(${centerSlidePosition.right}px, 0, 0)`,
        }}
        className={commonClasses}
      >
        <Image src={RightIcon} alt="right" width={0} height={0} sizes="100vw" className="carouselBtns" />
      </div>
    );
  }

  return <></>;
};

export const CarouselDineIn = ({ slides, lang, page }: CarouselProps) => {
  const { translate } = useTranslation(lang);
  const defaultOpacity = 0.00001;
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [carouselOpacity, setCarouselOpacity] = useState(defaultOpacity);
  const slideCount = slides.length;
  const { swiperConfig, updateSlidesStyle, carouselViewStyle, slideViewStyle } = useCarouselLayout(slideCount);

  useEffect(() => {
    if (carouselOpacity === 1) {
      setTimeout(updateSlidesStyle, 500);
    }
  }, [carouselOpacity]);

  const generateMappedSlides = () => {
    let tempSlides = slides;
    if (slideCount >= 1 && slideCount <= 10) {
      tempSlides = slides.concat(slides);
    }
    return tempSlides;
  };

  const mappedSlides = generateMappedSlides();

  return (
    <div>
      <div
        style={{
          ...carouselViewStyle,
          opacity: carouselOpacity,
        }}
      >
        <Swiper
          effect="coverflow"
          modules={[EffectCoverflow]}
          coverflowEffect={{
            scale: 0.8,
            depth: 0,
            modifier: 1,
            rotate: 0,
            slideShadows: false,
            stretch: 0,
          }}
          // when loop enabled amount of slides must be >= slidesPerView * 2
          loop={true}
          centeredSlides={true}
          onSlideChange={swiper => {
            setSelectedItemIndex(swiper.realIndex);
            updateSlidesStyle();
            console.log("onSlideChange");
          }}
          onSwiper={() => {
            setTimeout(() => {
              updateSlidesStyle();
              setCarouselOpacity(1);
            }, 500);
          }}
          onBeforeSlideChangeStart={updateSlidesStyle}
          onBeforeTransitionStart={updateSlidesStyle}
          {...swiperConfig.config}
        >
          {carouselOpacity > defaultOpacity && slides.length > 1 && (
            <ArrowButton
              slideCount={slideCount}
              type="Left"
              onClick={() => {
                updateSlidesStyle();
              }}
            />
          )}
          {carouselOpacity > defaultOpacity && slides.length > 1 && (
            <ArrowButton
              slideCount={slideCount}
              type="Right"
              onClick={() => {
                updateSlidesStyle();
              }}
            />
          )}
          {mappedSlides.map((item, index) => {
            return (
              <SwiperSlide key={index} style={slideViewStyle}>
                <div>
                  <div
                    style={{
                      lineHeight: "26.25px",
                      fontSize: 17,
                      letterSpacing: "-2%",
                      paddingLeft: "15.75px",
                      paddingRight: "15.75px",
                    }}
                    className={`
                        ${item.isNew ? "opacity-100" : "opacity-[0.00001]"} carouselSwiperDiv
                        ${lang === "en" ? "w-[73.35px] " : "w-[65.26px] whitespace-nowrap"}
                        
                      `}
                  >
                    {translate("dineInOrNews.new")}
                  </div>
                  <Link href={`/${lang}/${page}/${item.id}`}>
                    <img src={item.image} className="rounded-[21px]" />
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="carouselTitleSection">
        <figcaption className="carouselTitleFigcaption">
          <h2 className="">{`${
            lang === "en" ? mappedSlides[selectedItemIndex].title : mappedSlides[selectedItemIndex].titleTC
          }`}</h2>
          <h3 className="">{`${
            lang === "en" ? mappedSlides[selectedItemIndex].subtitle : mappedSlides[selectedItemIndex].subtitleTC
          }`}</h3>
          <div className="flex gap-2 px-[10px] ">
            <Tags tags={mappedSlides[selectedItemIndex].tags} lang={lang} path={"generalPage"} />
          </div>
          <div
            onClick={() => null}
            role="button"
            className={`
            carouselDownloadSection 
          ${page === "news-offers" ? " hidden " : "block"}
        `}
          >
            <Image
              src={Icon_info_download}
              alt="left"
              width={37}
              height={37}
              className={` ${page === "news-offers" ? "hidden md:flex" : "flex"}`}
            />
            {/* <div className="text-center text-[18px] font-semibold leading-4 text-white md:hidden">
              {translate("dineInOrNews.download")}
            </div> */}
          </div>
        </figcaption>
      </div>
    </div>
  );
};
