import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_DOMAIN, ENDPOINTS } from "@/constants/endpoints/index";
import {
  CouponResponseType,
  DeleteMemberSaveCardRequest,
  MemberSaveCardRequest,
  MemberSaveCardResponse,
  MemberSaveCardStatusResponse,
  RenewResponseType,
  SaveCardResponseType,
  SingleCouponResponseType,
  instoreSalesHistoryParam,
  instoreSalesHistoryType,
  salesHistoryRespondType,
  transactionDateType,
  DeleteFavItemListRequest,
  ProfileResType,
  onlineSalesHistoryType,
  editProfileResType,
  editProfileReqestType,
  onlineOrderReceiptParamType,
  onlineOrderReceiptType,
  ReOrderRequestType,
  InboxResType,
  SinglePersonalMessageType,
  SinglePromotionalMessageType,
  InboxUnreadCount,
} from "@/types/api/apiTypes";
import { FavItemListType } from "@/types/productTypes";
import { OriginApiResponseType } from "@/types/commonTyps";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { CartApiDataType } from "@/types/cartTypes";
import { LocaleKeysType } from "@/app/i18n";
import { setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";

export const transactionDate: transactionDateType = {
  fromDate: "",
  toDate: "",
};

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_DOMAIN,
  }),
  endpoints: builder => ({
    getCreditCards: builder.query<SaveCardResponseType, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_SAVED_CARD,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: SaveCardResponseType) => {
        return response;
      },
    }),
    getInbox: builder.query<InboxResType, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_INBOX,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: InboxResType) => {
        return response;
      },
    }),
    getInboxUnreadCount: builder.query<InboxUnreadCount, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_INBOX_UNREAD,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: InboxUnreadCount) => {
        return response;
      },
    }),

    getPersonalMessageDetails: builder.query<SinglePersonalMessageType, string>({
      query: id => ({
        url: ENDPOINTS.MEMBER_INBOX_PERSONAL + `/${id}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: SinglePersonalMessageType) => {
        return response;
      },
    }),
    getPromotionalMessageDetails: builder.query<SinglePromotionalMessageType, string>({
      query: id => ({
        url: ENDPOINTS.MEMBER_INBOX_PROMOTIONAL + `/${id}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: SinglePromotionalMessageType) => {
        return response;
      },
    }),
    getProfile: builder.query<ProfileResType, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_PROFILE,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: ProfileResType) => {
        return response;
      },
    }),

    editProfile: builder.mutation<OriginApiResponseType<editProfileResType>, editProfileReqestType>({
      query: payload => ({
        url: ENDPOINTS.MEMBER_PROFILE,
        method: "POST",
        body: payload,
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<editProfileResType>) => {
        console.log("RESPONSE FROM MEMBERAPI", response);
        return response;
      },
    }),

    getCoupons: builder.query<CouponResponseType, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_COUPONS,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: CouponResponseType) => {
        return response;
      },
    }),
    getSingleCoupon: builder.query<SingleCouponResponseType, string>({
      query: id => ({
        url: ENDPOINTS.MEMBER_COUPONS + `/${id}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: SingleCouponResponseType) => {
        return response;
      },
    }),
    getRenew: builder.query<RenewResponseType, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_RENEW,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: RenewResponseType) => {
        return response;
      },
    }),
    getSalesHistory: builder.query<salesHistoryRespondType, transactionDateType>({
      query: transactionDate => ({
        url: `${ENDPOINTS.GET_SALESHISOTRYLIST}?fromDate=${transactionDate.fromDate}&toDate=${transactionDate.toDate}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: salesHistoryRespondType) => {
        return response;
      },
    }),
    getSalesHistoryDetails: builder.query<instoreSalesHistoryType, instoreSalesHistoryParam>({
      query: payload => ({
        url: `${ENDPOINTS.GET_SALESHISOTRYLIST}/${payload.id}/receipt?type=${payload.mode}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: instoreSalesHistoryType) => {
        return response;
      },
    }),
    getSalesOnlineHistoryDetails: builder.query<onlineSalesHistoryType, instoreSalesHistoryParam>({
      query: payload => ({
        url: `${ENDPOINTS.GET_SALESHISOTRYLIST}/${payload.id}/receipt?type=${payload.mode}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: onlineSalesHistoryType) => {
        return response;
      },
    }),
    getOnlineGuestOrderReceipt: builder.query<onlineOrderReceiptType, onlineOrderReceiptParamType>({
      query: payload => ({
        url: `${ENDPOINTS.GET_ONLINE_ORDER}?orderNumber=${payload.orderNumber}`,
        method: "GET",
      }),
      transformResponse: (response: onlineOrderReceiptType) => {
        return response;
      },
    }),
    saveCard: builder.mutation<OriginApiResponseType<MemberSaveCardResponse>, MemberSaveCardRequest>({
      query: payload => ({
        url: ENDPOINTS.MEMBER_SAVED_CARD,
        method: "POST",
        body: payload,
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<MemberSaveCardResponse>) => {
        return response;
      },
    }),
    getSaveCardStatus: builder.query<OriginApiResponseType<MemberSaveCardStatusResponse>, { siteOrderRefNo?: string }>({
      query: payload => ({
        url: `${ENDPOINTS.MEMBER_SAVED_CARD_STATUS}?siteOrderRefNo=${payload.siteOrderRefNo}`,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<MemberSaveCardStatusResponse>) => {
        return response;
      },
    }),
    deleteSavedCard: builder.mutation<OriginApiResponseType<null>, DeleteMemberSaveCardRequest>({
      query: payload => ({
        url: `${ENDPOINTS.MEMBER_SAVED_CARD}/${payload.id}`,
        method: "DELETE",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<null>) => {
        return response;
      },
    }),
    getFavouriteItemList: builder.query<OriginApiResponseType<FavItemListType>, void>({
      query: () => ({
        url: ENDPOINTS.MEMBER_FAVITEMLIST,
        method: "GET",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<FavItemListType>) => {
        return response;
      },
    }),
    addFavItem: builder.mutation<OriginApiResponseType<null>, DeleteFavItemListRequest>({
      query: payload => ({
        url: `${ENDPOINTS.MEMBER_FAVITEMLIST}/${payload.skuCode}`,
        method: "POST",
        body: payload,
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<null>) => {
        return response;
      },
    }),
    deleteFavItem: builder.mutation<OriginApiResponseType<null>, DeleteFavItemListRequest>({
      query: payload => ({
        url: `${ENDPOINTS.MEMBER_FAVITEMLIST}/${payload.skuCode}`,
        method: "DELETE",
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<null>) => {
        return response;
      },
    }),
    reOrder: builder.mutation<OriginApiResponseType<CartApiDataType>, ReOrderRequestType & {
      globalSelectedProductSkuCode?: string;
      branchCode?: string;
    }>({
      query: payload => ({
        url: `${ENDPOINTS.RE_ORDER}`,
        method: "POST",
        body: {
          orderNumber: payload.orderNumber,
        },
        headers: getRequestCommonHeader(),
      }),
      transformResponse: (response: OriginApiResponseType<CartApiDataType>, meta, arg) => {
        if (response.statusCode === 200 && response.data.alertList?.length) {
          setCookie(CookiesKey.sourceForGetCart, "reorder");

          if (response.data.alertList.find(alert => alert.alertCode === "33012")) {
            setCookie(CookiesKey.branchSelectionStep, 2);
            setCookie(CookiesKey.globalSelectedProductSkuCode, arg.globalSelectedProductSkuCode);
            setCookie(CookiesKey.branchCode, arg.branchCode);
          }
        }
        return response;
      },
    }),
    getQRCodeString: builder.query<OriginApiResponseType<{ qrcodeStr: string }>, { lang: LocaleKeysType }>({
      query: payload => ({
        url: `${ENDPOINTS.GET_QRCODE_STRING}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    tokenValidation: builder.mutation<OriginApiResponseType<{ isValid: boolean }>, { token: string }>({
      query: payload => ({
        url: `${ENDPOINTS.TOKEN_VALIDATION}`,
        method: "POST",
        body: payload,
        headers: getRequestCommonHeader(),
      }),
    }),
  }),
});

export const {
  useTokenValidationMutation,
  useGetQRCodeStringQuery,
  useGetCreditCardsQuery,
  useGetProfileQuery,
  useEditProfileMutation,
  useGetCouponsQuery,
  useGetRenewQuery,
  useGetSingleCouponQuery,
  useGetSalesHistoryQuery,
  useSaveCardMutation,
  useGetSaveCardStatusQuery,
  useDeleteSavedCardMutation,
  useGetSalesHistoryDetailsQuery,
  useGetSalesOnlineHistoryDetailsQuery,
  useGetFavouriteItemListQuery,
  useAddFavItemMutation,
  useDeleteFavItemMutation,
  useGetOnlineGuestOrderReceiptQuery,
  useReOrderMutation,
  useGetInboxQuery,
  useGetPersonalMessageDetailsQuery,
  useGetPromotionalMessageDetailsQuery,
  useGetInboxUnreadCountQuery,
} = memberApi;

export const useGetSingleCouponLazyQuery = memberApi.endpoints.getSingleCoupon.useLazyQuery;
export const useGetProfileLazyQuery = memberApi.endpoints.getQRCodeString.useLazyQuery;
export const useGetSavedCardLazyQuery = memberApi.endpoints.getCreditCards.useLazyQuery;
export const useGetSalesHistoryLazyQuery = memberApi.endpoints.getSalesHistory.useLazyQuery;
