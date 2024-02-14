"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import "@/style/scrollBar/scrollBar.css";
import deleteIcon from "@/images/icons/Icon_trash-primary@3x.png";
import { useCart } from "@/hook/useCart";
import { CartTableType } from "@/types/componentTypes";
import { useTranslation } from "@/app/i18n/client";
import { getLangFromString } from "@/utils/commonUtils";

import { AddToCartButton } from "../AddToCartButton";
import { ROUTES } from "@/constants";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const DesktopCartTable = ({ cartData, mode }: CartTableType) => {
  const path = usePathname();
  const dispatch = useDispatch();
  const lang = getLangFromString(path);

  const { translate } = useTranslation(lang);

  const { deleteAllProduct, deleteProductFromCart } = useCart({ lang });
  const { dimmedSetProductSkuCodes } = useSelector((state: RootState) => state.generalState);

  return (
    <table className="hidden w-full border-collapse md:table">
      <thead className="">
        <tr className="text-16 font-medium uppercase leading-[20px] 2xl:text-18">
          <th className="pb-6 text-left font-medium md:w-[18%] lg:w-[15%] 2xl:w-[12%]">
            {mode === "PRODUCT" ? translate("cart.item") : translate("cart.gift")}
          </th>
          <th className="w-[40%]"></th>
          <th className="w-[13%] font-medium">{mode === "PRODUCT" ? translate("cart.price") : ""}</th>
          <th className="w-[13%] font-medium">{mode === "PRODUCT" ? translate("cart.sub") : ""}</th>
          <th className="w-[13%] font-medium ">{mode === "PRODUCT" ? translate("cart.qty") : ""}</th>
          <th className="w-auto">
            {mode === "PRODUCT" && (
              <div
                className="flex cursor-pointer flex-row items-center justify-end"
                onClick={() => {
                  dispatch(
                    setGlobalAlertStatus({
                      isGlobalAlertDisplay: true,
                      alertTitle: translate("alertModal.g8_popup_title"),
                      alertContent: "",
                      leftButtonText: translate("alertModal.g8_popup_left_button_text"),
                      rightButtonText: translate("alertModal.g8_popup_right_button_text"),
                      onRightButtonClick: () => {
                        deleteAllProduct();
                      },
                    })
                  );
                }}
              >
                <Image src={deleteIcon} alt="123" width={0} height={0} sizes="100vw" className="trashBlock" />
                <span className="text-20 font-normal normal-case text-primaryGold md:text-14 2xl:text-16">
                  {translate("cart.all")}
                </span>
              </div>
            )}
          </th>
        </tr>
      </thead>
      <tbody className="w-full">
        {cartData.map((product, i) => {
          let isThisProductDimmed = false;
          if (dimmedSetProductSkuCodes.find(skuCode => skuCode === product.skuCode || skuCode === product.cartKey)) {
            isThisProductDimmed = true;
          }

          return (
            <React.Fragment key={i}>
              <tr className="">
                <td className="">
                  <div
                    onClick={() => {
                      if (product.item.hasDetailPage && product.item.detailPageSlug?.length) {
                        window.location.href = `/${lang}/${ROUTES.PRODUCT}/${product.item.detailPageSlug}`;
                      }
                    }}
                    className={`h-auto overflow-hidden rounded-lg shadow-imageShadow md:w-[100px]  lg:w-[120px] 2xl:w-[140px]
                  ${product.item.hasDetailPage && product.item.detailPageSlug?.length ? "cursor-pointer" : ""}
                  ${isThisProductDimmed ? "opacity-50" : ""}
                `}
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.item.images[0]}`}
                      alt="product"
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </td>
                <td className="">
                  <p
                    className={`mb-[4px] text-[12px] leading-[20px] sm:mb-[8px] md:text-12 md:leading-5 lg:mb-[0.7vw] 2xl:text-16 ${
                      isThisProductDimmed ? "opacity-50" : ""
                    }`}
                  >
                    {product.item.nameJp}
                  </p>
                  <p
                    className={`mb-[4px] text-18 font-semibold leading-8 sm:mb-[8px] lg:mb-4 lg:text-24 lg:leading-8 ${
                      isThisProductDimmed ? "opacity-50" : ""
                    }`}
                  >
                    {product.item.name}
                  </p>
                  {product?.subItems?.length && (
                    <>
                      <div
                        className={`mb-[4px] w-full leading-6 sm:mb-[8px] lg:mb-[0.7vw] ${
                          isThisProductDimmed ? "opacity-50" : ""
                        }`}
                      >
                        {product.subItems &&
                          product.subItems.map((subItem, index) => (
                            <React.Fragment key={index}>
                              <span
                                className=" text-[12px] font-normal tracking-tight text-black opacity-60 sm:text-lg"
                                key={index}
                              >
                                {index !== 0 ? ", " : ""}x{subItem.quantity} {subItem.item.name}
                              </span>
                            </React.Fragment>
                          ))}
                      </div>

                      <AddToCartButton<"isCartPage">
                        key={product.cartKey ?? product.skuCode}
                        product={{ ...product.item, cartKey: product.cartKey }}
                        lang={lang}
                        mode={"EDIT_BUTTON"}
                        source="cart"
                        isPLP={true}
                      />
                    </>
                  )}
                  {product.item.remark && product.item.remark.length > 0 && (
                    <div
                      className={`mb-4 mt-1 block rounded-md bg-primaryGrey px-4 py-2 text-[14px] leading-[18px] text-primaryDark ${
                        isThisProductDimmed ? "opacity-50" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: product.item.remark }}
                    />
                  )}
                </td>
                <td className={`md:pr-4 lg:pr-0 ${isThisProductDimmed ? "opacity-50" : ""}`}>
                  <div className="flex flex-col items-center">
                    <p
                      className={`${
                        product.unitPrice ? "line-through" : ""
                      } whitespace-nowrap text-center text-20 font-semibold leading-5 lg:text-24 `}
                    >
                      ${product.item.price}
                    </p>
                    {product.unitPrice !== undefined && (
                      <p className="mt-2 text-16 leading-5 opacity-60 lg:text-20">${product.unitPrice}</p>
                    )}
                  </div>
                </td>
                <td className={`md:pr-4 lg:pr-0 ${isThisProductDimmed ? "opacity-50" : ""}`}>
                  <div className="flex flex-col items-center ">
                    <p
                      className={`${
                        product.discountSubTotalPrice ? "line-through" : ""
                      } whitespace-nowrap text-center text-20 font-semibold lg:text-24`}
                    >
                      ${product.subTotalPrice}
                    </p>
                    {product.discountSubTotalPrice !== undefined && (
                      <p className="mt-2 text-16 leading-[20px] opacity-60 lg:text-20">
                        ${product.discountSubTotalPrice}
                      </p>
                    )}
                  </div>
                </td>
                <td className={`relative md:pr-4 lg:pr-0 ${isThisProductDimmed ? "opacity-50" : ""}`}>
                  <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2">
                    <AddToCartButton<"isCartPage">
                      key={product.cartKey ?? product.skuCode}
                      product={{ ...product.item, cartKey: product.cartKey }}
                      lang={lang}
                      mode={"CALCULATOR"}
                      disable={mode === "GIFT"}
                      isAllowZero={!product.isAllowDelete}
                      isGiftItem={mode === "GIFT"}
                      source="cart"
                      isPLP={true}
                    />
                  </div>
                </td>

                {product.isAllowDelete && (
                  <td className="relative">
                    {
                      <button
                        className={"transIcon"}
                        onClick={() => deleteProductFromCart(product.skuCode, product.cartKey as string)}
                      >
                        <Image
                          src={deleteIcon}
                          alt="123"
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    }
                  </td>
                )}
              </tr>
              <tr className="relative -z-[10] h-[2vw] w-full">
                <td className="relative " colSpan={6}>
                  <div className="border-t border-solid border-primaryGold2"></div>
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
