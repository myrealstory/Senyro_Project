import { ENDPOINTS } from "@/constants/endpoints";
import { FetchResponse } from "@/types/commonTyps";
import { LocaleKeysType, defaultLocale } from "@/app/i18n";
import { ApiMIddlewareType, ProfileResType } from "@/types/api/apiTypes";
import { ROUTES, RoutesNameType } from "@/constants/routes";

import { fetchRequestSeverSide } from "./serverUtils";
import { getRouteNameFromPathname } from "./commonUtils";
import { AddCartResponseType } from "@/types/cartTypes";
import { getMaintenanceStatus } from "@/app/[lang]/api/getMaintenanceStatus";
import { redirect } from "next/navigation";

type FetchPayloadType = {
  url: string;
  method: "GET" | "POST";
  param?: Record<string, any>;
  body?: any;
  options: Record<string, any>;
};

const getUserProfile = async (lang: LocaleKeysType, accessToken?: string) => {
  if (accessToken?.length) {
    return fetchRequestSeverSide<ProfileResType>({
      url: ENDPOINTS.MEMBER_PROFILE_FULLURL,
      language: lang,
      options: {
        method: "GET",
        revalidate: 0,
      },
    }).catch(err => {
      return Promise.resolve(err);
    });
  }
  return Promise.resolve<FetchResponse<any>>({
    status: 200,
    data: undefined,
  });
};

const addCartAfterMemberLogin = async (
  lang: LocaleKeysType,
  accessToken: string,
  cartItem: string,
  addCartIsContinue: string
) => {
  return fetchRequestSeverSide<AddCartResponseType<"">>({
    url: ENDPOINTS.ADD_CART,
    language: lang,
    body: { ...JSON.parse(cartItem), isCartPage: false, isContinue: addCartIsContinue === "true" ? true : false },
    options: {
      accessToken,
      method: "POST",
      headers: {
        source: "normal",
      },
    },
  })
    .then(res => {
      if (res.status !== 200) {
        return Promise.reject({
          status: res.status,
          data: null,
          error: res,
        });
      }

      return Promise.resolve({
        status: 200,
        data: res,
        error: null,
      });
    })
    .catch(error => {
      console.log("addCartAfterMemberLogin error: ", error);
      return Promise.resolve({
        status: error.status,
        data: null,
        error,
      });
    });
};

export const generalApisRequests = async (params: ApiMIddlewareType) => {
  const { lang, pathname, options } = params;
  const slugs = getRouteNameFromPathname(pathname);
  const response: Record<string, any> = {};
  let skipApiRequest = false;

  response.maintenanceStatus = await getMaintenanceStatus();

  if (response.maintenanceStatus.status === 400) {
    skipApiRequest = true;
    if (pathname !== `/${lang}/${ROUTES.MAINTENANCE_DAILY}` && pathname !== `/${lang}/${ROUTES.MAINTENANCE}`) {
      if (response.maintenanceStatus.error.data?.scheduleMaintenance) {
        redirect(`/${lang}/${ROUTES.MAINTENANCE_DAILY}`);
      } else {
        redirect(`/${lang}/${ROUTES.MAINTENANCE}`);
      }
    }
  } else if (
    response.maintenanceStatus.status === 200 &&
    (pathname === `/${lang}/${ROUTES.MAINTENANCE_DAILY}` || pathname === `/${lang}/${ROUTES.MAINTENANCE}`)
  ) {
    skipApiRequest = true;
    redirect(`/${defaultLocale}/${ROUTES.INDEX}`);
  }

  response.profile = await getUserProfile(lang, options?.accessToken);

  if (response.profile.error) {
    skipApiRequest = true;
  }

  if (
    !skipApiRequest &&
    options?.accessToken &&
    options?.addCartBeforeMemberLogin &&
    pathname === options?.targetPageToBeRedirectedTo
  ) {
    const res = await addCartAfterMemberLogin(
      lang,
      options.accessToken,
      options.addCartBeforeMemberLogin,
      options.addCartIsContinue ?? ""
    );
    Object.assign(response, {
      addCartAfterMemberLogin: {
        status: res.status,
        data: res.status === 200 ? res.data : undefined,
        error: res.status !== 200 ? res.error : undefined,
      },
    });
  }

  const apis: Record<string, FetchPayloadType> | object = Object.assign(
    {},
    !skipApiRequest &&
      !([ROUTES.ORDER_COMPLETE] as RoutesNameType[]).includes(slugs.secondSlug) &&
      `${slugs.secondSlug}/${slugs.thirdSlug}` !== `${ROUTES.CHECKOUT}/${ROUTES.PROCESSING}`
      ? {
          cart: {
            url: ENDPOINTS.GET_CART,
            method: "GET",
            param: () => {
              const isCartPage =
                (
                  [ROUTES.CART, ROUTES.INDEX, ROUTES.PRODUCT, ROUTES.CHECKOUT, ROUTES.MEMBER] as RoutesNameType[]
                ).includes(slugs.secondSlug) ||
                ([ROUTES.FAVOURITE, ROUTES.ADD_ON] as RoutesNameType[]).includes(slugs.thirdSlug);

              return {
                isCartPage: String(isCartPage),
              };
            },
            options: {
              revalidate: 0,
              headers: {
                source: options?.sourceForGetCart
                  ? options?.sourceForGetCart
                  : slugs.secondSlug === ROUTES.CART
                  ? "cart"
                  : slugs.secondSlug === ROUTES.CHECKOUT
                  ? "confirm"
                  : slugs.secondSlug === ROUTES.INDEX || slugs.secondSlug === ROUTES.PRODUCT
                  ? "normal"
                  : "normal",
              },
            },
          },
        }
      : {}
  );

  if (options?.accessToken?.length && !skipApiRequest) {
    Object.assign(
      apis,
      {
        inboxUnreadCount: {
          url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/${ENDPOINTS.MEMBER_INBOX_UNREAD}`,
          method: "GET",
          param: {},
          options: {},
        },
      },
      {
        coupon: {
          url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/${ENDPOINTS.MEMBER_COUPONS}`,
          method: "GET",
          param: {},
          options: {},
        },
      }
    );
  }

  const promises = Object.values(apis).map(api =>
    fetchRequestSeverSide<any>({
      url: api.url,
      language: lang,
      params:
        api.method === "GET"
          ? typeof api.param === "function"
            ? new URLSearchParams(api.param())
            : new URLSearchParams(api.param)
          : undefined,
      body: api.method === "POST" ? api.body : undefined,
      options: {
        method: api.method,
        cache: api.options?.cache,
        revalidate: api.options?.revalidate,
        headers: Object.assign(
          {},
          api.options?.headers?.source
            ? {
                source: api.options?.headers?.source ?? "",
              }
            : {}
        ) as any,
      },
    })
  );

  return Promise.allSettled(promises).then(results => {
    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.status === 200) {
        Object.assign(response, {
          [Object.keys(apis)[index]]: {
            status: 200,
            data: result.value.data,
          },
        });
      } else if (result.status === "rejected") {
        Object.assign(response, {
          [Object.keys(apis)[index]]: {
            status: 400,
            error: result.reason,
          },
        });
      }
    });
    return response;
  });
  // keep for future usage
  // .then(result => {
  //   Object.values(result).forEach(value => {
  //     if (value?.status === 400 && value?.error?.error?.returnCode === "33008" &&
  //     `${slugs.secondSlug}/${slugs.thirdSlug}` !== ROUTES.CHECKOUT_PROCESSING) {
  //         redirect(`/${lang}/${ROUTES.CHECKOUT_PROCESSING}`);
  //       }
  //   })

  //   return result;
  // })
};
