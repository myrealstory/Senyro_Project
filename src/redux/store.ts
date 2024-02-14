import { createLogger } from "redux-logger";

import rootReducer from "./reducer";
import { authApi } from "./api/authApi";
import { branchApi } from "./api/branchApi";
import { memberApi } from "./api/memberApi";
import { cartSliceApi } from "./api/cartSliceApi";
import { productSliceApi } from "./api/productApi";
import { generalApi } from "./api/generalApi";

import { REACT_ENV } from "@/types/commonTyps";
import { WidgetConfig } from "@/config";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { orderCheckoutApi } from "./api/orderCheckoutApi";

const middleware = [
  authApi.middleware,
  memberApi.middleware,
  cartSliceApi.middleware,
  productSliceApi.middleware,
  branchApi.middleware,
  orderCheckoutApi.middleware,
  generalApi.middleware,
];

if (WidgetConfig.reduxLooger.env.includes(process.env.NEXT_PUBLIC_ENV as REACT_ENV)) {
  const logger = createLogger({
    collapsed: true,
    diff: true,
  });
  middleware.push(logger);
}

const defaultMiddlewareConfig = {
  serializableCheck: {
    ignoredActions: ["generalState/setGlobalAlertStatus"],
    ignoredPaths: ["generalState.onLeftButtonClick", "generalState.onRightButtonClick"],
  },
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(defaultMiddlewareConfig).concat(middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
