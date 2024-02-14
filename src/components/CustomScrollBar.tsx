import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

import LeftButton from "@/images/icons/Icon_Recommend_Left.png";
import RightButton from "@/images/icons/Icon_Recommend_Right.png";
import { CustomScrollBarType } from "@/types/componentTypes";
// import { useWindowSize } from "@/hook/useWindowSize";
import debounce from "lodash.debounce";

export const CustomScrollBar = ({
  width,
  height,
  children,
  currentY,
  currentX,
  scrollBarWidth,
  scrollRef,
  itemAmount,
  containerClasses,
  renderMode,
}: CustomScrollBarType) => {
  const maxWidth = width ? width : 10;
  const maxHeight = height ? height : 10;
  const scrollbarWidth = scrollBarWidth ? scrollBarWidth : 10;
  const [moveX, setMoveX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const maxPage = scrollRef.current
    ? Number((scrollRef.current?.scrollWidth / scrollRef.current?.clientWidth).toFixed(0))
    : 1;
  const prevXRef = useRef<number | null>(0);
  // const { width: screenWidth } = useWindowSize();
  const [, setAppearController] = useState({
    left: true,
    right: false,
  });
  // const [getArrowPosition, setGetArrowPosition] = useState(0);

  // const getArrowPosition = () => {
  //   const xlButton = 50 / 2;
  //   const lgButton = 47 / 2;
  //   const maxViewWidthXL = 1300;
  //   const maxViewWidthLG = 950;
  //   const maxViewWidthMD = 700;
  //   if (screenWidth + 17 >= 1536) {
  //     return (screenWidth - maxViewWidthXL) / 2 - xlButton;
  //   } else if (screenWidth + 17 >= 1024) {
  //     return (screenWidth - maxViewWidthLG) / 2 - lgButton;
  //   } else if (screenWidth + 17 >= 768) {
  //     return (screenWidth - maxViewWidthMD) / 2 - lgButton;
  //   }
  // };

  useEffect(() => {
    if (moveX === 0) {
      setAppearController({
        left: false,
        right: maxWidth - moveX > (width / itemAmount) * 4 ? true : false,
      });
    } else if (moveX >= maxWidth - 40) {
      setAppearController({
        left: true,
        right: false,
      });
    } else if (moveX < 100 && moveX > (width / itemAmount) * 4) {
      setAppearController({
        left: true,
        right: true,
      });
    }
  }, [moveX, width]);

  useEffect(() => {
    const handleResize = () => {
      // set recommend row is scrollable
      if(scrollRef.current){
        setScrollable(
          scrollRef.current.clientWidth !== scrollRef.current.scrollWidth && (currentX < 100 || currentX > 0)
        );        
      }
      // handle sizing
      const correctSize = scrollbarWidth * (currentX ? currentX / 100 : 1);
      const moveX = currentX ? maxWidth * (currentX / 100) - correctSize : 0;
      setMoveX(moveX);
    };
    handleResize(); // 初始化視窗寬度
    return () => {
      handleResize();
    };
  }, [currentX, maxWidth,scrollRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    prevXRef.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isDragging || !scrollRef.current) return;

      e.preventDefault();
      const sensitiveFactor = 1.5;
      const deltaX = (dragStartX - e.clientX) * sensitiveFactor;
      const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const targetScrollLeft = scrollRef.current.scrollLeft - deltaX;
      const limitedTargetScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));
      scrollRef.current.scrollTo({ left: limitedTargetScrollLeft });
    },
    [isDragging, dragStartX]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    prevXRef.current = null;
  }, []);

  const [, setIsRecommendHover] = useState(false);

  const enterCategoriesHover = () => {
    setIsRecommendHover(true);
  };

  const exitCategoriesHover = () => {
    setIsRecommendHover(false);
  };

  const handleLeftClick = () => {
    setMoveX(prevIndex => {
      const pageWidth = maxWidth / maxPage;
      const maxPageWidth = scrollRef.current ? scrollRef.current?.clientWidth / maxPage : 0;
      const currentLeft = scrollRef.current ? scrollRef.current?.scrollLeft : 0;
      const newMoveX = prevIndex > 0 ? prevIndex - pageWidth : prevIndex;
      const scrollLeft = prevIndex > 0 ? currentLeft - maxPageWidth : prevIndex;

      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }

      setTimeout(() => {
        return newMoveX;
      }, 500);

      return prevIndex;
    });
  };

  const handleRightClick = () => {
    setMoveX(prevIndex => {
      const pageWidth = maxWidth / maxPage;
      const maxPageWidth = scrollRef.current ? scrollRef.current?.clientWidth / maxPage : 0;
      const currentRight = scrollRef.current ? scrollRef.current?.scrollLeft : 0;
      const newMoveX = prevIndex < maxWidth ? prevIndex + pageWidth : prevIndex;
      const scrollRight = prevIndex < maxWidth ? currentRight + maxPageWidth : prevIndex;

      if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: scrollRight, behavior: "smooth" });
      }

      setTimeout(() => {
        return newMoveX;
      }, 500);

      return prevIndex;
    });
  };

  useEffect(() => {
    const handleMouseMoveDebounced = debounce(handleMouseMove, 10);
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMoveDebounced);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMoveDebounced);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveDebounced);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`recommendBox ${renderMode === "ADD-ON" ? "" : "wrapper"} relative ${containerClasses ?? ""}${
        scrollable ? " scrollable" : ""
      }`}
      onMouseEnter={enterCategoriesHover}
      onMouseLeave={exitCategoriesHover}
    >
      <button
        className={`recommendScrollButton left ${
          renderMode === "ADD-ON" ? "hidden md:hidden lg:block" : "active hidden md:block"
        }  ${
          currentX > 1
            ? "opacity-100"
            : "before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-full before:bg-white/50"
        }`}
        onClick={handleLeftClick}
      >
        <Image src={LeftButton} alt="" width={0} height={0} sizes="100vw" className="h-full w-full object-cover" />
      </button>
      <button
        className={`recommendScrollButton right ${
          renderMode === "ADD-ON" ? "hidden lg:block" : "active hidden md:block"
        } ${
          currentX < 99
            ? "opacity-100"
            : "before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-full before:bg-white/50"
        }`}
        onClick={handleRightClick}
      >
        <Image src={RightButton} alt="" width={0} height={0} sizes="100vw" className="h-full w-full object-cover" />
      </button>
      {children}
      {scrollable && (
        <div className="recommendScrollBar">
          <div className="recommendScrollTrack" style={{ width: `${maxWidth}px`, height: `${maxHeight}px` }}>
            <button
              className={`${currentY ? "-top-1/2 -translate-y-1/2" : "top-0"}`}
              style={{
                width: `${scrollBarWidth}px`,
                height: `${currentY ? currentY : 100}%`,
                transform: `translateX(${moveX}px)`,
              }}
              onMouseDown={handleMouseDown}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

CustomScrollBar.displayName = "CustomScrollBar";
