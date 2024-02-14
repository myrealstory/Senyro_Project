import { cookies, headers } from "next/headers";
import { CookiesKey, CookiesKeyType } from "@/constants/cookies";
import { FetchFailResponse, FetchRequest, FetchResponse } from "@/types/commonTyps";
import { fetchRequest } from "./commonUtils";
import moment from "moment";

// keep for future use
const cookieStringConvert = (): Record<string, string> => {
  const cookieString = headers().get("cookie") ?? "";
  const keyValuePairs = cookieString.split("; ").reduce((prev: any, current: any) => {
    const [name, ...value] = current.split("=");
    prev[name] = value.join("=");
    return prev;
  }, {});
  return keyValuePairs;
};

const getCookieValue = (key: CookiesKeyType) => {
  const cookieStore = cookieStringConvert();
  return cookieStore?.[key] ?? undefined;
};

// keep for future use
// options: https://wicg.github.io/cookie-store/
const setCookie = (
  key: CookiesKeyType,
  value: string,
  options: Record<string, any> = {
    expiryTime: moment().add(72, "hours").unix(),
  }
) => {
  cookies().set(key, value, options);
};

const fetchRequestSeverSide = async <T>({
  url,
  params,
  body,
  language,
  options,
}: FetchRequest): Promise<FetchResponse<T>> => {
  const headersList = headers();
  const deviceId = getCookieValue(CookiesKey.deviceId);
  const accessToken = getCookieValue(CookiesKey.accessToken) ?? options?.accessToken ?? undefined;
  const newOptinos = {
    ...options,
    headers: Object.assign(
      {},
      options.headers,
      { "device-id": deviceId ?? headersList.get("deviceId") },
      accessToken ? { authorization: `Bearer ${accessToken}` } : {}
    ),
  };
  return fetchRequest<T>({ url, params, body, language, options: newOptinos })
  .catch((err: FetchFailResponse) => {
    return Promise.reject(err);
  })
};

export { getCookieValue, fetchRequestSeverSide, setCookie };
