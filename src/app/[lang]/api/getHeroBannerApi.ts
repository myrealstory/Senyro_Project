import { ENDPOINTS } from "@/constants/endpoints";
import { HeroBannerType, PromotionalMessageApiType } from "@/types/api/apiTypes";
import { LocaleKeysType } from "@/app/i18n";
import { FetchFailResponse } from "@/types/commonTyps";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const getHeroBannerApi = async ({ lang }: { lang: LocaleKeysType }) => {
  return fetchRequestSeverSide<HeroBannerType[]>({
    url: ENDPOINTS.GET_HERO_BANNER,
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
export const getSlugApi = async ({
  lang,
  mainCategorySlug,
  subCategorySlug,
}: {
  lang: LocaleKeysType;
  mainCategorySlug: string;
  subCategorySlug?: string;
}) => {
  return fetchRequestSeverSide<PromotionalMessageApiType>({
    url: ENDPOINTS.GET_PROMOTIONAL_MESSAGE_PLP,
    language: lang,
    options: {
      method: "GET",
      revalidate: 0,
    },
    params: {
      category_slug: mainCategorySlug,
      sub_category_slug: subCategorySlug,
    },
  }).catch((error: FetchFailResponse) => {
    // todo - error
    console.error(error);
    return error;
  });
};
