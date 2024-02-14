import { combineReducers } from "@reduxjs/toolkit";

import heightReducer from "./slice/heightSlice";
import cartSliceReducer from "./slice/cartSlice";
import categoriesReducer from "./slice/categoriesSlice";
import titleSliceReducer from "./slice/titleSlice";
import generalStateReducer from "./slice/generalStateSlice";
import registrationInfoReducer from "./slice/registrationInfoSlice";
import registrationMobileReducer from "./slice/registrationMobileSlice";
import firstTimeOrderPopupReducer from "./slice/firstTimeOrderPopupSlice";
import orderCheckoutSliceReducer from "./slice/orderCheckoutSlice";
import profileSliceReducer from "./slice/profileSlice";
import { authApi } from "./api/authApi";
import { branchApi } from "./api/branchApi";
import { memberApi } from "./api/memberApi";
import { cartSliceApi } from "./api/cartSliceApi";
import { productSliceApi } from "./api/productApi";
import { orderCheckoutApi } from "./api/orderCheckoutApi";
import { generalApi } from "./api/generalApi";

const rootReducer = combineReducers({
  registrationInfo: registrationInfoReducer,
  registrationMobile: registrationMobileReducer,
  generalState: generalStateReducer,
  height: heightReducer,
  firstTimeOrderPopup: firstTimeOrderPopupReducer,
  cart: cartSliceReducer,
  categories: categoriesReducer,
  title: titleSliceReducer,
  orderCheckout: orderCheckoutSliceReducer,
  profile: profileSliceReducer,

  [authApi.reducerPath]: authApi.reducer,
  [memberApi.reducerPath]: memberApi.reducer,
  [productSliceApi.reducerPath]: productSliceApi.reducer,
  [branchApi.reducerPath]: branchApi.reducer,
  [orderCheckoutApi.reducerPath]: orderCheckoutApi.reducer,
  [generalApi.reducerPath]: generalApi.reducer,

  cartSliceApi: cartSliceApi.reducer,
  // Add other reducers here
});

export default rootReducer;
