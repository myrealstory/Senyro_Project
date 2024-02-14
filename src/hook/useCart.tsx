import { UseCartType } from "@/types/hookTypes";
import {
  useAddCartRequestMutation,
  useDeleteCartRequestMutation,
  useLazyGetCartRequestQuery,
} from "@/redux/api/cartSliceApi";
import { setCartApiData, setCartLocalDataFromApiData } from "@/redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import { OriginApiResponseType } from "@/types/commonTyps";
import { AddCartResponseType } from "@/types/cartTypes";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

export const useCart = ({ lang }: UseCartType) => {
  const dispatch = useDispatch();
  const [addCartRequest] = useAddCartRequestMutation();
  const [getCartRequest] = useLazyGetCartRequestQuery();
  const [deleteCartRequest] = useDeleteCartRequestMutation();

  const deleteProductFromCart = (skuCode: string, cartKey: string) => {
    dispatch(setLoadingScreenDisplay(true));
    addCartRequest({
      skuCode,
      quantity: 0,
      cartKey,
      isCartPage: true,
      source: "cart",
      lang,
    })
    .unwrap()
    .then((cartData: OriginApiResponseType<AddCartResponseType<"isCartPage">>) => {
      dispatch(setLoadingScreenDisplay(false));
      dispatch(setCartApiData(cartData.data));
      dispatch(setCartLocalDataFromApiData({...cartData.data, isCartPage: true }));
    })
    .catch(() => {
      dispatch(setLoadingScreenDisplay(false));
    })
  };

  const deleteAllProduct = () => {
    deleteCartRequest().then(() => {
      return getCartRequest({
        lang,
        isCartPage: true,
        source: "cart",
      }).unwrap();
    });
  };

  const editModifiers = (modifierSkucode: string, enable: boolean) => {
    return addCartRequest({
      isCartPage: true,
      modifiers: {
        [modifierSkucode]: enable,
      },
      source: "cart",
      lang,
    })
    .unwrap()
    .then(res => {
      return {
        status: res.statusCode,
      }
    })
  };

  return {
    deleteProductFromCart,
    deleteAllProduct,
    editModifiers,
  };
};
