import { FetchBaseQueryError, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_DOMAIN, ENDPOINTS } from "@/constants/endpoints/index";
import {
  OrderCheckoutResponse,
  OrderCheckoutRequest,
  GetPaymentMethodResponse,
  GetAvailableOnlineCouponResponse,
  GetOrderStatusResponse,
  OrderConfirmResponse,
  GetApplepayMerchantInfoResponse,
  GetGooglepayMerchantInfoResponse,
  ValidateApplepaySessionResponse,
  ValidateApplepaySessionRequest,
  onlineOrderReceiptType,
  onlineOrderReceiptParamType,
  ApplyDiscountType,
  ApplyDiscountResponseType,
  CheckGuestEmailOptinStatusResponseType,
  CheckGuestEmailOptinStatusRequestType,
} from "@/types/api/apiTypes";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { OriginApiResponseType } from "@/types/commonTyps";

export const orderCheckoutApi = createApi({
  reducerPath: "orderCheckoutApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_DOMAIN,
  }),
  endpoints: builder => ({
    sendCheckoutApi: builder.mutation<OriginApiResponseType<OrderCheckoutResponse>, OrderCheckoutRequest>({
      query: payload => ({
        url: ENDPOINTS.CHECKOUT,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: OriginApiResponseType<OrderCheckoutResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getPaymentMethod: builder.query<OriginApiResponseType<GetPaymentMethodResponse>, void>({
      query: () => ({
        url: ENDPOINTS.GET_PAYMENT_METHOD,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<GetPaymentMethodResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getAvailableMemberCoupons: builder.query<OriginApiResponseType<GetAvailableOnlineCouponResponse[]>, void>({
      query: () => ({
        url: ENDPOINTS.GET_AVAILABLE_MEMBER_COUPONS,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<GetAvailableOnlineCouponResponse[]>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getPaymentStatus: builder.query<OriginApiResponseType<GetOrderStatusResponse>, void>({
      query: () => ({
        url: ENDPOINTS.GET_PAYMENT_STATUS,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<GetOrderStatusResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getOrderConfirmInfo: builder.query<OriginApiResponseType<OrderConfirmResponse>, void>({
      query: () => ({
        url: ENDPOINTS.GET_ORDER_CONFIRM_INFO,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<OrderConfirmResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getApplepayMerchantDetail: builder.mutation<
      OriginApiResponseType<GetApplepayMerchantInfoResponse>,
      { paymentMethodId: string }
    >({
      query: payload => ({
        url: ENDPOINTS.GET_APPLEPAY_MERCHANT_DETAIL,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: OriginApiResponseType<GetApplepayMerchantInfoResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getGooglepayMerchantDetail: builder.mutation<
      OriginApiResponseType<GetGooglepayMerchantInfoResponse>,
      { paymentMethodId: string }
    >({
      query: payload => ({
        url: ENDPOINTS.GET_GOOGLEPAY_MERCHANT_DETAIL,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: OriginApiResponseType<GetGooglepayMerchantInfoResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    validateApplepaySession: builder.mutation<
      OriginApiResponseType<ValidateApplepaySessionResponse>,
      ValidateApplepaySessionRequest
    >({
      query: payload => ({
        url: ENDPOINTS.VALIDATE_APPLEPAY_SESSION,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: OriginApiResponseType<ValidateApplepaySessionResponse>) => {
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        return response;
      },
    }),
    getOnlineGuestOrderReceipt: builder.query<onlineOrderReceiptType, onlineOrderReceiptParamType>({
      query: payload => ({
        url: `${ENDPOINTS.GET_ONLINE_ORDER}/receipt?embeddedOrderStr=${payload.orderNumber}`,
        headers: getRequestCommonHeader(),
        method: "GET",
      }),
      transformResponse: (response: onlineOrderReceiptType) => {
        return response;
      },
    }),
    applyDiscount: builder.mutation<OriginApiResponseType<ApplyDiscountResponseType>, ApplyDiscountType>({
      query: payload => ({
        url: ENDPOINTS.APPLY_DISCOUNT,
        headers: getRequestCommonHeader(),
        method: "POST",
        body: payload,
      }),
    }),
    checkGuestEmailOptinStatus: builder.mutation<
      OriginApiResponseType<CheckGuestEmailOptinStatusResponseType>,
      CheckGuestEmailOptinStatusRequestType
    >({
      query: payload => ({
        url: ENDPOINTS.CHECK_GUEST_EMAIL_OPTIN_STATUS,
        headers: getRequestCommonHeader(),
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useSendCheckoutApiMutation,
  useGetPaymentMethodQuery,
  useLazyGetPaymentMethodQuery,
  useGetAvailableMemberCouponsQuery,
  useGetOrderConfirmInfoQuery,
  useGetPaymentStatusQuery,
  useGetApplepayMerchantDetailMutation,
  useGetGooglepayMerchantDetailMutation,
  useValidateApplepaySessionMutation,
  useGetOnlineGuestOrderReceiptQuery,
  useApplyDiscountMutation,
  useCheckGuestEmailOptinStatusMutation,
} = orderCheckoutApi;

export const useGetOnlineGuestOrderReceiptLazyQuery = orderCheckoutApi.endpoints.getOnlineGuestOrderReceipt.useLazyQuery;
