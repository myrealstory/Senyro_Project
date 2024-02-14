import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@/constants";
import { AddToCartButtonType } from "@/types/componentTypes";
import { UseAddToCartButtonType } from "@/types/hookTypes";
import { useAddCartRequestMutation } from "@/redux/api/cartSliceApi";
import { useGetProductDetailRequestState, useCheckSetProductAvailabilityMutation } from "@/redux/api/productApi";
import {
  getProductApiInputParams,
  getRefCategoryDataType,
  getRouteNameFromPathname,
  isUserHasSelectedBranch,
} from "@/utils/commonUtils";
import {
  AddCartInputType,
  AddCartResponseType,
  AddCartSourceType,
  CartApiAlertListType,
  CartApiResultType,
  ProductDataInLocalCartType,
} from "@/types/cartTypes";
import {
  cartSliceInitialState,
  setCartApiData,
  setCartLocalDataFromApiData,
  setSetProductPopupData,
} from "@/redux/slice/cartSlice";
import {
  resetAllAlert,
  setBasicProductDataForOtherComponents,
  setIsAddingToCart,
  setIsGlobalSelectedProductASetProduct,
  setIsPaymentInProgressPopupDisplay,
  setIsSetProductPopupOpen,
  setReminderAlertStatus,
} from "@/redux/slice/generalStateSlice";

import { useSetProductPopup } from "./useSetProductPopup";
import { OriginApiResponseType } from "@/types/commonTyps";
import { useTranslation } from "@/app/i18n/client";
import { handleAlertMessage, openCartPickupPopup, shiDanLa } from "@/utils/clientUtils";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { deleteCookie, setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";

export const useAddToCartButton = <T extends "isMainProduct" | "isSubProduct" | "isCartPage">({
  source,
  product,
  lang,
  isSetProduct,
  slugId,
  refCategoryType,
  refCategoryTypeId,
  cartLocalData,
  cartApiData,
  categoriesData,
  generateState,
}: UseAddToCartButtonType<T>) => {
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isCartPage = getRouteNameFromPathname(pathname).secondSlug === ROUTES.CART;
  const { openSetProductPopup } = useSetProductPopup({ lang, slugId });
  const [checkSetProductAvailability, { isLoading: isCheckingSetProductAvailability }] =
    useCheckSetProductAvailabilityMutation();
  const { isSetProductSelectedBeforeTheFirstTimePopup, globalSelectedProductSkuCode } = useSelector(
    (state: RootState) => state.generalState
  );

  const { data: setProductData } = useGetProductDetailRequestState(
    getProductApiInputParams(cartApiData, {
      lang,
      slugId,
      date: generateState.globalGetProductDatetime,
      category: categoriesData.selectedMainCategorySlug?.length ? categoriesData.selectedMainCategorySlug : undefined,
      subcategory: categoriesData.selectedSubCategorySlug?.length ? categoriesData.selectedSubCategorySlug : undefined,
      popupAlert: isSetProductSelectedBeforeTheFirstTimePopup ? true : undefined,
    }),
    { skip: !isSetProduct }
  );

  const targetSkuCode = product?.skuCode ?? generateState.globalSelectedProductSkuCode;
  const isUserHasSelectedBranchStatus = isUserHasSelectedBranch(cartApiData);
  const [addCartRequest, { isLoading: isAddingToCart }] = useAddCartRequestMutation();

  useEffect(() => {
    dispatch(setIsAddingToCart(isAddingToCart || isCheckingSetProductAvailability));
  }, [isAddingToCart, isCheckingSetProductAvailability]);

  const readyProductDataForOtherComponents = (date: string) => {
    // temp save the sku and slug id, for the api usages of "first time popup" step3
    dispatch(
      setBasicProductDataForOtherComponents({
        skuCode: targetSkuCode,
        slugId,
        date,
        type: isSetProduct,
      })
    );
  };

  const checkIfNeedToDelayUpdateLocalCart = (alertList: CartApiAlertListType[]) => {
    let res = false;
    alertList.some(alert => {
      if ([
        "38004_cart_adjust_qty_or_add_item",
        "38003_addon_adjust_qty_or_add_item",
        "38004_addon_adjust_qty_or_add_item",
        "38005_cart_adjust_qty_or_add_item",
        "38006_addon_adjust_qty_or_add_item",
        "38007_cart_adjust_qty_or_add_item",
        // IA6 + IA23 (phase 2)
        // ""
      ].includes(alert.alertCode)) {
        res = true;
      }
      return res;
    })

    return res;
  }

  const editSetProductQuantityInLocalTempStore = (quantity: number, skipAvailabilityChecking?: boolean) => {
    const updateSetProductInfo = () => {
      if (isSetProduct) {
        dispatch(
          setSetProductPopupData({
            ...cartLocalData.setProductPopupData,
            skuCode: targetSkuCode!,
            quantity,
          })
        );
      } else {
        const clonedSubProducts: ProductDataInLocalCartType[] = JSON.parse(
          JSON.stringify(cartLocalData.setProductPopupData.subItems)
        );
        const targetSubProductIndex = clonedSubProducts.findIndex(subProduct => subProduct.skuCode === targetSkuCode);
        if (targetSubProductIndex > -1) {
          clonedSubProducts[targetSubProductIndex].quantity = quantity;
          dispatch(
            setSetProductPopupData({
              ...cartLocalData.setProductPopupData,
              subItems: clonedSubProducts,
            })
          );
        } else {
          clonedSubProducts.push({
            skuCode: targetSkuCode!,
            quantity,
          });
          dispatch(
            setSetProductPopupData({
              ...cartLocalData.setProductPopupData,
              subItems: clonedSubProducts,
            })
          );
        }
      }
    };

    if (skipAvailabilityChecking) {
      updateSetProductInfo();
    } else {
      checkSetProductAvailability({
        skuCode: targetSkuCode!,
        qty: quantity,
      })
        .unwrap()
        .then((res: any) => {
          if (res.data.result === "SUCCESS") {
            updateSetProductInfo();
          } else if (res.data.result === "FAILED" && res.data.alertList?.length) {
            handleAlertMessage({
              alertList: res?.data?.alertList,
              dispatch,
              translate,
              lang,
              extraInfo: {
                targetSkuCode,
              },
            });
          }
        });
    }
  };

  const onAddToCartClick = async (
    quantity: number,
    cartKey?: string,
    needToOpenSetProductPopup?: boolean,
    skipAvailabilityChecking?: boolean
  ): Promise<CartApiResultType> => {
    const date = new Date().toISOString();
    dispatch(setIsGlobalSelectedProductASetProduct(product?.type === "SET"));
    // if user didn't finish the "first time popup selection" (means the user haven't choose any branch)
    if (!isUserHasSelectedBranchStatus && quantity && quantity > 0) {
      readyProductDataForOtherComponents(date);
      openCartPickupPopup(dispatch, "NEW");
      return "PENDING";
    }

    // when its updaing the set product quantity
    if (generateState.isSetProductPopupOpen && quantity !== undefined && !skipAvailabilityChecking) {
      editSetProductQuantityInLocalTempStore(quantity);
      return "PENDING";
    }

    if (!needToOpenSetProductPopup && !generateState.isSetProductPopupOpen && isSetProduct && isCartPage) {
      return await submitAddToCart<Promise<CartApiResultType>>(
        {
          source,
          skuCode: targetSkuCode,
          quantity,
          cartKey,
        },
        (code: string | undefined) => {
          if (code) {
            return code;
          }
          return "FAILED";
        }
      );
    }

    if (needToOpenSetProductPopup || (!generateState.isSetProductPopupOpen && isSetProduct)) {
      openSetProductPopup({
        dateOfCachedProductDetail: date,
        cartKey: (product as AddToCartButtonType<"isCartPage">["product"]).cartKey,
        popupAlert: false,
        translate,
        globalSelectedProductSkuCode,
        isBrandNewSet: !isCartPage,
      }).then(() => {
        readyProductDataForOtherComponents(date);
      });
      return "OPEN_SET_PRODUCT_POPUP";
    }

    // when its single product
    if (!isSetProduct || (!generateState.isSetProductPopupOpen && isSetProduct && isCartPage && cartKey)) {
      return await submitAddToCart<Promise<CartApiResultType>>(
        {
          source,
          skuCode: targetSkuCode,
          quantity,
          cartKey,
        },
        (code: string | undefined) => {
          if (code) {
            return code;
          }
          return "FAILED";
        }
      );
    }

    return "FAILED";
  };

  const submitAddToCart = async <T,>(cartData: AddCartInputType, callback?: (...params: any) => any): Promise<T> => {
    const refCategoryData = getRefCategoryDataType({
      refCategoryType: refCategoryType ?? cartLocalData.refCategoryType,
      refCategoryTypeId: refCategoryTypeId ?? cartLocalData.refCategoryTypeId,
      selectedSubCategoryId: categoriesData.selectedSubCategoryId,
      selectedMainCategoryId: categoriesData.selectedMainCategoryId,
    });

    return addCartRequest({
      ...cartData,
      refCategoryType: refCategoryData.refCategoryType,
      refCategoryTypeId: refCategoryData.refCategoryTypeId,
      isCartPage: true,
      lang,
    })
      .unwrap()
      .then((response: OriginApiResponseType<AddCartResponseType<"isCartPage">>) => {
        let needToCloseSetProductPopup = true;
        let needToDelayUpdateLocalCart = false;
        if (response?.data?.alertList?.length) {
          if (response.data?.result === "FAILED_SET_ITEM_POPUP") {
            needToCloseSetProductPopup = false;
            shiDanLa({
              alertList: response?.data?.alertList,
              dispatch,
              translate,
            });
          }
          handleAlertMessage({
            alertList: response?.data?.alertList,
            dispatch,
            translate,
            lang,
            extraInfo: {
              targetSkuCode: cartData.cartKey ?? targetSkuCode,
            },
          });

          needToDelayUpdateLocalCart = checkIfNeedToDelayUpdateLocalCart(response?.data?.alertList);
        } else {
          dispatch(resetAllAlert());
        }

        if (response?.data?.alertList?.length) {
          response?.data?.alertList.forEach(list => {
            if (list.alertCode === "38004_platter_platter_finish" && list.alertType === "next_to_field") {
              needToCloseSetProductPopup = false;
            }
          });
        }

        if (needToCloseSetProductPopup) {
          // reset data
          dispatch(setSetProductPopupData(cartSliceInitialState.localData.setProductPopupData));
          dispatch(
            setIsSetProductPopupOpen({
              isSetProductPopupOpen: false,
              isBrandNewSet: false,
              cartKey: "",
            })
          );
        }

        if (response?.returnCode !== "33008") {

          if (needToDelayUpdateLocalCart) {
            setTimeout(() => {
              dispatch(setCartApiData(response.data));
              dispatch(setCartLocalDataFromApiData({ ...response.data, isCartPage }));
            }, 5000)
          } else {
            dispatch(setCartApiData(response.data));
            dispatch(setCartLocalDataFromApiData({ ...response.data, isCartPage }));
          }
        }

        if (callback) {
          return callback(response?.returnCode === "33008" ? "CART_LOCKED" : response.data.result);
        }
      });
  };

  const onSetProductSubmit = (source: AddCartSourceType, cartKey?: string) => {
    // when main product is set && have subitem list
    if (cartLocalData.setProductPopupData.skuCode?.length > 0 && cartLocalData.setProductPopupData.subItems?.length) {
      return submitAddToCart<Promise<CartApiResultType>>(
        {
          ...cartLocalData.setProductPopupData,
          cartKey,
          source,
        },
        (code: string | undefined) => {
          if (code === "SUCCESS") {
            deleteCookie(CookiesKey.isPaymentInProgress);
            dispatch(
              setReminderAlertStatus({
                targetReminderSku: cartLocalData.setProductPopupData.skuCode,
                reminderAlertContent: translate("reminder.success_added_to_cart"),
                reminderIconStyle: "TICK",
              })
            );
          } else if (code === "CART_LOCKED") {
            setCookie(CookiesKey.isPaymentInProgress, "true");
            dispatch(setIsPaymentInProgressPopupDisplay(true));
          }
        }
      )
    }
  };

  return {
    onAddToCartClick,
    onSetProductSubmit,
    setProductData: setProductData?.data ?? undefined,
  };
};
