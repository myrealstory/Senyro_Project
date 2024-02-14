import { NextResponse, NextRequest } from "next/server";
import { RequestCookies, ResponseCookies } from "next/dist/server/web/spec-extension/cookies";
import acceptLanguage from "accept-language";
import moment from "moment";
import { CookiesKey } from "./constants/cookies";
import { PageConfig } from "./config";
import { locales } from "./app/i18n";
import { v4 as uuidv4 } from "uuid";
import { getLangFromString, getRouteNameFromPathname } from "./utils/commonUtils";
import { ROUTES } from "./constants";

const setIsDisplayFooter = (cookies: ResponseCookies | RequestCookies, pathname: string) => {
  let isDisplayFooter = false;
  PageConfig.isDisplayFooter.some(page => {
    if (page && page.indexOf(pathname.split("/")[2]) > -1) {
      isDisplayFooter = true;
    }
    return isDisplayFooter;
  });

  if (isDisplayFooter) {
    cookies.set(CookiesKey.isDisplayFooter, "true", { expires: moment().add(72, "hours").valueOf() });
  } else {
    cookies.set(CookiesKey.isDisplayFooter, "false");
  }
};

const setDeviceId = (request: NextRequest, response: NextResponse) => {
  const hasDeviceID = request.cookies.get(CookiesKey.deviceId);
  // const hasDeviceID = request.cookies.has(CookiesKey.deviceId);
  if (!hasDeviceID) {
    const newDeviceId = uuidv4();
    response.cookies.set(CookiesKey.deviceId, newDeviceId, {
      // seconds
      maxAge: 60 * 60 * 24 * 3,
    });
    response.cookies.set(CookiesKey.screenPopBanner, "true");
    response.cookies.set(CookiesKey.floatingPopBanner, "true");
    response.headers.set("deviceId", newDeviceId);
  }
};

acceptLanguage.languages(locales);

const checkLocal = (request: NextRequest, response: NextResponse) => {
  const langFromPathname = getLangFromString(request.nextUrl.pathname);
  const queryParams = request.nextUrl.search;

  if (request.nextUrl.pathname === `/${langFromPathname}`) {
    response = NextResponse.redirect(new URL(`/${langFromPathname}/${ROUTES.INDEX}${queryParams ?? ""}`, request.url));
  }

  // Redirect if lang in path is not supported
  if (
    !locales.some(locale => request.nextUrl.pathname.startsWith(`/${locale}`)) &&
    !request.nextUrl.pathname.startsWith("/_next")
  ) {
    response = NextResponse.redirect(
      new URL(`/${langFromPathname}${request.nextUrl.pathname}${queryParams ?? ""}`, request.url)
    );
  }

  const referer = request.headers.get("referer");
  let langInReferer: string | undefined = undefined;
  if (referer) {
    const refererUrl = new URL(referer);
    langInReferer = locales.find(locale => refererUrl.pathname.startsWith(`/${locale}`));
  }

  if (langInReferer) {
    response.cookies.set(CookiesKey.i18next, langInReferer);
  } else {
    response.cookies.set(CookiesKey.i18next, langFromPathname);
  }

  return response;
};

const validateIfRouteNeedsToLogin = (request: NextRequest, response: NextResponse) => {
  const page = getRouteNameFromPathname(request.nextUrl.pathname);
  const langFromPathname = getLangFromString(request.nextUrl.pathname);
  const hasAccessToken = request.cookies.get(CookiesKey.accessToken);

  if (PageConfig.needsToLogin.includes(page.secondSlug) && (!hasAccessToken || !hasAccessToken?.value?.length)) {
    const redirect = NextResponse.redirect(new URL(`/${langFromPathname}/${ROUTES.LOGIN}`, request.url));
    response = redirect;
    response.cookies.set(CookiesKey.targetPageToBeRedirectedTo, request.nextUrl.pathname);
  }

  return response;
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // get the path name from server side
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response = checkLocal(request, response);
  response = validateIfRouteNeedsToLogin(request, response);
  setIsDisplayFooter(response.cookies, request.nextUrl.pathname);
  setDeviceId(request, response);
  return response;
}
