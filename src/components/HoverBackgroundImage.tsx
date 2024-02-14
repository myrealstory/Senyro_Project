"use client";
import { StaticImageData } from "next/image";
import React from "react";
import "../style/component/component.scss";

interface HoverBackgroundImageProps {
  defaultSrc: StaticImageData | string;
  hoverSrc: StaticImageData | string;
  alt: string;
  width?: number | string;
  height?: number | string;
  classname?: string;
  productImage?: boolean;
  handleSingleProduct?: () => void;
  hasDetailSlug: boolean;
  disableAspectSquare?: boolean;
  darkBackground?: boolean;
  isMemberFavoriteMode?: boolean;
}

export const HoverBackgroundImage = ({
  defaultSrc,
  width,
  height,
  classname,
  handleSingleProduct,
  hasDetailSlug,
  disableAspectSquare,
  darkBackground,
  isMemberFavoriteMode,
}: HoverBackgroundImageProps) => {
  const [hoverActive, setHoverActive] = React.useState(false);

  const handleHover = () => {
    setHoverActive(true);
  };

  const handleLeave = () => {
    setHoverActive(false);
  };

  return (
    <button
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      className={`${classname ? classname : "relative h-full w-full overflow-hidden rounded-2xl"} ${
        hasDetailSlug ? "cursor-pointer" : "cursor-auto"
      } ${disableAspectSquare ? "" : "aspect-square"} ${
        darkBackground
          ? "before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-primaryDark/50"
          : ""
      }`}
      onClick={() => {
        if (typeof handleSingleProduct === "function") handleSingleProduct();
      }}
      suppressHydrationWarning
    >
      <div
        style={{
          backgroundImage: `url('${defaultSrc}')`,
          width: width,
          height: height,
        }}
        className={`hoverBackgroundImage ${hoverActive ? "scale-110 opacity-80 " : ""} relative ${
          isMemberFavoriteMode ? "" : "z-[-10]"
        }`}
      ></div>
    </button>
  );
};
