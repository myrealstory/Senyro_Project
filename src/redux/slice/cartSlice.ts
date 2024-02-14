import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CartType,
  CartApiDataType,
  CartLocalDataType,
  SetProductDataInLocalCartType,
  ProductDataInLocalCartType,
  RefCategoryBasicType,
} from "@/types/cartTypes";

import { cartSliceApi } from "../api/cartSliceApi";

export const cartSliceInitialState: CartType = {
  apiData: {},
  localData: {
    setProductPopupData: {
      skuCode: "",
      quantity: 0,
      subItems: [],
    },
  },
};

const cartSlice = createSlice({
  name: "cart",
  initialState: cartSliceInitialState,
  reducers: {
    setRefCategoryData: (state, action: PayloadAction<RefCategoryBasicType>) => {
      state.localData.refCategoryType = action.payload.refCategoryType;
      state.localData.refCategoryTypeId = action.payload.refCategoryTypeId;
    },
    setCartApiData: (state, action: PayloadAction<CartApiDataType | undefined>) => {
      state.apiData.cart = action.payload?.cart;
      state.apiData.recommendationList = action.payload?.recommendationList;
      state.apiData.recommendationId = action.payload?.recommendationId;
      state.apiData.alertList = action.payload?.alertList;
      state.apiData.result = action.payload?.result;
    },
    setQuotaAlertSkuCode: (state, action: PayloadAction<CartLocalDataType["quotaAlertSkuCode"]>) => {
      state.localData.quotaAlertSkuCode = action.payload;
    },
    setCartLocalDataFromApiData: (state, { payload }: PayloadAction<CartApiDataType & { isCartPage: boolean }>) => {
      const setProductData: SetProductDataInLocalCartType[] = [];
      const singleProductData: ProductDataInLocalCartType[] = [];
      const giftProductData: ProductDataInLocalCartType[] = [];
      payload.cart?.cartItems.forEach(item => {
        if (item.item.type === "SET" && item.subItems?.length) {
          setProductData.push({
            cartKey: item.cartKey,
            skuCode: item.skuCode,
            quantity: item.quantity,
            subItems: item.subItems,
          });
        } else {
          singleProductData.push({
            skuCode: item.skuCode,
            quantity: item.quantity,
          });
        }
      });

      payload.cart?.gifts.forEach(item => {
        giftProductData.push({
          skuCode: item.skuCode,
          quantity: item.quantity,
        });
      });
      state.localData.giftProductData = giftProductData;
      state.localData.setProductData = setProductData;
      state.localData.singlaProductData = singleProductData;
    },
    setSetProductPopupData: (state, { payload }: PayloadAction<CartLocalDataType["setProductPopupData"]>) => {
      state.localData.setProductPopupData = payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(cartSliceApi.endpoints.getCartRequest.matchFulfilled, (state, action) => {
      state.apiData.cart = action.payload?.data.cart;
      state.apiData.recommendationList = action.payload?.data.recommendationList;
      state.apiData.recommendationId = action.payload?.data.recommendationId;
    });
  },
});

export const {
  setRefCategoryData,
  setCartApiData,
  setQuotaAlertSkuCode,
  setCartLocalDataFromApiData,
  setSetProductPopupData,
} = cartSlice.actions;
export default cartSlice.reducer;
