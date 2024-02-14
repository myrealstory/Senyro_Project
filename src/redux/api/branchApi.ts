import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINTS } from "@/constants/endpoints";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { LocaleKeysType } from "@/app/i18n";
import { OriginApiResponseType } from "@/types/commonTyps";
import { BranchListApiResponseType, RegionListType } from "@/types/branchTypes";
import { GetBranchListInputType } from "@/types/firstTimeOrderPopupTypes";

export const branchApi = createApi({
  reducerPath: "branchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "",
  }),
  endpoints: builder => ({
    getBranchList: builder.query<OriginApiResponseType<BranchListApiResponseType>, GetBranchListInputType>({
      query: payload => ({
        url: ENDPOINTS.GET_BRANCHES,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
        params: {
          region: payload.region,
          district: payload.district,
          lat: payload.lat,
          long: payload.long,
          //for caching only (rtk)
          cache: payload.cache,
        },
      }),
    }),
    getRegionList: builder.query<OriginApiResponseType<RegionListType[]>, { lang: LocaleKeysType }>({
      query: payload => ({
        url: ENDPOINTS.GET_REGION,
        method: "GET",
        headers: getRequestCommonHeader(payload.lang),
      }),
    }),
  }),
});

export const { 
  useGetBranchListQuery, 
  useLazyGetBranchListQuery, 
  useGetRegionListQuery } = branchApi;
