import { setCookie, deleteCookie } from "cookies-next";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_DOMAIN, ENDPOINTS } from "@/constants/endpoints/index";
import {
  LoginOTPResponseType,
  LoginResponseType,
  RegistrationInfoSuccessfulResponseType,
  RegistrationOTPResponseType,
  RegistrationResponseType,
  SendOtpRequestParams,
  sendOtpVerifyParams,
  sendRegistrationInfoParams,
} from "@/types/api/apiTypes";
import { getRequestCommonHeader } from "@/utils/clientUtils";
import { CookiesKey } from "@/constants/cookies";
import moment from "moment";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_DOMAIN,
  }),
  endpoints: builder => ({
    sendLoginRequest: builder.mutation<LoginResponseType, SendOtpRequestParams>({
      query: payload => ({
        url: ENDPOINTS.AUTH_LOGIN_OTP_REQUEST,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: async (response: LoginResponseType) => {
        // this session token is only used in the "sendLoginOtpVerify" payload
        if (response.statusCode === 200 && response.data?.sessionToken.length) {
          setCookie(CookiesKey.loginSessionToken, response.data.sessionToken);
        }
        return response;
      },
    }),
    sendLoginOtpVerify: builder.mutation<LoginOTPResponseType, sendOtpVerifyParams>({
      query: payload => ({
        url: ENDPOINTS.AUTH_LOGIN_OTP_VERIFY,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: LoginOTPResponseType) => {
        // set login access token
        if (response.statusCode === 200 && response.data?.verified && response.data.accessToken?.length) {
          setCookie(CookiesKey.accessToken, response.data.accessToken, {
            expires: moment().add(3, "day").toDate(),
          });
          deleteCookie(CookiesKey.loginSessionToken);
        }
        return response;
      },
    }),
    sendRegistrationRequest: builder.mutation<RegistrationResponseType, SendOtpRequestParams>({
      query: payload => ({
        url: ENDPOINTS.AUTH_REGISTRATION_OTP_REQUEST,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: RegistrationResponseType) => {
        //this session token is only use in the "sendRegistrationOTPVerify" payload
        if (response.statusCode === 200 && response.data?.sessionToken.length) {
          setCookie(CookiesKey.registrationSessionToken, response.data?.sessionToken);
        }
        return response;
      },
    }),
    sendRegistrationOTPVerify: builder.mutation<RegistrationOTPResponseType, sendOtpVerifyParams>({
      query: payload => ({
        url: ENDPOINTS.AUTH_REGISTRATION_OTP_VERIFY,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: RegistrationOTPResponseType) => {
        if (response.statusCode === 200 && response.data?.verified) {
          deleteCookie(CookiesKey.registrationSessionToken);
        }
        return response;
      },
    }),
    sendRegistrationInfo: builder.mutation<RegistrationInfoSuccessfulResponseType, sendRegistrationInfoParams>({
      query: payload => ({
        url: ENDPOINTS.AUTH_REGISTRATION_INFO,
        method: "POST",
        headers: getRequestCommonHeader(),
        body: payload,
      }),
      transformResponse: (response: RegistrationInfoSuccessfulResponseType) => {
        return response;
      },
    }),
  }),
});

export const {
  useSendLoginRequestMutation,
  useSendLoginOtpVerifyMutation,
  useSendRegistrationOTPVerifyMutation,
  useSendRegistrationRequestMutation,
  useSendRegistrationInfoMutation,
} = authApi;
