import { LocaleKeysType } from "@/app/i18n";
import { ENDPOINTS } from "@/constants/endpoints";
import { CategoriesTypes } from "@/types/categorysTypes";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const getCategoryApi = async ({ lang }: { lang: LocaleKeysType; }) => {
  return fetchRequestSeverSide<CategoriesTypes[]>({
    url: ENDPOINTS.GET_CATEGORIES,
    language: lang,
    options: {
      method: "GET",
    },
    params: {
      date: new Date().toISOString(),
    },
  })
  .catch((error: FetchFailResponse) => {
    // todo - error
    console.error(error);
    return error;
  });
};