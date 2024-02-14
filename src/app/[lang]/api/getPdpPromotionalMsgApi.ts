import { ENDPOINTS } from "@/constants/endpoints";
import { LocaleKeysType } from "@/app/i18n";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";
import { PromotionalMessageApiType } from "@/types/api/apiTypes";

const getPdpPromotionalMsgApi = async ({ lang, slug }: { lang: LocaleKeysType; slug: string }) => {
  return fetchRequestSeverSide<PromotionalMessageApiType>({
    url: `${ENDPOINTS.GET_PROMOTIONAL_MESSAGE_PDP}/?pdp_slug=${slug}`,
    language: lang,
    options: {
      method: "GET",
      revalidate: 0,
    },
  }).catch((error: FetchFailResponse) => {
    // todo - error
    console.error(error);
    return error;
  });
};

export default getPdpPromotionalMsgApi;
