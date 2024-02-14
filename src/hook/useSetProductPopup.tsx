import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@/constants";
import { RootState } from "@/redux/store";
import { UseSetProductPopupType } from "@/types/hookTypes";
import { resetReminderAlertStatus, setIsSetProductPopupOpen } from "@/redux/slice/generalStateSlice";
import { useLazyGetCartRequestQuery } from "@/redux/api/cartSliceApi";
import { useLazyGetProductDetailRequestQuery } from "@/redux/api/productApi";
import { getProductApiInputParams, getRouteNameFromPathname } from "@/utils/commonUtils";
import { setCartLocalDataFromApiData, setSetProductPopupData } from "@/redux/slice/cartSlice";
import { handleAlertMessage } from "@/utils/clientUtils";
import { TFunction } from "i18next";

export const useSetProductPopup = ({ lang, slugId }: UseSetProductPopupType) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isCartPage = getRouteNameFromPathname(pathname).secondSlug === ROUTES.CART;
  const { selectedMainCategorySlug, selectedSubCategorySlug } = useSelector((state: RootState) => state.categories);

  const [getProductDetailRequest] = useLazyGetProductDetailRequestQuery();
  const [getCartRequest] = useLazyGetCartRequestQuery();

  const openSetProductPopup = async ({
      dateOfCachedProductDetail,
      cartKey, 
      popupAlert,
      translate,
      globalSelectedProductSkuCode,
      isBrandNewSet,
    }: {
      dateOfCachedProductDetail: string, 
      cartKey?: string, 
      popupAlert?: boolean, 
      translate?: TFunction<string, string, string>,
      globalSelectedProductSkuCode?: string,
      isBrandNewSet?: boolean,
    }) => {
    return getCartRequest({
      lang,
      isCartPage: true,
      source: isCartPage ? "cart" : "normal"
    })
      .unwrap()
      .then(cartData => {
        dispatch(setCartLocalDataFromApiData({...cartData.data, isCartPage}));

        // cartKey should be exist only in edit status
        if (!isBrandNewSet && cartKey) {
          const targetSetProductPopupData = cartData.data.cart?.cartItems.find(item => item.cartKey === cartKey);

          // if the set product is already added to the cart by the user
          // should be always true since its in edit status
          if (targetSetProductPopupData && targetSetProductPopupData.subItems && cartKey) {
            dispatch(
              setSetProductPopupData({
                skuCode: targetSetProductPopupData.skuCode,
                cartKey: targetSetProductPopupData.cartKey,
                quantity: targetSetProductPopupData.quantity,
                subItems: targetSetProductPopupData.subItems.map(item => ({
                  skuCode: item.skuCode,
                  quantity: item.quantity,
                })),
              })
            );
          }
        }

        return getProductDetailRequest(
          {
            ...getProductApiInputParams(cartData.data, {
              slugId,
              date: dateOfCachedProductDetail,
              category: selectedMainCategorySlug?.length ? selectedMainCategorySlug : undefined,
              subcategory: selectedSubCategorySlug?.length ? selectedSubCategorySlug : undefined,
              lang,
              popupAlert,
            }),
          }
        ).unwrap();
      })
      .then((res) => {
        if (res.statusCode === 200 && res.data.alertList?.length) {
          handleAlertMessage({
            alertList: res.data.alertList,
            dispatch,
            translate: translate!,
            lang,
            extraInfo: {
              globalSelectedProductSkuCode,
            },
          })
        } else {
          dispatch(resetReminderAlertStatus());
          dispatch(setIsSetProductPopupOpen({
            isSetProductPopupOpen: true,
            isBrandNewSet: !!isBrandNewSet,
            cartKey: cartKey ?? "",
          }));
        }
        return;
      });
  };

  return {
    openSetProductPopup,
  };
};
