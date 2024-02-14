"use client";
import Image from "next/image";
import debounce from "lodash.debounce";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import "@/style/index/indexUsed.scss";
import { RootState } from "@/redux/store";
import { useWindowSize } from "@/hook/useWindowSize";
import { useTranslation } from "@/app/i18n/client";
import { MainProductType } from "@/types/productTypes";
import { useAddToCartButton } from "@/hook/useAddToCartButton";
import { AddToCartButtonType } from "@/types/componentTypes";
import { setQuotaAlertSkuCode, setSetProductPopupData } from "@/redux/slice/cartSlice";
import { getProductQuantityFromCart, getRouteNameFromPathname, isUserHasSelectedBranch } from "@/utils/commonUtils";
import IconPlus from "@/../images/icons/Icon_plus-white@3x.png";
import CartIcon from "@/../../images/icons/Icon_MobileCartPlus@3x.png";
import IconCart from "@/../images/icons/Icon_shopping-cart-white@3x.png";
import MobilePlus from "@/images/icons/Icon_plus_Gold@3x.svg";
import MobileMinus from "@/images/icons/Icon_minus_Gold@3x.svg";

import CustomButton from "./CustomButton";
import { ROUTES } from "@/constants";
import { QuotaAlert } from "./QuotaAlert";
import {
  resetReminderAlertStatus,
  setIsPaymentInProgressPopupDisplay,
  setItemTypeInSet,
  setLoadingScreenDisplay,
  setReminderAlertStatus,
} from "@/redux/slice/generalStateSlice";
import { NextToField } from "./NextToField";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { AlertMessageType } from "@/types/generalTypes";

export const AddToCartButton = <T extends "isMainProduct" | "isSubProduct" | "isCartPage">({
  source,
  mode,
  type,
  product,
  lang,
  containerClasses,
  refCategoryType,
  refCategoryTypeId,
  disable,
  isAllowZero,
  currentBottom,
  defaultValue,
  isGiftItem,
  isPLP,
  path,
}: AddToCartButtonType<T>) => {
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const pathname = usePathname();
  const [productWithCartKey, setProductWithCartKey] = useState<typeof product>();

  const generateState = useSelector((state: RootState) => state.generalState);
  const categoriesData = useSelector((state: RootState) => state.categories);
  const { apiData, localData } = useSelector((state: RootState) => state.cart);
  const slugs = getRouteNameFromPathname(pathname);

  const isCartPage = slugs.secondSlug === ROUTES.CART && !slugs.thirdSlug;
  const isFavPage = slugs.thirdSlug === ROUTES.FAVOURITE;
  const isUserHasSelectedBranchStatus = isUserHasSelectedBranch(apiData);
  const productQuantityFromCart = getProductQuantityFromCart({
    cartKey: product ? (product as AddToCartButtonType<"isCartPage">["product"])?.cartKey : undefined,
    skuCode: product ? product.skuCode : "",
    isSetProduct: product.type === "SET",
    isEditingSetProduct: generateState.isSetProductPopupOpen,
    isSubProduct: generateState.isSetProductPopupOpen && product.type === "SINGLE",
    cartData: localData,
    isGiftItem,
    isCartPage,
    globalSelectedProductSkuCode: generateState.globalSelectedProductSkuCode,
    isPLP,
  });

  const [quantity, setQuantity] = useState(productQuantityFromCart);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!productWithCartKey) {
      const productFound = apiData.cart?.cartItems.find(
        item =>
          item.cartKey === (product as AddToCartButtonType<"isCartPage">["product"]).cartKey ||
          item.skuCode === product.skuCode
      );
      if (productFound && productFound.cartKey) {
        setProductWithCartKey({
          ...product,
          cartKey: productFound.cartKey,
          skuCode: productFound.skuCode,
        });
      }
    }
  }, [apiData, productWithCartKey]);

  product = useMemo(() => productWithCartKey ?? product, [productWithCartKey, product]);

  useEffect(() => {
    const reminderMessageContent = getCookie(CookiesKey.reminderMessageContent) as string;

    if (reminderMessageContent?.length) {
      const content = JSON.parse(reminderMessageContent);
      dispatch(
        setReminderAlertStatus({
          targetReminderSku: content.skuCode,
          reminderAlertContent: translate("reminder.success_added_to_cart"),
          reminderIconStyle: content.iconStyle,
        })
      );

      deleteCookie(CookiesKey.reminderMessageContent);
    }

    deleteCookie(CookiesKey.sourceForGetCart);
  }, []);

  // a fallback function to make sure the quantity is up to date
  useEffect(() => {
    if (!isReady && defaultValue !== undefined) {
      setQuantity(defaultValue);
      dispatch(
        setSetProductPopupData({
          ...localData.setProductPopupData,
          skuCode: product.skuCode,
          quantity: defaultValue,
        })
      );
      setIsReady(true);
    } else {
      setQuantity(productQuantityFromCart);
    }
  }, [productQuantityFromCart, defaultValue]);

  const { onAddToCartClick } = useAddToCartButton<T>({
    source,
    product,
    lang,
    slugId: (product as MainProductType)?.detailPageSlug ?? undefined,
    isSetProduct: product?.type === "SET",
    refCategoryType,
    refCategoryTypeId,
    cartLocalData: localData,
    cartApiData: apiData,
    categoriesData,
    generateState,
  });
  const { isSetProductPopupOpen, isSubProductCanAdd, dimmedSetProductSkuCodes } = useSelector(
    (state: RootState) => state.generalState
  );

  const cartStyle = useMemo(() => {
    const style = {
      buttonSizeClasses: `${disable ? "opacity-50" : ""} cartButtonBox ${
        refCategoryType === "MY_FAVORITE" ? "memberFavoriteCartButton" : "defaultCartButton"
      } `,
    };

    if (type && type === "largeSize") {
      style.buttonSizeClasses = `${disable ? "opacity-50" : ""} cartButtonBox largeCartButton ${
        slugs.secondSlug === "item" ? "w-full md:w-fit" : "w-fit"
      }`;
    }
    if (type && type === "smallSize") {
      style.buttonSizeClasses = `${disable ? "opacity-50" : ""} cartButtonBox smallCartButton`;
    }
    return style;
  }, []);

  const isThisProductDimmed = useMemo(() => {
    return !!dimmedSetProductSkuCodes.find(
      skuCode =>
        skuCode === product.skuCode || skuCode === (product as AddToCartButtonType<"isCartPage">["product"])?.cartKey
    );
  }, [dimmedSetProductSkuCodes, product]);

  // auto reset reminder (close reminder)
  useEffect(() => {
    if (generateState.targetReminderSku?.length) {
      setTimeout(() => {
        dispatch(resetReminderAlertStatus());
      }, 10 * 1000);
    }
  }, [generateState]);

  // debounce
  const debounceCallback = useCallback(
    debounce(
      async (newQuantity: number, skipReminder: boolean, skipAvailabilityChecking?: boolean) => {
        let cartKey: string | undefined = undefined;
        if (product.type === "SET") {
          cartKey = (product as AddToCartButtonType<"isCartPage">["product"])?.cartKey;
        } else {
          cartKey = apiData.cart?.cartItems.find(item => item.skuCode === product.skuCode)?.cartKey;
        }

        const code = await onAddToCartClick(newQuantity, cartKey, false, skipAvailabilityChecking);
        if (code === "CART_LOCKED") {
          setCookie(CookiesKey.isPaymentInProgress, "true");
          dispatch(setIsPaymentInProgressPopupDisplay(true));
        } else {
          deleteCookie(CookiesKey.isPaymentInProgress);
        }
        if (code === "SUCCESS") {
          if (newQuantity === 0) {
            dispatch(setLoadingScreenDisplay(true));
            window.location.reload();
          }
          if (!skipReminder) {
            dispatch(
              setReminderAlertStatus({
                targetReminderSku: product.skuCode,
                reminderAlertContent: translate("reminder.success_added_to_cart"),
                reminderIconStyle: "TICK",
              })
            );
            setQuantity(newQuantity);
          }
        }

        return code;
      },
      isSetProductPopupOpen ? 0 : 300
    ),
    // since the set product is set as temp local data first,
    // the debounce callback needs to update its state to get the latest data every time the set product data is changed
    [localData.setProductPopupData, product, apiData]
  );

  const onLeftButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(resetReminderAlertStatus());
    if (quantity === 1 && product.type === "SET") {
      return;
    }

    // special handling ^_^ x 3
    if (isSetProductPopupOpen && product.type === "SINGLE" && quantity === 1) {
      dispatch(
        setItemTypeInSet({
          action: "DELETE",
          skuCode: product.skuCode,
        })
      );
    }

    // hidden the quota alert
    dispatch(setQuotaAlertSkuCode(""));
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      debounceCallback(newQuantity, true);
    }
  };

  const onRightButtonClick = async (
    event?: React.MouseEvent,
    defaultQuantity?: number,
    skipAvailabilityChecking?: boolean
  ) => {
    event && event.preventDefault();
    dispatch(resetReminderAlertStatus());
    // special handling ^_^
    if (isSetProductPopupOpen && product.type === "SINGLE" && !isSubProductCanAdd) {
      return;
    }

    // special handling ^_^ x 4
    if (
      isSetProductPopupOpen &&
      product.type === "SINGLE" &&
      generateState.isSubProductReachMaxium &&
      !generateState.itemTypeInSet.includes(product.skuCode)
    ) {
      return;
    }

    // special handling ^_^ x 2
    if (isSetProductPopupOpen && product.type === "SINGLE") {
      dispatch(
        setItemTypeInSet({
          action: "ADD",
          skuCode: product.skuCode,
        })
      );
    }

    const newQuantity = (defaultQuantity ?? quantity) + 1;
    debounceCallback(newQuantity, isCartPage, skipAvailabilityChecking);
  };

  const isLeftButtonDisabled = useMemo(() => {
    let disabled = false;
    if (disable || isThisProductDimmed || generateState.isAddingToCart) {
      disabled = true; 
    } else if (product.type === "SET" && !isSetProductPopupOpen && !isCartPage) {
      disabled = true;
    } else if (product.type === "SET" && isSetProductPopupOpen && quantity === 1) {
      disabled = true;
    } else if (product.type === "SINGLE" && quantity === 0) {
      disabled = true;
    }

    if (product.skuCode === "XL01") {
      console.log("================= LEFT BUTTON ===============");
      console.log({
        disable,
        disabled,
        isThisProductDimmed,
        isAddingToCart: generateState.isAddingToCart,
        type: product.type,
        isSetProductPopupOpen,
        isCartPage,
        quantity
      });
      console.log("================= END ===============");
    }

    return disabled;
  }, [disable, isThisProductDimmed, generateState, isSetProductPopupOpen, isCartPage, product, quantity])

  const isRightButtonDisabled = useMemo(() => {
    let disabled = false;

    if (disable || isThisProductDimmed || generateState.isAddingToCart || generateState.isAddButtonDisable) {
      disabled = true; 
    } else if (product.type === "SINGLE" && isSetProductPopupOpen && !isSubProductCanAdd) {
      disabled = true;
    } else if (product.type === "SINGLE" && isSetProductPopupOpen && generateState.isSubProductReachMaxium && !generateState.itemTypeInSet.includes(product.skuCode)) {
      disabled = true;
    }

    if (product.skuCode === "XL01") {
      console.log("================= RIGHT BUTTON ===============");
      console.log({
        disable,
        isThisProductDimmed,
        isAddingToCart: generateState.isAddingToCart,
        isAddButtonDisable: generateState.isAddButtonDisable,
        isSubProductReachMaxium: generateState.isSubProductReachMaxium,
        itemTypeInSet: generateState.itemTypeInSet,
        type: product.type,
        isSetProductPopupOpen,
        isSubProductCanAdd,
      });
      console.log("================= END ===============");
    }

    return disabled;
  }, [disable, isThisProductDimmed, generateState, isSetProductPopupOpen, product, isSubProductCanAdd])

  const renderAmountCalculator = () => {
    return (
      <div
        className={cartStyle.buttonSizeClasses}
        style={{
          opacity: generateState.isAddingToCart || isGiftItem ? 0.5 : 1,
        }}
      >
        {(product as MainProductType)?.oosStatus ? (
          <div className={"cartSoldOut"}>
            <p>{translate("tabs.soldOut")}</p>
          </div>
        ) : (
          <div className={"cartAmountButton"}>
            <button
              disabled={isLeftButtonDisabled}
              className={`minusButton ${
                isLeftButtonDisabled ||
                isAllowZero
                  ? "cursor-default"
                  : ""
              }`}
              onClick={(event: React.MouseEvent) => {
                if (!isLeftButtonDisabled) {
                  onLeftButtonClick(event);
                }
              }}
              type={"button"}
            >
              <Image
                src={MobileMinus}
                alt="MinusIcon"
                width={0}
                height={0}
                sizes="100vw"
                className={`
                ${isLeftButtonDisabled ? "cursor-default opacity-30" : ""}`}
              />
            </button>
            {/* middle */}
            <button
              className={`amountContent ${isGiftItem ? " cursor-default" : " cursor-pointer"}`}
              type="button"
              disabled={isGiftItem}
            >
              {quantity}
            </button>

            {/* right button */}
            <button
              disabled={isThisProductDimmed || generateState.isAddingToCart || generateState.isAddButtonDisable}
              className={`plusButton ${isRightButtonDisabled ? "cursor-default" : "" }`}
              onClick={(event: React.MouseEvent) => {
                if (!isRightButtonDisabled) {
                  onRightButtonClick(event);
                }
              }}
              type={"button"}
            >
              <Image
                src={MobilePlus}
                alt="MobilePlus"
                width={0}
                height={0}
                sizes="100vw"
                // special handling ^_^ x5
                className={`
                  ${ isRightButtonDisabled ? "cursor-default opacity-30" : "" }
                `}
              />
            </button>
          </div>
        )}
      </div>
    );
  };

  const onCommonButtonClick = async () => {
    const isPaymentInProgress = getCookie(CookiesKey.isPaymentInProgress);
    if (isPaymentInProgress === true || isPaymentInProgress === "true") {
      dispatch(setIsPaymentInProgressPopupDisplay(true));
      return;
    }
    const code = await onAddToCartClick(1, undefined, false, false);
    if (code === "SUCCESS") {
      setQuantity(1);
      dispatch(
        setReminderAlertStatus({
          targetReminderSku: product.skuCode,
          reminderAlertContent: translate("reminder.success_added_to_cart"),
          reminderIconStyle: "TICK",
        })
      );
    } else if (code === "CART_LOCKED") {
      setCookie(CookiesKey.isPaymentInProgress, "true");
      dispatch(setIsPaymentInProgressPopupDisplay(true));
    } else {
      deleteCookie(CookiesKey.isPaymentInProgress);
    }
  };

  const renderButtonContent = () => {
    if ((product as MainProductType)?.oosStatus) {
      return (
        <div
          className={`${path === "favourite" ? "oosStatusFav" : "oosStatus"} ${
            type === "smallSize" ? "smallCartButton" : "largeCartButton"
          }`}
        >
          {translate("tabs.soldOut")}
        </div>
      );
    }

    if (mode === "EDIT_BUTTON") {
      return (
        <button
          className="editButton"
          onClick={async () => {
            const code = await onAddToCartClick(quantity, undefined, true, false);
            if (code === "CART_LOCKED") {
              setCookie(CookiesKey.isPaymentInProgress, "true");
              dispatch(setIsPaymentInProgressPopupDisplay(true));
            } else {
              deleteCookie(CookiesKey.isPaymentInProgress);
            }
          }}
        >
          {translate("cart.edit")}
        </button>
      );
    }

    if (
      (isUserHasSelectedBranchStatus && mode === "CALCULATOR") ||
      // quantity in cart is more than zero
      quantity > 0 ||
      // seems only 餐具 is allow zero, or;
      (isAllowZero && quantity === 0)
    ) {
      return renderAmountCalculator();
    }

    if (mode === "FULL_BUTTON") {
      return (
        <CustomButton
          onClick={() => {
            if (!generateState.isAddingToCart) {
              onCommonButtonClick();
            }
          }}
          containerClass="fullButton"
          leftIcon={width <= 1024 ? IconPlus : IconCart}
          title={translate("SingleProduct.addCart") as string}
          textClass="fullButton_text"
          iconClass="fullButton_Icon"
          disabled={generateState.isAddingToCart}
        />
      );
    }

    if (mode === "SHORT_BUTTON") {
      return (
        <button
          onClick={() => {
            if (!generateState.isAddingToCart) {
              onCommonButtonClick();
            }
          }}
          className={`${isFavPage ? "addButton" : "shortButton"} ${generateState.isAddingToCart ? "opacity-50" : ""}`}
        >
          <div>
            <Image src={CartIcon} alt="CartIcon" width={0} height={0} sizes="100vw" />
          </div>
        </button>
      );
    }

    return <></>;
  };

  const renderNextToField = () => {
    if (mode !== "EDIT_BUTTON") {
      const localProductData = apiData.cart?.cartItems.find(
        item => item.skuCode === product.skuCode || item.cartKey === (product as any).cartKey
      );
      let localCartKey: string | undefined = "";
      if (localData) {
        localCartKey = localProductData?.cartKey;
      }
      if (
        generateState.targetNextToFieldSku &&
        (generateState.targetNextToFieldSku === product.skuCode ||
          generateState.targetNextToFieldSku === (product as AddToCartButtonType<"isCartPage">["product"])?.cartKey ||
          generateState.targetNextToFieldSku === localCartKey)
      ) {
        return <NextToField isOpen={true} content={generateState.nextToFieldContent} />;
      }

      if (generateState.multiNextToFieldSkuWithContent?.length) {
        const found = generateState.multiNextToFieldSkuWithContent.find(
          ntf =>
            ntf.skuCode === product.skuCode ||
            ntf.skuCode === (product as AddToCartButtonType<"isCartPage">["product"])?.cartKey ||
            ntf.skuCode === localCartKey
        );

        if (found) {
          return <NextToField isOpen={true} content={found.content} />;
        }
      }
    }
    return <></>;
  };

  const reminderInfo = useMemo(() => {
    const res = {
      isDisplay: false,
      content: "",
      style: "",
    };

    if (mode === "EDIT_BUTTON") {
      return res;
    }

    const { targetReminderSku, multiReminder, reminderAlertContent, reminderIconStyle } = generateState;
    const targetSkuCode = product.skuCode;
    const targetCartKey = (product as AddToCartButtonType<"isCartPage">["product"])?.cartKey;
    if (multiReminder?.length) {
      multiReminder.some(reminder => {
        if (reminder.targetReminderSku === targetSkuCode || reminder.targetReminderSku === targetCartKey) {
          res.isDisplay = true;
          res.content = reminder.reminderAlertContent ?? "";
          res.style = reminder.reminderIconStyle ?? "";
        }
        return res.isDisplay;
      });
    }

    if (
      !res.isDisplay &&
      targetReminderSku !== undefined &&
      (targetReminderSku === targetSkuCode || targetReminderSku === targetCartKey)
    ) {
      res.isDisplay = true;
      res.content = reminderAlertContent ?? "";
      res.style = reminderIconStyle;
    }

    return res;
  }, [generateState]);

  return (
    <div
      className={`cartButtonContainer${containerClasses ? ` ${containerClasses}` : ""}`}
      style={currentBottom ? { top: ` ${currentBottom}px` } : {}}
    >
      {renderButtonContent()}
      <QuotaAlert
        isOpen={reminderInfo.isDisplay}
        content={reminderInfo.content}
        style={reminderInfo.style as AlertMessageType["reminderIconStyle"]}
        containerStyle="z-[999]"
      />
      {renderNextToField()}
    </div>
  );
};
