// import { bannerDB } from "../../../constants/index/DemoMainDB";
import { Slider } from "../../../components/index/Slider";
import { getCategoryApi } from "../api/getCategoryApi";
import { getProductApi } from "../api/getProductApi";
import { getHeroBannerApi } from "../api/getHeroBannerApi";

import { IndexType } from "@/types/pageTypes";
import { IndexContent } from "@/components/index/IndexContent";
import { FetchResponse } from "@/types/commonTyps";
import { ProductApiType } from "@/types/productTypes";
import { ErrorDispatcher } from "@/components/ErrorDispatcher";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";
import { HeroBannerType } from "@/types/api/apiTypes";
// import { PromotionBar } from "@/components/index/PromotionBar";

export default async function IndexPage({ mainCategorySlug, subCategorySlug, params: { lang } }: IndexType) {
  const categoriesData = await getCategoryApi({ lang });
  let productData: FetchResponse<ProductApiType<"isList">> = { status: 200, data: {} as ProductApiType<"isList"> };
  const error = [];

  if (categoriesData.status === 200) {
    let wrongCategory = false;

    if (
      subCategorySlug &&
      !categoriesData.data
        .flatMap(mainCategory => mainCategory?.subcategories?.flatMap(category => category.slug === subCategorySlug))
        .filter(isFound => isFound)?.length
    ) {
      wrongCategory = true;
    }

    if (
      !wrongCategory &&
      mainCategorySlug &&
      !categoriesData.data.find(category => category.slug === mainCategorySlug)
    ) {
      wrongCategory = true;
    }

    if (wrongCategory) {
      redirect(`${lang}/${ROUTES.INDEX}`);
    }
  }

  if (categoriesData.status === 200) {
    productData = await getProductApi<"isList">({
      lang,
      type: "EFFECTIVE",
      category: mainCategorySlug
        ? decodeURIComponent(mainCategorySlug)
        : decodeURIComponent(categoriesData?.data?.[0]?.slug),
      subcategory: subCategorySlug ? decodeURIComponent(subCategorySlug) : undefined,
    });
  } else {
    error.push({
      api: "category",
      error: typeof categoriesData.error === "string" ? categoriesData.error : JSON.stringify(categoriesData.error),
    });
  }

  if (productData.status !== 200) {
    error.push({
      api: "product",
      error: typeof productData.error === "string" ? productData.error : JSON.stringify(productData.error),
    });
  }

  const heroBannerData = await getHeroBannerApi({ lang });

  return (
    <div>
      <ErrorDispatcher data={error} />
      {<Slider images={heroBannerData.status === 200 ? heroBannerData?.data : ([] as HeroBannerType[])} />}
      {productData?.status === 200 && categoriesData.status === 200 && (
        <IndexContent
          data={{
            productList: productData.data.productList,
            recommendation: productData.data.recommendationList,
            redommendationId: productData.data.recommendationId,
            categories: categoriesData.data,
          }}
          lang={lang}
          mainCategorySlug={mainCategorySlug}
          subCategorySlug={subCategorySlug}
        />
      )}
    </div>
  );
}
