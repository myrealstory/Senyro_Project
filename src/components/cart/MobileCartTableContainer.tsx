"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

import showSub from "@/images/icons/Icon_ShowSub.png";
import hideSub from "@/images/icons/Icon_SubHide.png";
import trashCanIcon from "@/images/icons/trash-2.png";
import { useCart } from "@/hook/useCart";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { CartItemType, CartTableModeType } from "@/types/cartTypes";

import { AddToCartButton } from "../AddToCartButton";
import { ROUTES } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Props = {
  index: number;
  item: CartItemType;
  isExpandSubItems: boolean;
  setIsExpandSubItems: React.Dispatch<React.SetStateAction<boolean>>;
  lang: LocaleKeysType;
  mode: CartTableModeType;
  handleDeleteClick?: () => void;
  cartKey?: string;
};

const MobileCartTableContainer = ({
  index,
  item,
  isExpandSubItems,
  setIsExpandSubItems,
  lang,
  mode,
  cartKey,
}: Props) => {
  const { translate } = useTranslation(lang);
  const { deleteProductFromCart } = useCart({ lang });
  const { dimmedSetProductSkuCodes } = useSelector((state: RootState) => state.generalState);

  const isThisProductDimmed = useMemo(() => {
    return !!dimmedSetProductSkuCodes.find(skuCode => skuCode === item.skuCode || skuCode === item.cartKey);
  }, [dimmedSetProductSkuCodes, item])

  if (typeof window !== "undefined") {
    document.body.style.overflowX = "hidden";
  }

  // swipe to delete
  const [swipeActivated, setSwipeActivated] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startTime, setStartTime] = useState(0);
  // console.log(startTime, "startTime");

  const handleSwipeStart = (e: React.TouchEvent) => {
    if (mode === "GIFT" || !item.isAllowDelete) {
      return;
    }
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartTime(Date.now()); // Record the start time in milliseconds

    const handleSwipeEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endTime = Date.now(); // Record the end time in milliseconds
      // console.log(endTime, "endTime");

      const swipeDistance = endX - startX;
      const minSwipeDistance = 160;

      // Ensure the swipe action completes within 2 seconds (2000 milliseconds)
      if (swipeDistance < -minSwipeDistance && endTime - startTime <= 1500) {
        setSwipeActivated(true);
        // Swipe to the left, activate delete button
      } else {
        setSwipeActivated(false); // Swipe to the right or not long enough, hide delete button
      }

      window.removeEventListener("touchend", handleSwipeEnd);
    };

    window.addEventListener("touchend", handleSwipeEnd);

    window.addEventListener("touchcancel", () => {
      window.removeEventListener("touchend", handleSwipeEnd);
    });
  };

  const handleDeleteClick = (skuCode: string) => {
    deleteProductFromCart(skuCode, cartKey as string);
    setSwipeActivated(false);
  };

  return (
    <div className="relative flex flex-row">
      <div
        key={index}
        className={`relative mb-4 mt-[18px] block w-full overflow-x-hidden border-b border-solid 
                      border-primaryGold2  pb-4`}
      >
        <div
          className={`transition-transform ${
            swipeActivated ? "-translate-x-[7.7rem] transform overflow-x-hidden" : ""
          }`}
        >
          <div className="flex">
            <div
              onClick={() => {
                if (item.item.hasDetailPage && item.item.detailPageSlug?.length) {
                  window.location.href = `/${lang}/${ROUTES.PRODUCT}/${item.item.detailPageSlug}`;
                }
              }}
              className={`h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-md
              ${item.item.hasDetailPage && item.item.detailPageSlug?.length ? "cursor-pointer" : ""}
              ${isThisProductDimmed ? "opacity-50" : ""}
            `}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.item.images[0]}`}
                alt="product"
                width={0}
                height={0}
                sizes="100vw"
                className="aspect-square h-full w-full object-cover"
              />
            </div>
            <div className="mb-5 w-full pl-5  transition duration-300" onTouchStart={handleSwipeStart}>
              <p className={`text-[14px] font-medium leading-[18px] ${isThisProductDimmed ? "opacity-50" : ""}`}>{item.item.nameJp}</p>
              <div className={`flex w-full justify-between ${isThisProductDimmed ? "opacity-50" : ""}`}>
                <p className="mb-[10px] text-[16px] font-medium leading-[22px]">{item.item.name}</p>
                {item.item.type === "SET" && item.subItems?.length && (
                  <button className="h-[22px] w-[22px]" onClick={() => setIsExpandSubItems(!isExpandSubItems)}>
                    <Image
                      src={isExpandSubItems ? showSub : hideSub}
                      alt="showSub"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-full w-full object-contain"
                    />
                  </button>
                )}
              </div>
              {isExpandSubItems && (
                <div className={`mb-[10px] w-full ${isThisProductDimmed ? "opacity-50" : ""}`}>
                  {item.subItems?.map((item, index) => (
                    <React.Fragment key={index}>
                      <span
                        className=" text-[12px] font-normal leading-4 tracking-tight text-black opacity-60"
                        key={index}
                      >
                        x{item.quantity} {item.item.name}
                      </span>
                      &nbsp;
                    </React.Fragment>
                  ))}
                </div>
              )}
              {item.item.type === "SET" && (
                <AddToCartButton<"isCartPage">
                  product={{ ...item.item, cartKey: item.cartKey }}
                  lang={lang}
                  mode={"EDIT_BUTTON"}
                  containerClasses="!justify-start mb-4"
                  source="cart"
                  isPLP={true}
                />
              )}
              {item.item.remark &&
              item.item.remark.length > 0 &&
                <div
                  className={`mb-4 mt-1 block rounded-md bg-primaryGrey px-4 py-2 text-[14px] leading-[14px] text-primaryDark ${isThisProductDimmed ? "opacity-50" : ""}`}
                  dangerouslySetInnerHTML={{ __html: item.item.remark }}
                />
              }
              <div className={`flex items-center text-[14px] font-semibold ${isThisProductDimmed ? "opacity-50" : ""}`}>
                {item.unitPrice !== undefined && <p className="mr-4 leading-[19.6px] opacity-60">${item.unitPrice}</p>}
                <p className={`${item.unitPrice ? "line-through" : ""} text-center text-[16px] leading-5`}>
                  ${item.item.price}
                </p>
              </div>
            </div>
          </div>
          <div className={`flex items-center justify-between ${isThisProductDimmed ? "opacity-50" : ""}`}>
            <div className="row flex items-center">
              <p className="mr-2 text-[18px] font-semibold leading-[25.2px]">{translate("cart.sub")}</p>
              {item.discountSubTotalPrice !== undefined && (
                <p className="mr-2 leading-[19.6px] opacity-60">${item.discountSubTotalPrice}</p>
              )}
              <p
                className={`${
                  item.discountSubTotalPrice ? "line-through" : ""
                } text-[18px] font-semibold leading-[25.2px]`}
              >
                ${item.subTotalPrice}
              </p>
            </div>
            <div className="relative">
              <AddToCartButton<"isCartPage">
                product={{ ...item.item, cartKey: item.cartKey }}
                lang={lang}
                mode={"SHORT_BUTTON"}
                disable={mode === "GIFT"}
                isAllowZero={!item.isAllowDelete}
                type={"smallSize"}
                isGiftItem={mode === "GIFT"}
                source="cart"
                isPLP={true}
              />
            </div>
          </div>
        </div>
      </div>
      {swipeActivated && (
        <div className={`absolute right-[6.5rem] top-[17px] z-[999] flex h-[133px] w-[88px] translate-x-full transform cursor-pointer items-center justify-center rounded-2xl bg-primaryPurple text-white transition-transform ${isThisProductDimmed ? "opacity-50" : ""}`}>
          <button className="h-[32px] w-[32px]" onClick={() => handleDeleteClick(item.skuCode)}>
            <Image
              src={trashCanIcon}
              alt="deleteItem"
              width={0}
              height={0}
              sizes="100vw"
              className="h-full w-full object-contain"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileCartTableContainer;
