import { ENDPOINTS } from "@/constants/endpoints";
import { AddOnListType } from "@/types/addOnTypes";
import { LocaleKeysType } from "@/app/i18n";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const getAddOnListApi = async ({ lang }: { lang: LocaleKeysType; }) => {
  return fetchRequestSeverSide<AddOnListType>({
    url: ENDPOINTS.GET_ADD_ON_LIST,
    language: lang,
    options: {
      method: "GET",
      revalidate: 0,
    },
  })
  .catch((error: FetchFailResponse) => {
    // todo - error
    console.error(error);
    return error;
  });
};