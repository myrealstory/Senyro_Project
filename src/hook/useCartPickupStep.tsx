import { setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import {
  setIsCartPickupOpen,
  setIsSetProductSelectedBeforeTheFirstTimePopup,
  setLoadingScreenDisplay,
} from "@/redux/slice/generalStateSlice";
import { UseCartPickupStepType } from "@/types/hookTypes";
import { useAddCartRequestMutation } from "@/redux/api/cartSliceApi";
import { formatePickupDate, getRefCategoryDataType, getRouteNameFromPathname } from "@/utils/commonUtils";

import { useSetProductPopup } from "./useSetProductPopup";
import { setPage } from "@/redux/slice/firstTimeOrderPopupSlice";
import { OriginApiResponseType } from "@/types/commonTyps";
import { AddCartResponseType, AddCartSourceType } from "@/types/cartTypes";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";
import { CookiesKey } from "@/constants/cookies";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import moment from "moment";
import { handleAlertMessage, promotionOrCouponErrorMapper } from "@/utils/clientUtils";
import { TFunction } from "i18next";
import { usePathname } from "next/navigation";

export const useCartPickupStep = ({ lang }: UseCartPickupStepType) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const slugs = getRouteNameFromPathname(pathname);

  const { selectedPickupMethod, selectedBranchCode, selectedPickupDate, selectedPickupHour, selectedPickupMinute } =
    useSelector((state: RootState) => state.firstTimeOrderPopup);
  const {
    globalSelectedProductSkuCode,
    globalSelectedProductSlugId,
    globalGetProductDatetime,
    isGlobalSelectedProductASetProduct,
  } = useSelector((state: RootState) => state.generalState);
  const { selectedMainCategoryId, selectedSubCategoryId } = useSelector((state: RootState) => state.categories);
  const {
    localData: { refCategoryType, refCategoryTypeId },
  } = useSelector((state: RootState) => state.cart);

  const [addCartRequest] = useAddCartRequestMutation();

  const { openSetProductPopup } = useSetProductPopup({
    slugId: globalSelectedProductSlugId,
    lang,
  });

  const getPickupDatetime = (pickupMethod?: string, pickupDate?: string, pickupHour?: string, pickupMin?: string) => {
    let pickupDatetime = null;
    if (
      (pickupMethod ?? selectedPickupMethod) === "PICKUP" &&
      (pickupDate?.length ?? selectedPickupDate?.length) &&
      (pickupHour?.length ?? selectedPickupHour?.length) &&
      (pickupMin?.length ?? selectedPickupMinute?.length)
    ) {
      pickupDatetime = formatePickupDate(
        pickupDate ?? selectedPickupDate ?? "",
        pickupHour ?? selectedPickupHour ?? "",
        pickupMin ?? selectedPickupMinute ?? ""
      );
    }
    return pickupDatetime;
  };

  const updateTheCartBranch = (
    pickupMethod?: string,
    pickupDate?: string,
    pickupHour?: string,
    pickupMin?: string,
    source?: AddCartSourceType
  ) => {
    return addCartRequest({
      branchCode: selectedBranchCode,
      pickupDatetime: getPickupDatetime(pickupMethod, pickupDate, pickupHour, pickupMin),
      source: source ?? "normal",
      isCartPage: true,
      lang,
    })
      .unwrap()
      .then((cartData: OriginApiResponseType<AddCartResponseType<"isCartPage">>) => {
        dispatch(setCartApiData(cartData.data));
        dispatch(setCartLocalDataFromApiData({ ...cartData.data, isCartPage: true }));
        return cartData;
      });
  };

  const closeCartPickup = () => {
    // close popup
    dispatch(setIsCartPickupOpen({ isOpen: false }));
    dispatch(setPage(1));
  };

  const onStep2Submit = (param?: {
    pickupMethod?: string;
    pickupDate?: string;
    pickupHour?: string;
    pickupMin?: string;
    redirectTo?: string;
    translate: TFunction<string, string, string>;
    source: AddCartSourceType;
  }) => {
    dispatch(setLoadingScreenDisplay(true));
    updateTheCartBranch(
      param?.pickupMethod,
      param?.pickupDate,
      param?.pickupHour,
      param?.pickupMin,
      param?.source
    ).then(cartData => {
      if (cartData?.statusCode === 200 && cartData?.data?.alertList?.length) {
        dispatch(setLoadingScreenDisplay(false));
        handleAlertMessage({
          alertList: cartData?.data?.alertList,
          dispatch,
          translate: param!.translate,
          lang,
          extraInfo: {
            pickupDatetime: getPickupDatetime(),
            selectedBranchCode,
          },
          addCartRequest,
        });

        if (slugs.secondSlug === ROUTES.CHECKOUT) {
          promotionOrCouponErrorMapper(cartData.data, dispatch, param!.translate, lang);
        }

        dispatch(setCartApiData(cartData.data));
        dispatch(setCartLocalDataFromApiData({ ...cartData.data, isCartPage: true }));
      } else {
        dispatch(setLoadingScreenDisplay(true));
        window.location.reload();
      }
    });
  };

  const onStep3Submit = (translate: TFunction<string, string, string>, source: AddCartSourceType) => {
    if (isGlobalSelectedProductASetProduct && globalGetProductDatetime) {
      updateTheCartBranch().then(() => {
        // close popup
        dispatch(setIsCartPickupOpen({ isOpen: false, cartType: "NEW" }));
        dispatch(setIsSetProductSelectedBeforeTheFirstTimePopup(true));
        openSetProductPopup({
          dateOfCachedProductDetail: globalGetProductDatetime,
          popupAlert: true,
          translate,
          globalSelectedProductSkuCode,
          isBrandNewSet: true,
        });
        setCookie(CookiesKey.productArchorId, globalSelectedProductSkuCode);
      });
    } else {
      const refCategoryData = getRefCategoryDataType({
        refCategoryType,
        refCategoryTypeId,
        selectedSubCategoryId,
        selectedMainCategoryId,
      });
      const pickupDatetime = getPickupDatetime();
      addCartRequest({
        branchCode: selectedBranchCode,
        skuCode: globalSelectedProductSkuCode,
        quantity: 1,
        pickupDatetime,
        refCategoryType: refCategoryData.refCategoryType,
        refCategoryTypeId: refCategoryData.refCategoryTypeId,
        source,
        isCartPage: true,
        lang,
      })
        .unwrap()
        .then(result => {
          dispatch(setCartApiData(result.data));
          dispatch(setCartLocalDataFromApiData({ ...result.data, isCartPage: true }));
          closeCartPickup();

          if (result?.data?.alertList?.length) {
            handleAlertMessage({
              alertList: result?.data?.alertList,
              dispatch,
              translate,
              lang,
              extraInfo: {
                isGuest: true,
                pickupDatetime,
                globalSelectedProductSkuCode,
                refCategoryData,
                selectedBranchCode,
              },
              addCartRequest,
            });
          } else {
            setCookie(
              CookiesKey.reminderMessageContent,
              JSON.stringify({
                skuCode: globalSelectedProductSkuCode,
                iconStyle: "TICK",
              })
            );
            setCookie(CookiesKey.productArchorId, globalSelectedProductSkuCode);
            dispatch(setLoadingScreenDisplay(true));
            window.location.reload();
          }
        })
    }
  };

  const addCartBeforeMemberLogin = (lang: LocaleKeysType) => {
    if (!isGlobalSelectedProductASetProduct) {
      const refCategoryData = getRefCategoryDataType({
        refCategoryType,
        refCategoryTypeId,
        selectedSubCategoryId,
        selectedMainCategoryId,
      });
      setCookie(
        CookiesKey.addCartBeforeMemberLogin,
        {
          branchCode: selectedBranchCode,
          skuCode: globalSelectedProductSkuCode,
          quantity: 1,
          pickupDatetime: getPickupDatetime(),
          refCategoryType: refCategoryData.refCategoryType,
          refCategoryTypeId: refCategoryData.refCategoryTypeId,
        },
        {
          expires: moment().add(10, "minutes").toDate(),
        }
      );
    }

    closeCartPickup();
    setCookie(CookiesKey.addCartIsContinue, "true");
    setCookie(CookiesKey.targetPageToBeRedirectedTo, window.location.pathname);
    window.location.href = `/${lang}/${ROUTES.LOGIN}`;
  };

  return {
    getPickupDatetime,
    addCartBeforeMemberLogin,
    onStep3Submit,
    updateTheCartBranch,
    closeCartPickup,
    onStep2Submit,
  };
};
