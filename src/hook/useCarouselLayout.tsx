import { useWindowSize } from "@/hook/useWindowSize";
import { RootState } from "@/redux/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "@/style/general-information/general-information.scss";

export const useCarouselLayout = (slideCount: number) => {
  const resizeTimer = useRef<string | number | NodeJS.Timeout | undefined>(undefined);
  const mobileViewBreakpoint = 767;
  const carouselViewWidth = 1920;
  const mobileViewPadding = 30;
  const slideWidth = 344;
  const windowSize = useWindowSize();

  const isBodyScrollbarDisplay = useSelector((state: RootState) => state.generalState.isBodyScrollbarDisplay);
  const [carouselViewStyle, setCarouselViewStyle] = useState<React.CSSProperties>({});
  const [slideViewStyle, setSlideViewStyle] = useState<React.CSSProperties>({});
  const [isMobileView, setIsMobileView] = useState(windowSize.width > 0 && windowSize.width <= mobileViewBreakpoint);
  const [centerSlidePosition, setCenterSlidePosition] = useState<{
    left: number;
    right: number;
  }>({
    left: 0,
    right: 0,
  });

  const swiperConfig = useMemo(() => {
    const isMobileView = windowSize.width > 0 && windowSize.width <= mobileViewBreakpoint;
    const config = {
      loopedSlides: 0,
      slidesPerView: 0,
    };
    const carouselViewStyle: React.CSSProperties = {
      minWidth: carouselViewWidth,
      transform: `translate3d(-${
        (carouselViewWidth - windowSize.width > 0 ? carouselViewWidth - windowSize.width : 0) / 2
      }px, 0, 0)`,
    };
    const slideViewStyle: React.CSSProperties = {
      minWidth: slideWidth,
      maxWidth: slideWidth,
    };
    let centerImageIndex = 0;
    switch (true) {
      case isMobileView:
        config.loopedSlides = 1;
        config.slidesPerView = 1;
        centerImageIndex = 0;
        carouselViewStyle.minWidth = undefined;
        carouselViewStyle.transform = undefined;
        slideViewStyle.minWidth = undefined;
        slideViewStyle.maxWidth = undefined;
        slideViewStyle.paddingLeft = mobileViewPadding;
        slideViewStyle.paddingRight = mobileViewPadding;
        break;
      case slideCount === 1:
        config.loopedSlides = 1;
        config.slidesPerView = 1;
        centerImageIndex = 0;
        carouselViewStyle.paddingLeft = 788;
        carouselViewStyle.paddingRight = 788;
        break;
      case slideCount === 2:
      case slideCount === 3:
      case slideCount === 4:
        config.loopedSlides = 2;
        config.slidesPerView = 3;
        centerImageIndex = 1;
        carouselViewStyle.paddingLeft = 440;
        carouselViewStyle.paddingRight = 440;
        break;
      case slideCount >= 5:
        config.loopedSlides = 3;
        config.slidesPerView = 5;
        centerImageIndex = 2;
        carouselViewStyle.paddingLeft = 100;
        carouselViewStyle.paddingRight = 100;
        break;
      default:
        break;
    }
    return {
      config,
      carouselViewStyle,
      slideViewStyle,
      centerImageIndex,
    };
  }, [windowSize]);

  useEffect(() => {
    setCarouselViewStyle(swiperConfig.carouselViewStyle);
    setSlideViewStyle(swiperConfig.slideViewStyle);
    updateSlidesStyle();
  }, [windowSize]);

  useEffect(() => {
    setIsMobileView(windowSize.width > 0 && windowSize.width <= mobileViewBreakpoint);
  }, [windowSize]);

  useEffect(() => {
    resizeTimer.current = setTimeout(() => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
      const newCenterSlidePosition = getCenterSlidePosition();
      newCenterSlidePosition && setCenterSlidePosition(newCenterSlidePosition);
    }, 100);

    return () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
    };
  }, [isMobileView, windowSize, isBodyScrollbarDisplay]);

  useEffect(() => {
    const newCenterSlidePosition = getCenterSlidePosition();
    newCenterSlidePosition && setCenterSlidePosition(newCenterSlidePosition);
  }, []);

  const updateSlidesStyle = () => {
    const activeImages = document.querySelectorAll<HTMLElement>(".swiper-wrapper > .swiper-slide-visible");
    const isMobileView = windowSize.width > 0 && windowSize.width <= mobileViewBreakpoint;
    const prevView = document.getElementsByClassName("swiper-slide-prev")[0];
    const activeView = document.getElementsByClassName("swiper-slide-active")[0];
    const nextView = document.getElementsByClassName("swiper-slide-next")[0];

    switch (true) {
      case isMobileView && slideCount === 2:
        activeImages.forEach(ele => {
          ele.style.opacity = "1";
        });
        break;
      case !isMobileView &&
        slideCount === 2 &&
        (activeImages.length === 3 || activeImages.length === 4) &&
        prevView !== undefined &&
        activeView !== undefined &&
        nextView !== undefined:
        (prevView as HTMLElement).style.opacity = "0.00001";
        (activeView as HTMLElement).style.opacity = "1";
        (activeView as HTMLElement).style.transform = "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)";
        (nextView as HTMLElement).style.opacity = "1";
        (nextView as HTMLElement).style.transform = "translate3d(-5%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        break;
      case !isMobileView && slideCount === 3 && activeImages.length === 3:
      case !isMobileView && slideCount === 4 && activeImages.length === 4:
        activeImages[0].style.transform = "translate3d(5%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        activeImages[2].style.transform = "translate3d(-5%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        break;
      case !isMobileView && slideCount >= 5 && activeImages.length >= 5:
        activeImages[0].style.transform = "translate3d(20%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        activeImages[1].style.transform = "translate3d(5%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        activeImages[3].style.transform = "translate3d(-5%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        activeImages[4].style.transform = "translate3d(-20%, 0px, 0px) rotateX(0deg) rotateY(0deg) scale(0.8)";
        break;
      default:
        break;
    }
  };

  const getCenterSlidePosition = () => {
    const swiperView = document.querySelectorAll<HTMLElement>(".swiper")[0].getBoundingClientRect();
    const activeImages = document
      .querySelectorAll<HTMLElement>(".swiper-wrapper > .swiper-slide-visible")
      ?.[swiperConfig.centerImageIndex]?.getBoundingClientRect();
    if (!activeImages) {
      return;
    }
    const factor = 21;
    if (isMobileView) {
      return {
        left: activeImages.x + mobileViewPadding - factor,
        right: activeImages.x + activeImages.width - mobileViewPadding - factor,
      };
    } else {
      return {
        left: activeImages.x - swiperView.x - factor,
        right: activeImages.x + activeImages.width - swiperView.x - factor,
      };
    }
  };

  return {
    swiperConfig,
    carouselViewStyle,
    updateSlidesStyle,
    slideViewStyle,
    centerSlidePosition,
  };
};
