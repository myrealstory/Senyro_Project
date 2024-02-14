import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import IconNext from "@/images/icons/Icon_arrow-right-white@3x.png";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";

import "react-spring-bottom-sheet/dist/style.css";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import EditPenWhite from "@/images/icons/Icon_edit_Gold@3x.png";
import TickGold from "@/images/icons/Icon_tick_Gold@3x.png";
import { CustomVerticalScrollBar } from "./CustomVerticalScrollBar";
import { CSSTransition } from "react-transition-group";

import "@/style/customBottomSheet.css";
import { ROUTES } from "@/constants";
import { getLangFromString, getRouteNameFromPathname } from "@/utils/commonUtils";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hook/useWindowSize";

export const MobileBottomSheet = ({
  onProcess,
  isEditButtonHidden = false,
  isCheckoutPage,
  isButtonDisable,
  onScrollUp,
  onScrollDown,
}: {
  onProcess: (...params: any) => any;
  isEditButtonHidden?: boolean;
  isCheckoutPage?: boolean;
  isButtonDisable?: boolean;
  onScrollUp?: (...params: any) => any;
  onScrollDown?: (...params: any) => any;
}) => {
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);
  const { apiData } = useSelector((state: RootState) => state.cart);
  const cartItems = apiData.cart;
  const slug = getRouteNameFromPathname(path);
  const isAddon = slug.thirdSlug === ROUTES.ADD_ON;
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [displayHeaderOnly, setDisplayHeaderOnly] = useState(true);
  const [isSheetReady, setIsSheetReady] = useState(false);
  const { scrollY, isAppear } = useWindowSize();
  const focusRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<BottomSheetRef>();
  const firstNodeRef = useRef(null);
  const secondNodeRef = useRef(null);
  const maxHeightRef = useRef(0);
  const headerFactor = 65;
  const contentFactor = 100;

  useEffect(() => {
    setTimeout(() => setIsSheetReady(true), 300);
  }, []);

  useEffect(() => {
    if (!displayHeaderOnly) {
      const SheetContentDiv = document.getElementById("sheetContent");
      if (SheetContentDiv) {
        const divRect = SheetContentDiv.getBoundingClientRect();
        setContentHeight(divRect.height + contentFactor);
      }
    } else if (displayHeaderOnly && maxHeightRef.current > 0) {
      setContentHeight(maxHeightRef.current / 2 + contentFactor);
    }
  }, [displayHeaderOnly]);

  useEffect(() => {
    const SheetHeaderDiv = document.getElementById("SheetHeader");
    if (SheetHeaderDiv) {
      const divRect = SheetHeaderDiv.getBoundingClientRect();
      const totalHeight = divRect.height + headerFactor + 17;
      setHeaderHeight(() => {
        return isAddon ? totalHeight : !isAppear ? totalHeight - 50 : totalHeight;
      });
    }
  }, [isSheetReady, scrollY]);

  const sheetHeader = (containerClasses?: string) => {
    return (
      <div
        id="SheetHeader"
        ref={focusRef}
        className={`mb-1 flex w-full flex-row items-center justify-between ${containerClasses}`}
      >
        <div
          style={{
            flexDirection: "column",
          }}
        >
          <p className="mb-2 text-[14px] uppercase leading-[14px] opacity-60">{translate("cart.total")}</p>
          <p className="mb-2 text-[26px] font-semibold leading-[20px]">${cartItems?.summary?.totalAmount}</p>
          <p className="text-[12px] leading-[14px] opacity-60 ">
            ({cartItems?.itemCount} {translate("cart.items")})
          </p>
        </div>
        <button
          className="flex h-[56px] w-[53vw] items-center justify-center rounded-full bg-primaryGold disabled:opacity-40"
          onClick={onProcess}
          disabled={isButtonDisable}
        >
          <p className="mr-2 text-[18px] leading-[21px] text-white">
            {translate(isCheckoutPage ? "cart.confirmpay" : "cart.proceed")}
          </p>
          <Image src={IconNext} alt="IconNext" width={0} height={0} sizes="100vw" className="h-[26px] w-[26px]" />
        </button>
      </div>
    );
  };

  const renderModifierList = () => {
    const style = {
      image: "h-auto w-[15px]",
      text: "text-[13px] font-medium leading-[20px]",
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
      name: "leading-[20px]",
      quantity: "leading-[20px]",
      price: "leading-[20px]",
    };

    return cartItems?.cartItems.concat(cartItems.gifts ?? []).map((item, i) => (
      <ul key={i} className=" flex">
        <li className={`w-[60%] flex-shrink-0 pb-3 text-left text-[14px] ${style.name}`}>{item.item.name}</li>
        <li className={`w-[15%] flex-shrink-0 text-center text-[14px] ${style.quantity}`}>{item.quantity}</li>
        <li className={`w-[25%] flex-shrink-0 text-right text-[14px] ${style.price}`}>${item.subTotalPrice}</li>
      </ul>
    ));
  };

  const renderDiscountList = () => {
    if (!apiData.cart?.summary?.summaryDiscount || !apiData.cart?.summary?.summaryDiscount?.length) {
      return <></>;
    }

    const style = {
      text: "text-14",
    };

    return apiData.cart?.summary?.summaryDiscount.map((discount, index) => (
      <ul key={index} className={`mb-2 flex justify-between leading-5 ${style.text} pr-2 md:pr-[26px] 2xl:pr-4`}>
        <li className="w-[80%] whitespace-break-spaces">{discount.promotionMessage}</li>
        <li>${discount.discount}</li>
      </ul>
    ));
  };

  const renderHeaderInBottom = () => {
    return [
      sheetHeader("mt-5"),
      <p
        key="bottomMessage"
        className="mb-[20px] mt-[15px] text-center text-[12px] font-medium italic leading-3 opacity-50"
      >
        {translate("cart.merchant")}
      </p>,
    ];
  };

  const sheetContent = () => {
    return (
      <div id="sheetContent" className={"w-full p-5"}>
        <div className="flex w-full items-center justify-between">
          <p className="md:text-xl text-[20px] font-semibold">
            {translate("cart.ordersummary")}
            {"\u00A0"}({cartItems?.itemCount})
          </p>
          {!isEditButtonHidden && (
            <div
              className="flex cursor-pointer"
              onClick={() => {
                window.location.href = `/${ROUTES.CART}`;
              }}
            >
              <Image src={EditPenWhite} alt="Edit" width={0} height={0} sizes="100vw" className="mr-2 h-5 w-5" />
              <p className="text4 leading-[18px] text-primaryGold">{translate("cart.Edit")}</p>
            </div>
          )}
        </div>
        <div className="mb-[27px] mt-5 flex md:mb-[33px] xl:mt-1">{renderModifierList()}</div>
        <table className="mb-5 w-full">
          <thead>
            <tr className="text-[12px] uppercase">
              <th className="w-[60%] text-left text-secondaryLightGold1 ">{translate("cart.item")}</th>
              <th className="w-[10%] text-primaryMine/60 ">{translate("cart.qty")}</th>
              <th className="w-[30%] text-right text-primaryMine/60">{translate("cart.sub")}</th>
            </tr>
          </thead>
        </table>
        <CustomVerticalScrollBar
          maxHeight={180}
          showScrollBar={cartItems?.cartItems && cartItems.cartItems?.length >= 4}
          scrollBarColor={"primaryGold"}
        >
          {renderProductList()}
        </CustomVerticalScrollBar>
        <ul className="mb-6 flex justify-between pr-5 pt-5 text-[20px] font-medium leading-5">
          <li>
            {translate("cart.itemTotal")}
            {"\u00A0"}({cartItems?.itemCount})
          </li>
          <li>{cartItems?.summary?.itemTotal}</li>
        </ul>
        {renderDiscountList()}
        {renderHeaderInBottom()}
      </div>
    );
  };

  const defaultRender = (isCheckoutPage: boolean) => {
    return isCheckoutPage ? (
      sheetHeader("py-4 md:px-5")
    ) : (
      <BottomSheet
        className="relative z-[998]"
        open={true}
        blocking={false}
        scrollLocking={false}
        skipInitialTransition
        ref={ref => {
          if (ref) {
            sheetRef.current = ref;
          }
        }}
        initialFocusRef={focusRef}
        defaultSnap={() => headerHeight}
        snapPoints={({ maxHeight }: { maxHeight: number }) => {
          maxHeightRef.current = maxHeight;
          return [headerHeight, contentHeight > 0 ? contentHeight + 25 : maxHeight / 2 + 25];
        }}
        onSpringEnd={async event => {
          if (event.type === "SNAP" && event.source === "dragging" && !isCheckoutPage) {
            if (sheetRef?.current && sheetRef?.current?.height > headerHeight) {
              setDisplayHeaderOnly(false);
              onScrollUp && onScrollUp();
            } else {
              setDisplayHeaderOnly(true);
              onScrollDown && onScrollDown();
            }
          }
        }}
      >
        <CSSTransition
          in={displayHeaderOnly}
          nodeRef={firstNodeRef}
          timeout={100}
          classNames="fade"
          unmountOnExit
          onEnter={() => null}
          onExited={() => null}
        >
          <div ref={firstNodeRef}>{displayHeaderOnly && sheetHeader("py-4 px-5")}</div>
        </CSSTransition>
        <CSSTransition
          in={!displayHeaderOnly}
          nodeRef={secondNodeRef}
          timeout={100}
          classNames="fade"
          unmountOnExit
          onEnter={() => null}
          onExited={() => null}
        >
          <div ref={secondNodeRef}>{sheetContent()}</div>
        </CSSTransition>
      </BottomSheet>
    );
  };

  return defaultRender(isCheckoutPage ? isCheckoutPage : false);
};
