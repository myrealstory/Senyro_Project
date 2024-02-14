import {
  AddCartInputType,
  AddCartResponseType,
  AddCartSourceType,
  CartApiDataType,
  DeleteAllCartDataResponseType,
} from "@/types/cartTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINTS } from "@/constants/endpoints";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { LocaleKeysType } from "@/app/i18n";
import { OriginApiResponseType } from "@/types/commonTyps";

export const cartSliceApi = createApi({
  reducerPath: "cartSliceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINTS.ADD_CART,
  }),
  endpoints: builder => ({
    getCartRequest: builder.query<
      OriginApiResponseType<CartApiDataType>,
      { lang: LocaleKeysType; isCartPage?: boolean; source: AddCartSourceType; isContinue?: boolean; }
    >({
      query: payload => ({
        url: "",
        method: "GET",
        headers: { ...getRequestCommonHeader(payload.lang), source: payload.source },
        params: {
          isCartPage: payload.isCartPage ?? false,
          isContinue: payload.isContinue ?? false,
        },
      }),
    }),
    addCartRequest: builder.mutation<OriginApiResponseType<AddCartResponseType<"isCartPage">>, AddCartInputType & { lang: LocaleKeysType; }>({
      query: payload => ({
        url: "",
        method: "POST",
        headers: { ...getRequestCommonHeader(payload.lang), source: payload.source, },
        body: payload,
      }),
    }),
    deleteCartRequest: builder.mutation<OriginApiResponseType<DeleteAllCartDataResponseType>, void>({
      query: () => ({
        url: "",
        method: "DELETE",
        headers: getRequestCommonHeader(),
      }),
    }),
  }),
});

export const {
  useGetCartRequestQuery,
  useLazyGetCartRequestQuery,
  useAddCartRequestMutation,
  useDeleteCartRequestMutation,
} = cartSliceApi;
