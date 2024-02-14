import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_DOMAIN, ENDPOINTS } from "@/constants/endpoints/index";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { UnsubscribeResponseType } from "@/types/api/apiTypes";
import { LocaleKeysType } from "@/app/i18n";
import { OriginApiResponseType } from "@/types/commonTyps";
//  todo: create a new type for news response
import {
  NewsOffersListType,
  NewsOffersListDetailType,
  FloatingPopupBannerType,
  PromotionalMessageApiType,
  PromotionalMessageFooterApiType,
} from "@/types/api/apiTypes";

export const generalApi = createApi({
  reducerPath: "generalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_DOMAIN,
  }),
  endpoints: builder => ({
    unsubscribe: builder.mutation<UnsubscribeResponseType, { email: string }>({
      query: payload => ({
        url: ENDPOINTS.UNSUBSCRIBE,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: UnsubscribeResponseType) => {
        return response;
      },
    }),
    getNewsList: builder.query<OriginApiResponseType<NewsOffersListType[]>, { lang: LocaleKeysType }>({
      query: payload => ({
        url: ENDPOINTS.GET_NEWS,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getNewsDetail: builder.query<
      OriginApiResponseType<NewsOffersListDetailType>,
      { lang: LocaleKeysType; slug: string }
    >({
      query: payload => ({
        url: `${ENDPOINTS.GET_NEWS}/${payload.slug}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getFloatingBanner: builder.query<OriginApiResponseType<FloatingPopupBannerType>, void>({
      query: payload => ({
        url: `${ENDPOINTS.GET_FLOATING_BANNER}`,
        method: "GET",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
    }),
    getPopupBanner: builder.query<OriginApiResponseType<FloatingPopupBannerType>, void>({
      query: payload => ({
        url: `${ENDPOINTS.GET_POPUP_BANNER}`,
        method: "GET",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
    }),
    getPromotinoalMsgNews: builder.query<OriginApiResponseType<PromotionalMessageApiType>, { lang: LocaleKeysType }>({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_NEWS}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getPromotinoalMsgDineIn: builder.query<OriginApiResponseType<PromotionalMessageApiType>, { lang: LocaleKeysType }>({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_DINEIN}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getPromotinoalMsgCart_top: builder.query<
      OriginApiResponseType<PromotionalMessageApiType>,
      { lang: LocaleKeysType }
    >({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_CART_TOP}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getPromotinoalMsgCart_bottom: builder.query<
      OriginApiResponseType<PromotionalMessageApiType>,
      { lang: LocaleKeysType }
    >({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_CART_BOTTOM}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),

    getPromotinoalMsgCardPromotion: builder.query<
      OriginApiResponseType<PromotionalMessageApiType>,
      { lang: LocaleKeysType }
    >({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_CARD}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getPromotinoalMsgSiteTop: builder.query<OriginApiResponseType<PromotionalMessageApiType>, { lang: LocaleKeysType }>(
      {
        query: payload => ({
          url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_SITETOP}`,
          method: "GET",
          headers: getRequestCommonHeader(payload.lang),
        }),
      }
    ),
    getPromotinoalMsgPDP: builder.query<
      OriginApiResponseType<PromotionalMessageApiType>,
      { lang: LocaleKeysType; slug: string }
    >({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_PDP}/?pdp_slug=${payload.slug}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
    getPromotinoalMsgFooter: builder.query<
      OriginApiResponseType<PromotionalMessageFooterApiType>,
      { lang: LocaleKeysType }
    >({
      query: payload => ({
        url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_FOOTER}`,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
  }),
});

export const {
  useGetNewsListQuery,
  useGetNewsDetailQuery,
  useUnsubscribeMutation,
  useGetFloatingBannerQuery,
  useGetPopupBannerQuery,
  useGetPromotinoalMsgNewsQuery,
  useGetPromotinoalMsgDineInQuery,
  useGetPromotinoalMsgCart_topQuery,
  useGetPromotinoalMsgCart_bottomQuery,
  useGetPromotinoalMsgCardPromotionQuery,
  useGetPromotinoalMsgSiteTopQuery,
  useGetPromotinoalMsgPDPQuery,
  useGetPromotinoalMsgFooterQuery,
} = generalApi;
