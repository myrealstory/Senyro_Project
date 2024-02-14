"use client";
import React from "react";
import "@/style/index/indexUsed.css";
import Image from "next/image";
import PrevWhite from "@/../../images/icons/Icon_PromoPrev-white@3x.png";
import NextWhite from "@/../../images/icons/Icon_PromoNext-white@3x.png";
import { ButtonBodyProps, SlideButtonProps, mainButtonProps } from "@/types/index/indexType";

const ButtonBody = ({ button, index, setSelectIndex, selectedIndex, handle }: ButtonBodyProps) => {
  const [hoverActive, setHoverActive] = React.useState(false);

  const handleHover = () => {
    setHoverActive(true);
  };

  const handleLeave = () => {
    setHoverActive(false);
  };
  return (
    <div
      className={`mx-0 mr-2 flex h-[52px] w-[76px] cursor-pointer items-center justify-center overflow-y-hidden whitespace-normal rounded-xl bg-cover bg-center px-2
            text-[13.5px] leading-[15.8px] text-primaryGold hover:bg-primaryGold hover:font-light hover:tracking-[80px] hover:text-white md:mx-4 md:mr-0 md:rounded-2xl  md:px-[0.5vw]
            md:text-lg lg:h-[3.75vw] lg:w-[13.12vw] ${
              selectedIndex === index ? "bg-primaryGold text-white" : "bg-primaryGold2"
            }`}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      key={index}
    >
      <p className="hidden">{hoverActive}</p>
      <button
        className="h-full w-full  border-none transition-transform duration-300 hover:-translate-y-[100%] lg:hover:-translate-y-[108%] xl:hover:-translate-y-[100%]"
        onClick={() => {
          setSelectIndex(index);
          handle(index);
        }}
      >
        <div className="flex h-[52px] items-center justify-center text-center font-semibold md:h-[3.75vw]">
          {button.name}
        </div>
        <div className="flex h-[52px] items-center justify-center text-center font-semibold md:h-[3.75vw]">
          {button.name}
        </div>
      </button>
    </div>
  );
};

export const SlideButton = ({ data, handle }: SlideButtonProps) => {
  const [slideHover, setSlideHover] = React.useState(false);
  const [selectIndex, setSelectIndex] = React.useState(0);
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (sliderRef.current) sliderRef.current.style.transform = "translateX(-28%)";
  };
  const handleScrollLeft = () => {
    if (sliderRef.current) sliderRef.current.style.transform = "translateX(0)";
  };
  const handleHover = () => {
    setSlideHover(true);
  };

  const handleLeave = () => {
    setSlideHover(false);
  };

  return (
    <div
      className="buttonWrapper relative h-16 lg:h-[4.75vw] xl:h-[3.75vw]"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {slideHover && (
        <>
          <button
            className="bgLinearLeft absolute left-0 top-0 z-[99] hidden h-full items-center pl-8 pr-10 md:flex"
            onClick={handleScrollLeft}
          >
            <div className=" hidden h-[1.8rem] w-[1.8rem] transform justify-center rounded-full  bg-primaryDark sm:flex sm:items-center lg:h-[2.5vw] lg:w-[2.5vw]">
              <div className="  h-4 w-2 ">
                <Image src={PrevWhite} alt="prev" width={0} height={0} sizes="100vw" className="h-full w-full" />
              </div>
            </div>
          </button>
          <button
            className=" bgLinearRight absolute right-0 top-0 z-[99] hidden h-full items-center pl-10 pr-8 md:flex"
            onClick={handleScrollRight}
          >
            <div className=" hidden h-[1.8rem] w-[1.8rem] transform rounded-full bg-primaryDark sm:flex sm:items-center sm:justify-center lg:h-[2.5vw] lg:w-[2.5vw]">
              <div className="  h-4 w-2 ">
                <Image src={NextWhite} alt="next" width={0} height={0} sizes="100vw" className="h-full w-full" />
              </div>
            </div>
          </button>
        </>
      )}
      <div
        className={
          "absolute left-0 top-0 flex h-full items-center px-4 transition-transform duration-300 sm:px-[6vw] lg:px-[4vw]"
        }
        ref={sliderRef}
      >
        {data.map((button: mainButtonProps, index: number) => (
          <ButtonBody
            button={button}
            index={index}
            key={index}
            setSelectIndex={setSelectIndex}
            selectedIndex={selectIndex}
            handle={handle}
          />
        ))}
      </div>
    </div>
  );
};
