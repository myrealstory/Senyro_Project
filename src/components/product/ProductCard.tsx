"use client";
import { useMemo, useRef } from "react";
import Image from "next/image";
import { PriceBadges } from "../priceBadges";
import { FavouriteButton } from "../FavouriteButton";
import { AddToCartButton } from "../AddToCartButton";
import SampleImage from "../SampleImage";
import DiscountTagIcon from "@/images/icons/Icon_discount.png";
import DiscountTagIconDark from "@/images/icons/Icon_discount_Dark.png";
import { ProductCartType } from "@/types/componentTypes";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { useWindowSize } from "@/hook/useWindowSize";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import { HoverBackgroundImage } from "../HoverBackgroundImage";

export const ProductCard = ({
  product,
  containerClasses,
  isHorizontalMode,
  isAddOnMode,
  lang,
  refCategoryType,
  refCategoryTypeId,
  isMemberFavoriteMode,
  path,
  id,
  source,
  isPLP,
}: ProductCartType) => {
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const getRemarkCurrent = useRef<HTMLDivElement>(null);
  const mobileImageCurrent = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const { translate } = useTranslation(lang);

  const getMobileImageHeight = useMemo(() => {
    if (mobileImageCurrent.current) {
      return mobileImageCurrent.current.clientWidth;
    }
    return "auto";
  }, [mobileImageCurrent.current, width]);

  const getViewClasses = useMemo(() => {
    const baseStyle = {
      rootViewClasses: `${containerClasses} ${
        isMemberFavoriteMode ? "w-full aspect-square" : "w-full md:w-[100%] lg:w-[100%] 2xl:w-[100%]"
      } `,
      addToCartClassess: `z-1 absolute top-[274px] md:top-5 right-5 2xl:top-[24px] 2xl:right-[24px] 
      `,
      hoverImageClasses: "h-auto aspect-square w-full ",
      tagContainerClasses: isMemberFavoriteMode ? "lg:max-w-[125px] md:max-w-[118px] max-w-[185px]" : "",
      badgeContainerClasses: "",
      badgeClasses: `h-auto w-[30px] aspect-square ${path === "favourite" ? "2xl:w-[35px]" : "2xl:w-[45px]"} `,
      promotionMessageClasses: "",
      productNameClasses: " whitespace-normal text-23",
      priceBadgesClasses: isMemberFavoriteMode ? "lg:w-[85px] md:w-[80px] w-[110px] aspect-[3.3/1] h-auto" : "",
      priceBadgesTextClasses: isMemberFavoriteMode ? "lg:text-18 md:text-16 text-23" : "",
      productJPName: "my-6 text-center text-[14px] tracking-tighter leading-[18px] text-primaryDark",
    };

    const horizontalModeStyles = {
      rootViewClasses: `${containerClasses} w-[17.4rem] md:w-[290px]`,
      addToCartClassess: `z-1 absolute right-5 md:bottom-0 md:top-5 md:right-5 
      ${isAddOnMode ? "top-[136px] md:top-[168px]" : product.remark ? "top-[145px]" : "top-[185px]"}
      `,
      hoverImageClasses: "h-[17.4rem] md:h-[290px] overflow-hidden rounded-2xl",
      tagContainerClasses: "md:max-w-[140px]",
      badgeContainerClasses: `${
        product.promotionMessage
          ? "mb-4 ml-4 md:mb-[1.25vw] md:ml-[1.43vw]"
          : "mb-7 ml-4 md:mb-[1.45vbw] md:ml-[1.43vw]"
      }`,
      badgeClasses: "mr-3 h-[28px] w-[28px] md:h-[1.68rem] md:w-[1.46rem] xl:h-9 xl:w-9",
      promotionMessageClasses: "truncate",
      productNameClasses: `mx-auto whitespace-normal px-5 xl:px-5 ${isAddOnMode ? "!text-18" : "text-20"}`,
      priceBadgesClasses: "min-w-[72px] max-w-[72px] md:min-w-[92px] md:max-w-[92px] h-6 md:h-8 lg:h-[25px]",
      priceBadgesTextClasses: "2xl:text-16 text-16",
      productJPName: "my-6 text-center text-[12px] leading-[14px] text-primaryDark tracking-tighter",
    };

    return isHorizontalMode ? horizontalModeStyles : baseStyle;
  }, [isHorizontalMode]);

  const redirectToPDP = () => {
    if (product.hasDetailPage && product.detailPageSlug.trim().length) {
      window.location.href = `/${lang}/${ROUTES.PRODUCT}/${product.detailPageSlug}`;
    }
  };

  return (
    <div
      id={id}
      className={`rootView ${isMemberFavoriteMode ? "isMemberFavor" : ""} ${isHorizontalMode ? "horizontalMode" : ""}
    ${containerClasses}`}
      ref={mobileImageCurrent}
    >
      <div className={"ImageBox"} style={width < 768 && !isAddOnMode ? { height: `${getMobileImageHeight}px` } : {}}>
        <div className={`buttonBox ${isAlreadyLogin ? "justify-between " : "justify-end"}`}>
          {isAlreadyLogin && (
            <FavouriteButton
              isFavourite={product.isFavourite}
              containerClasses={"favorButton"}
              skuCode={product.skuCode}
              isMemberFavoriteMode={isMemberFavoriteMode}
              darkmode={product.darkBackground}
            />
          )}
          {width > 1024 && (
            <AddToCartButton<"isMainProduct">
              source={source}
              product={product}
              lang={lang}
              mode={"SHORT_BUTTON"}
              containerClasses={"relative desktopAppear"}
              refCategoryType={path === "favourite" ? "MY_FAVORITE" : refCategoryType}
              refCategoryTypeId={refCategoryTypeId}
              type={isHorizontalMode === true ? "smallSize" : undefined}
              path={path}
              isPLP={isPLP}
            />
          )}
        </div>
        <div className="backgroundBox">
          {product?.images?.[0]?.length > 0 ? (
            <HoverBackgroundImage
              defaultSrc={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.images?.[0]}`}
              hoverSrc={""}
              alt={product.name}
              isMemberFavoriteMode={isMemberFavoriteMode}
              productImage
              width={"100%"}
              height={"100%"}
              handleSingleProduct={() => {
                redirectToPDP();
              }}
              hasDetailSlug={product.hasDetailPage}
            />
          ) : (
            <SampleImage />
          )}
          <div className={"badgeContainer"}>
            <div className={` badgeRow ${product.remark === null ? "withoutRemark" : "withRemark"}`}>
              <div className={"badgeBox"}>
                {product?.badges.map((badge, i) => (
                  <div
                    className={`badgeDiv ${isMemberFavoriteMode ? "favorBadge" : ""} 
                  ${isHorizontalMode ? "horizontalBadge" : ""}`}
                    key={i}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${badge.icon}`}
                      alt={"badge"}
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </div>
                ))}
              </div>
              {width < 1024 && (
                <AddToCartButton<"isMainProduct">
                  source={source}
                  product={product}
                  lang={lang}
                  mode={"SHORT_BUTTON"}
                  containerClasses={"relative"}
                  refCategoryType={path === "favourite" ? "MY_FAVORITE" : refCategoryType}
                  refCategoryTypeId={refCategoryTypeId}
                  type={isHorizontalMode === true ? "smallSize" : undefined}
                  isPLP={isPLP}
                />
              )}
            </div>
            {isAddOnMode ? (
              <div className={`addonProductCard ${product.darkBackground ? "bg-white" : "bg-primaryGold/70"}`}>
                <Image
                  src={product.darkBackground === true ? DiscountTagIconDark : DiscountTagIcon}
                  alt="DiscountTagIcon"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="discountTagIcon"
                />
                <div className={`${product.darkBackground ? "text-primaryDark" : "text-white"}`}>
                  <p>
                    {translate("menu.topup")}${product.addonPrice ?? product.price}
                  </p>
                  <span>
                    {translate("menu.oriprice")}${product.price}
                  </span>
                </div>
              </div>
            ) : (
              product.remark !== null && (
                <div
                  ref={getRemarkCurrent}
                  className={`${isHorizontalMode ? "truncateP" : "leadingP"} 
                  addonRemark  
                  ${product.darkBackground ? "bg-white text-primaryDark" : "bg-primaryGold/70 text-white"}`}
                  dangerouslySetInnerHTML={{ __html: product.remark }}
                />
              )
            )}
          </div>
        </div>
      </div>
      <div className="productCardInfo">
        <p className=" nameJp">{product.nameJp}</p>
        <p
          className={`
          productName 
          ${path === "favourite" ? "isAddonMode" : ""} 
          ${isHorizontalMode ? "isHorizontal" : ""}
          ${isAddOnMode ? "isAddonMode" : ""}`}
        >
          {product.name}
        </p>
        <div
          className="whitespace-normal px-4 text-[12px] leading-[18px] text-primaryDark text-opacity-60 md:mb-2 md:px-0 md:text-14"
          dangerouslySetInnerHTML={{ __html: product.attribute }}
        ></div>
      </div>
      <PriceBadges
        leftBadge={product?.generalPriceBadges}
        rightBadge={product?.memberPriceBadges}
        // badgeClasses={getViewClasses.priceBadgesClasses}
        textClasses={getViewClasses.priceBadgesTextClasses}
        badgeContainerClasses={getViewClasses.tagContainerClasses}
        isMemberFavoriteMode={isMemberFavoriteMode ? true : false}
      />
    </div>
  );
};
