import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";

import "@/style/auth/auth.scss";
import TickGold from "@/images/icons/Icon_tick_Gold@3x.png";
import IconNext from "@/images/icons/Icon_arrow-right-white@3x.png";
import EditPenWhite from "@/images/icons/Icon_edit_Gold@3x.png";
import { ROUTES } from "@/constants/routes";
import { RootState } from "@/redux/store";
import { useWindowSize } from "@/hook/useWindowSize";
import { useTranslation } from "@/app/i18n/client";
import { SlidePanelType } from "@/types/componentTypes";
import { getRouteNameFromPathname } from "@/utils/commonUtils";

import { MobileButtonContainer } from "./layout/MobileButtonContainer";
import { CustomVerticalScrollBar } from "./CustomVerticalScrollBar";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";

export const SlidePanel = ({ onClick, disabled, lang, mode, isEditButtonHidden, containerStyle }: SlidePanelType) => {
  const { apiData } = useSelector((state: RootState) => state.cart);
  const cartItems = apiData.cart;
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAddOnPage = getRouteNameFromPathname(pathname).thirdSlug === ROUTES.ADD_ON;
  const isCheckoutPage = getRouteNameFromPathname(pathname).secondSlug === ROUTES.CHECKOUT;

  const isMobileView = width < 1024;

  const [isExpanded, setIsExpanded] = React.useState(() => {
    if (width > 640) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (isExpanded === true) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isExpanded, width]);

  const renderModifierList = () => {
    const style = {
      image: isMobileView ? "h-auto w-[12px]" : "h-auto w-[15px]",
      text: isMobileView ? "text-[16px] leading-[20px]" : "text-[13px] font-medium leading-[20px]",
    };

    return cartItems?.modifiers
      .filter(item => item.isSelected === true)
      .map((pickup, i) => (
        <div className="mr-4 flex items-center gap-2" key={i}>
          <Image src={TickGold} alt="TickGold" width={0} height={0} sizes="100vw" className={style.image} />
          <p className={style.text}>{pickup.modifierName}</p>
        </div>
      ));
  };

  const renderProductList = () => {
    const style = {
      name: isMobileView ? "leading-[13px]" : "leading-[20px]",
      quantity: isMobileView ? "leading-[15px]" : "leading-[20px]",
      price: isMobileView ? "leading-[15px]" : "leading-[20px]",
    };

    return cartItems?.cartItems.concat(cartItems.gifts ?? []).map((item, i) => (
      <ul key={i} className=" flex">
        <li className={`w-[60%] flex-shrink-0 pb-3 text-left text-[14px] ${style.name}`}>{item.item.name}</li>
        <li className={`w-[15%] flex-shrink-0 text-center text-[14px] ${style.quantity}`}>{item.quantity}</li>
        <li className={`w-[25%] flex-shrink-0 text-right text-[14px] ${style.price}`}>
          ${item.subTotalPrice}
        </li>
      </ul>
    ));
  };

  const renderDiscountList = () => {
    if (!apiData.cart?.summary?.summaryDiscount || !apiData.cart?.summary?.summaryDiscount?.length) {
      return <></>;
    }

    const style = {
      text: isMobileView ? "text-[14px]" : "text-14",
    };

    const list = apiData.cart?.summary?.summaryDiscount.map((discount, index) => (
      <ul key={index} className={`mb-4 flex justify-between leading-5 ${style.text} pr-2 md:pr-[23px] 2xl:pr-4`}>
        <li className="w-[80%] whitespace-break-spaces">{discount.promotionMessage}</li>
        <li>-${discount.discount}</li>
      </ul>
    ));

    if (apiData.cart?.summary?.memberPointRedeemPrice?.length) {
      list.push(
        <ul className={`mb-2 flex justify-between leading-5 ${style.text} pr-2 md:pr-[26px] 2xl:pr-4`}>
          <li className="w-[80%] whitespace-break-spaces">{translate("checkout.srPoints")}</li>
          <li>{apiData.cart?.summary?.memberPointRedeemPrice}</li>
        </ul>
      );
    }

    return list;
  };

  const renderContent = () => {
    if (mode === "NORMAL" && isMobileView) {
      return (
        <MobileButtonContainer zIndex={isCheckoutPage ? 999 : undefined}>
          <MobileBottomSheet
            onProcess={onClick}
            isEditButtonHidden={true}
            onScrollUp={() => setIsExpanded(true)}
            onScrollDown={() => setIsExpanded(false)}
            isCheckoutPage={isCheckoutPage}
            isButtonDisable={disabled}
          />
        </MobileButtonContainer>
      );
    } else if ((mode === "NORMAL" && !isMobileView) || mode === "CHECKOUT") {
      return (
        <div
          className={`${
            mode === "NORMAL" ? "hidden lg:block" : ""
          } sticky right-0 top-20 h-fit rounded-t-3xl ${containerStyle}  ${isAddOnPage && "md:mt-[-3.5rem]"}`}
        >
          <div className="relative w-full bg-white60 py-4 pl-5 pr-4 md:rounded-3xl md:bg-white md:pb-16 md:pl-10 md:pt-10 2xl:pb-16 2xl:pl-8 2xl:pt-8">
            <div className="flex w-full items-center justify-between pb-2 pr-1 md:pr-[26px] 2xl:pr-4">
              <p className="font-semibold md:text-20 2xl:text-24">
                {translate("cart.ordersummary")} (<span className="inline-block px-[2px]">{cartItems?.itemCount}</span>)
              </p>
              {!isEditButtonHidden && (
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    dispatch(
                      setGlobalAlertStatus({
                        isGlobalAlertDisplay: true,
                        alertContent: translate("alertModal.g30_popup_content"),
                        leftButtonText: translate("alertModal.g30_popup_left_button_text"),
                        rightButtonText: translate("alertModal.g30_popup_right_button_text"),
                        onRightButtonClick: () => {
                          window.location.href = `/${lang}/${ROUTES.CART}`;
                        },
                      })
                    );
                  }}
                >
                  <Image src={EditPenWhite} alt="Edit" width={0} height={0} sizes="100vw" className="mr-2 h-5 w-5" />
                  <p className="text4 leading-[18px] text-primaryGold">{translate("cart.edit")}</p>
                </div>
              )}
            </div>
            <div className="mb-5 flex pr-2  md:pr-[26px] 2xl:pr-4">{renderModifierList()}</div>
            <table className="mb-5 w-full pr-4 ">
              <thead>
                <tr className="text-[12px] uppercase">
                  <th className="w-[55%] text-left font-medium text-secondaryLightGold1 lg:text-primaryMine/60">
                    {translate("cart.item")}
                  </th>
                  <th className="w-[15%] font-medium text-primaryMine/60">{translate("cart.qty")}</th>
                  <th className="w-[30%] pr-2 text-right font-medium text-primaryMine/60 md:pr-[26px] 2xl:pr-4">
                    {translate("cart.sub")}
                  </th>
                </tr>
              </thead>
            </table>
            <CustomVerticalScrollBar
              maxHeight={180}
              showScrollBar={cartItems?.cartItems && cartItems.cartItems.length >= 4}
              scrollBarColor={"primaryGold"}
              containerStlye="mb-2"
              scrollContainerStyle="pr-2 md:pr-[26px] 2xl:pr-4"
            >
              {renderProductList()}
            </CustomVerticalScrollBar>
            <ul className="mb-5 flex justify-between pr-2 text-[17px] font-semibold leading-6 md:pr-[26px] 2xl:pr-4">
              <li>
                {translate("cart.itemTotal")}
                {"\u00A0"}({cartItems?.itemCount})
              </li>
              <li>${cartItems?.summary?.itemTotal}</li>
            </ul>

            {renderDiscountList()}

            <ul className="mb-4 flex justify-between pr-2 text-[17px] font-semibold leading-6 md:pr-[26px] 2xl:pr-4">
              <li>{translate("cart.totalAmount")}</li>
              <li>${cartItems?.summary?.totalAmount}</li>
            </ul>
            <button
              className="relative mr-2 hidden h-[56px] w-full items-center justify-center rounded-full bg-primaryGold disabled:cursor-default disabled:opacity-40 disabled:active:bg-primaryGold md:flex md:h-[50px] md:w-[calc(100%-26px)] 2xl:w-[calc(100%-1rem)]"
              onClick={onClick}
              disabled={disabled}
              type="button"
            >
              <p className="mr-2 text-20 leading-6 text-white">
                {translate(isCheckoutPage ? "cart.confirmpay" : "cart.proceed")}
              </p>
              <Image src={IconNext} alt="IconNext" width={0} height={0} sizes="100vw" className="h-[26px] w-[26px]" />
              <p className="absolute -bottom-6 left-1/2 w-full -translate-x-1/2 text-center text-[12px] font-medium italic leading-3 text-primaryDark/50">
                {translate("cart.merchant")}
              </p>
            </button>
          </div>
          {isCheckoutPage && (
            <p className="mt-[1.125vw] hidden text-center text-16 leading-[19px] md:block ">
              {translate("checkout.orderDisclaim")}
            </p>
          )}
        </div>
      );
    }

    return <></>;
  };

  return (
    <div
      className={`${
        isExpanded ? "fixed left-0 top-0 z-[998] h-full w-full bg-primaryDark " : !isMobileView ? "relative h-full" : ""
      }`}
    >
      {renderContent()}
    </div>
  );
};
