"use client";
import Image, { StaticImageData } from "next/image";
import React from "react";
import "../style/component/component.scss";

interface HoverImageProps {
  defaultSrc: StaticImageData | string;
  hoverSrc: StaticImageData | string;
  alt: string;
  width?: number;
  height?: number;
  classname?: string;
  productImage?: boolean;
  handleSingleProduct?: () => void;
  hasDetailSlug: boolean;
  disableAspectSquare?: boolean;
  darkBackground?: boolean;
  isMemberFavoriteMode?: boolean;
}

export const HoverImage = ({
  defaultSrc,
  hoverSrc,
  alt,
  width,
  height,
  classname,
  productImage,
  handleSingleProduct,
  hasDetailSlug,
  disableAspectSquare,
  isMemberFavoriteMode,
}: HoverImageProps) => {
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
      } ${disableAspectSquare ? "" : "aspect-square"}`}
      onClick={() => {
        if (typeof handleSingleProduct === "function") handleSingleProduct();
      }}
      suppressHydrationWarning
    >
      {productImage ? (
        <Image
          src={defaultSrc}
          alt={alt}
          width={width}
          height={height}
          className={`hoverImage ${hoverActive ? "scale-110 opacity-80 " : ""} relative ${
            isMemberFavoriteMode ? "" : "z-[-10]"
          }`}
          sizes="100vw"
        />
      ) : (
        <Image
          src={hoverActive ? hoverSrc : defaultSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${
            alt === "footerDownloadAppStore" || alt === "footerDownloadGooglePlay" ? "h-full w-full object-contain" : ""
          }`}
        />
      )}
    </button>
  );
};
