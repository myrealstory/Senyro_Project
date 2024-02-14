import { IndexWithCategorySlugType } from "@/types/pageTypes";

import defaultIndexPage from "../page";
import { getCategoryApi } from "../../api/getCategoryApi";
import { Metadata } from "next";
import { generateCategoryMetaData } from "@/utils/commonUtils";

export const generateMetadata = async ({
  params,
}: IndexWithCategorySlugType<"MAIN">): Promise<Metadata> => {
  const categoriesData = await getCategoryApi({ lang: params.lang });
  if (categoriesData.status === 200) {
    return generateCategoryMetaData(categoriesData.data, params.mainCategorySlug);
  }
  return {};
};

export default async function IndexWithMainCategorySlug({ params: { lang, mainCategorySlug } }: IndexWithCategorySlugType<"MAIN">) {
  return defaultIndexPage({
    mainCategorySlug,
    params: {
      lang,
    },
  });
}
