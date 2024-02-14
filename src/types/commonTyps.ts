import { LocaleKeysType } from "@/app/i18n";

export type REACT_ENV = "LOCAL" | "DEV" | "SIT" | "UAT" | "PROD";


export type PageConfigType = {
  isDisplayFooter: string[];
  needsToLogin: string[];
  isNestPage: {
    [route: string]: {
      api: string;
      dataKey: string;
    };
  };
};

export type WdigetConfigDetailType = {
  env: REACT_ENV[];
}

export type WidgetConfigType = {
  topErrorMessageBar: WdigetConfigDetailType;
  reduxLooger: WdigetConfigDetailType;
  registrationFormChecking: WdigetConfigDetailType;
}

export type FetchResponseSuccessStatus = 200;
export type FetchResponseFailStatus = 400 | 401 | 403;

export type FetchSuccessResponse<T> = {
  status: FetchResponseSuccessStatus;
  data: T;
};

export type FetchFailResponse = {
  status: FetchResponseFailStatus;
  error: {
    message: string;
    returnCode: string;
    statusCode: number;
  };
};

export type FetchRequest = {
  url: URL | string;
  options: RequestInit & { 
    headers?: RequestInit["headers"] & { "device-id"?: string, "Content-Type"?: string, source?: any, },
    cache?: "force-cache" | "no-store",
    revalidate?: number;
    accessToken?: string;
    source?: string;
  };
  params?: Record<string, any>;
  language: LocaleKeysType;
  body?: Record<string, any>;
};

export type FetchResponse<T> = FetchSuccessResponse<T> | FetchFailResponse;

export type OriginApiResponseType<T> = {
  statusCode: FetchResponseSuccessStatus | FetchResponseFailStatus;
  data: T;
  returnCode?: string; // exception handle
}
