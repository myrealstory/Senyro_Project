import { IndexWithCategorySlugType } from "@/types/pageTypes";

import defaultIndexPage from "../../page";
import { Metadata } from "next";
import { getCategoryApi } from "@/app/[lang]/api/getCategoryApi";
import { generateCategoryMetaData } from "@/utils/commonUtils";

export const generateMetadata = async ({
  params,
}: IndexWithCategorySlugType<"SUB">): Promise<Metadata> => {
  const categoriesData = await getCategoryApi({ lang: params.lang });
  if (categoriesData.status === 200) {
    return generateCategoryMetaData(categoriesData.data, params.mainCategorySlug, params.subCategorySlug);
  }
  return {};
};

export default async function IndexWithSubCategorySlug({ params: { lang, mainCategorySlug, subCategorySlug } }: IndexWithCategorySlugType<"SUB">) {
  return defaultIndexPage({
    mainCategorySlug,
    subCategorySlug,
    params: {
      lang,
    },
  });
}
