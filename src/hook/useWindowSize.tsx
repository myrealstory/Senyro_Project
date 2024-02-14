"use client";

import { useState, useEffect, useRef } from "react";

type WindowSizeProps = {
  width: number;
  height: number;
  scrollY: number;
  isWindowReady: boolean;
  isAppear: boolean;
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSizeProps>({
    width: 0,
    height: 0,
    scrollY: 0,
    isWindowReady: false,
    isAppear: true,
  });
  const lastScrollLocation = useRef<number>(0);
  let timer: string | number | NodeJS.Timeout | null | undefined = null;

  useEffect(() => {
    const handleSize = () => {
      if (window.visualViewport) {
        setWindowSize({
          width: window.visualViewport.width,
          height: window.visualViewport.height,
          scrollY: window.scrollY,
          isWindowReady: true,
          isAppear: true,
        });
      }
    };
    const handleScroll = () => {
      setWindowSize(prevWindowSize => ({
        ...prevWindowSize,
        scrollY: window.scrollY,
        isAppear: window.scrollY < lastScrollLocation.current,
      }));

    };

    const stopHandleScroll = () =>{
      if(timer !== null) clearTimeout(timer);
      timer = setTimeout(()=>{
        setWindowSize(preWindowSize => ({
          ...preWindowSize,
          isAppear: true,
        }));
      },200);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleSize);
      window.addEventListener("scroll", handleScroll)
      window.addEventListener("scroll",stopHandleScroll,false)
      handleSize();

      return () => {
        window.removeEventListener("resize", handleSize);
        window.removeEventListener("scroll", handleScroll);
        setTimeout(()=>{
          window.addEventListener("scroll",handleScroll)
        },150);
      };
    }
  }, []);
  lastScrollLocation.current = windowSize.scrollY;
  return windowSize;
};
