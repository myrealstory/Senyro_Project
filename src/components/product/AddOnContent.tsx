"use client";

import React, { useEffect } from "react";
import Image from "next/image";

import IconUp from "@/../images/icons/Icon_up@3x.png";
import DiscountTagIcon from "@/../images/icons/Icon_discount.png";
import DiscountTagIconDark from "@/../images/icons/Icon_discount_Dark.png";
import { ROUTES } from "@/constants/routes";
import { SlidePanel } from "@/components/SlidePanel";
import { useWindowSize } from "@/hook/useWindowSize";
import { useTranslation } from "@/app/i18n/client";
import { AddToCartButton } from "../AddToCartButton";
import { AddOnContentType } from "@/types/componentTypes";

import Recommend from "../cart/Recommend";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAddCartRequestMutation, useLazyGetCartRequestQuery } from "@/redux/api/cartSliceApi";
import { handleAlertMessage } from "@/utils/clientUtils";
import { InnerAlert } from "@/components/InnerAlert";
import { RootState } from "@/redux/store";
import { useCartPickupStep } from "@/hook/useCartPickupStep";

export const AddOnContent = ({ addOnList, lang }: AddOnContentType) => {
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();
  const [getCartRequest] = useLazyGetCartRequestQuery();
  const { selectedBranchCode } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const { isAddingToCart } = useSelector((state: RootState) => state.generalState);
  const { getPickupDatetime } = useCartPickupStep({ lang });
  const [addCartRequest] = useAddCartRequestMutation();
  const isMobileView = width < 1024;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!addOnList?.addonProducts?.length) {
      dispatch(setLoadingScreenDisplay(true));
      setInterval(() => {
        const header = document.getElementById("header");
        const footer = document.getElementById("footer");
        if (header) {
          header.innerHTML = "";
        }
        if (footer) {
          footer.innerHTML = "";
        }
      }, 100);

      window.location.href = `/${lang}/${ROUTES.CHECKOUT}`;
    } else {
      setTimeout(() => {
        dispatch(setLoadingScreenDisplay(false));
      }, 500);
    }
  }, [addOnList]);

  const scrolltoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderAddOnList = () => {
    if (isMobileView) {
      return <Recommend recommendData={addOnList.addonProducts} mode="ADD-ON" />;
    }

    return (
      <div className="flex flex-wrap justify-center md:grid md:grid-cols-1 md:justify-between lg:grid-cols-2 lg:gap-4 2xl:gap-4">
        {addOnList.addonProducts.map((item, index: number) => {
          return (
            <div key={index} className="mb-7 h-auto w-full lg:mb-9">
              <div className="relative mb-4 aspect-square h-auto lg:mb-6">
                <div className="absolute right-[20px] top-[20px] z-20">
                  <AddToCartButton<"isMainProduct">
                    product={item}
                    lang={lang}
                    mode={"SHORT_BUTTON"}
                    refCategoryType="ADD_ON"
                    refCategoryTypeId={item.addonCampaignId}
                    source="addon"
                  />
                </div>
                {/* Discount info */}
                <div className={"relative h-full w-full overflow-hidden rounded-[13px] "}>
                  <div className="add-on-image"></div>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.images[0]}`}
                    alt={item.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="aspect-square h-full w-full object-cover"
                  />
                  {/* topup price */}
                  <div
                    className={`absolute bottom-0 left-0 flex w-full items-center rounded-b-[13px] ${
                      item.darkBackground === true ? "z-[1] bg-white" : "bg-primaryGold/75"
                    }  py-[13px] pl-[22px] pr-[20px] opacity-95 sm:py-[8px] md:min-h-[60px] md:pl-5 2xl:py-[10px]`}
                  >
                    <div className="mr-3 lg:mr-4 ">
                      <Image
                        src={item.darkBackground === true ? DiscountTagIconDark : DiscountTagIcon}
                        alt="DiscountTagIcon"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="aspect-square h-auto w-[20px] lg:w-[25zpx]"
                      />
                    </div>
                    <div
                      className={`white flex-wrap ${
                        item.darkBackground === true ? "text-primaryDark" : "text-white"
                      }  md:flex lg:whitespace-nowrap`}
                    >
                      <span className=" mr-2 text-[20px] font-bold leading-[22px] sm:block lg:leading-6 2xl:text-h4">
                        <span className="hidden sm:inline">{translate("menu.topup")}</span>
                        <span>${item.addonPrice ?? item.price}</span>
                      </span>
                      {item.addonPrice && (
                        <span className=" text-[14px] leading-[22px]">
                          {translate("menu.oriprice")} ${item.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2 text-center ${
                  item.darkBackground === true ? "text-primaryDark" : "text-white"
                }  lg:gap-3`}
              >
                <p className=" text-[14px] leading-[16px]">{item.nameJp}</p>
                <p className=" text-[22px] font-bold leading-[20px] text-primaryDark md:text-h4">{item.name}</p>
                {item.attribute && (
                  <p
                    dangerouslySetInnerHTML={{ __html: item.attribute }}
                    className="text-[14px] font-medium leading-[16px] opacity-60 drop-shadow-md md:block"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!addOnList?.addonProducts?.length) {
    return <></>;
  }

  return (
    <>
      <div className="md:wrapper relative mx-auto px-4 py-8 md:px-0 md:pb-10 md:pt-10">
        <div className="mb-7 md:mb-4 lg:mb-4">
          <h1 className="checkoutTitle">{translate("AddOn.title")}</h1>
        </div>

        {isMobileView && (
          <div className="mb-4 rounded-[10px] bg-secondaryLightSand p-3 px-4 md:w-full lg:mb-5 lg:hidden">
            <p className="md:text-2xl text-center text-[14px] leading-[19px] md:leading-[30px]">
              {translate("AddOn.lorem2")}
            </p>
          </div>
        )}

        <div className="relative flex flex-col justify-between md:flex-row md:gap-7 2xl:gap-20">
          <button
            onClick={scrolltoTop}
            className={
              "fixed bottom-[180px] right-4 z-50 hidden h-[48px] w-[48px] items-center justify-center rounded-full bg-white60 sm:bottom-[15%] md:bottom-[20%] md:flex md:h-[3.1vw] md:w-[3.1vw] lg:h-[4.16vw] lg:w-[4.16vw]"
            }
          >
            <Image src={IconUp} alt="" className="h-2 w-4" />
          </button>
          <div className="w-full xl:w-[60%]">
            {!isMobileView && (
              <div className="mb-4 rounded-[10px] bg-secondaryLightSand p-3 md:w-full lg:mb-7">
                <p className="p-1 text-[14px] leading-[19px] md:leading-[30px] 2xl:text-16">
                  {addOnList.promotionMessage}
                </p>
              </div>
            )}
            <InnerAlert containerStyle="mb-5" />
            {renderAddOnList()}
          </div>
          <div className="relative w-1/2 lg:w-[40%] ">
            <SlidePanel
              mode="NORMAL"
              disabled={isAddingToCart}
              onClick={() => {
                dispatch(setLoadingScreenDisplay(true));
                getCartRequest({
                  lang,
                  isCartPage: true,
                  source: "addon",
                })
                  .unwrap()
                  .then(res => {
                    if (res.statusCode === 200 && res.data.alertList?.length) {
                      dispatch(setLoadingScreenDisplay(false));
                      handleAlertMessage({
                        alertList: res.data.alertList,
                        dispatch,
                        translate,
                        lang,
                        extraInfo: {
                          branchCode: selectedBranchCode,
                          pickupDatetime: getPickupDatetime(),
                        },
                        addCartRequest,
                        getCartRequest,
                      });
                    } else {
                      window.location.href = `/${lang}/${ROUTES.CHECKOUT}`;
                    }
                  });
              }}
              lang={lang}
              containerStyle="lg:w-[460px]"
            />
          </div>
        </div>
      </div>
    </>
  );
};
