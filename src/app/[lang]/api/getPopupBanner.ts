import { LocaleKeysType } from "@/app/i18n";
import { BASE_DOMAIN, ENDPOINTS } from "@/constants";
import { FloatingPopupBannerType } from "@/types/api/apiTypes";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const getPopupBannerApi = async ({ lang }: { lang: LocaleKeysType }) => {
  return fetchRequestSeverSide<FloatingPopupBannerType>({
    url: `${BASE_DOMAIN}${ENDPOINTS.GET_POPUP_BANNER}`,
    language: lang,
    options: {
      method: "GET",
      revalidate: 0,
    },
  }).catch((error: FetchFailResponse) => {
    console.log(error);
    return error;
  });
};
