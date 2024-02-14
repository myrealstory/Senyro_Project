import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINTS } from "@/constants/endpoints";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { GetProductApiInputType, ProductApiType } from "@/types/productTypes";
import { OriginApiResponseType } from "@/types/commonTyps";
import { CartApiAlertListType, CartApiResultType } from "@/types/cartTypes";

export const productSliceApi = createApi({
  reducerPath: "productSliceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: builder => ({
    getProductListRequest: builder.query<OriginApiResponseType<ProductApiType<"isList">>, GetProductApiInputType>({
      query: payload => ({
        url: ENDPOINTS.GET_PRODUCTS,
        method: "GET",
        params: {
          category: payload.category,
          subcategory: payload.subcategory,
          type: payload.type,
          branch: payload.branch,
        },
        headers: getRequestCommonHeader(payload.lang),
      }),
      transformResponse: (response: OriginApiResponseType<ProductApiType<"isList">>) => {
        return response;
      }
    }),
    getProductDetailRequest: builder.query<OriginApiResponseType<ProductApiType<"isDetail">>, GetProductApiInputType>({
      query: payload => ({
        url: `${ENDPOINTS.GET_PRODUCTS}/${payload.slugId}`,
        method: "GET",
        params: {
          popupAlert: payload.popupAlert,
          type: payload.type,
          branch: payload.branch,
          date: new Date().toISOString(),
        },
        headers: { ...getRequestCommonHeader(payload.lang), source: "normal" },
      }),
      transformResponse: (response: OriginApiResponseType<ProductApiType<"isDetail">>) => {
        return response;
      }
    }),
    checkSetProductAvailability: builder.mutation<OriginApiResponseType<{
      result: CartApiResultType;
      alertList?: CartApiAlertListType[];
    }>, {
      skuCode: string;
      qty: number;
    }>({
      query: payload => ({
        url: `${ENDPOINTS.CHECK_SET_PRODUCT_AVAILABILITY}/${payload.skuCode}?qty=${payload.qty}`,
        method: "GET",
        headers: { ...getRequestCommonHeader() },
      }),
      transformResponse: (response: OriginApiResponseType<{
        result: CartApiResultType;
        alertList?: CartApiAlertListType[];
      }>) => {
        return response;
      }
    }),
  }),
});

export const { 
  useGetProductListRequestQuery, useLazyGetProductListRequestQuery,
  useGetProductDetailRequestQuery, useLazyGetProductDetailRequestQuery,
  useCheckSetProductAvailabilityMutation,
} = productSliceApi;

export const useGetProductListRequestState = productSliceApi.endpoints.getProductListRequest.useQueryState;
export const useGetProductDetailRequestState = productSliceApi.endpoints.getProductDetailRequest.useQueryState;
