import { ENDPOINTS } from "@/constants/endpoints";
import { CartApiDataType } from "@/types/cartTypes";
import { FetchFailResponse } from "@/types/commonTyps";
import { GetProductApiInputType, ProductApiType } from "@/types/productTypes";
import { getProductApiInputParams } from "@/utils/commonUtils";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const getProductApi = async <T extends "isList" | "isDetail">({ slugId, category, subcategory, lang }: GetProductApiInputType) => {
  return await fetchRequestSeverSide<CartApiDataType>({
    url: ENDPOINTS.GET_CART,
    language: lang!,
    options: {
      method: "GET",
      revalidate: 0,
    }
  })
  .then(result => {
    let params = {};
    if (result.status === 200) {
      params = getProductApiInputParams(result.data, {category, subcategory})
    }

    return fetchRequestSeverSide<ProductApiType<T>>({
      url: `${ENDPOINTS.GET_PRODUCTS}${slugId ? `/${slugId}` : ""}`,
      language: lang!,
      options: {
        method: "GET",
        cache: "no-store",
      },
      params: new URLSearchParams(params),
    })
  })
  .catch((error: FetchFailResponse) => {
    // todo - error
    console.error(error);
    return error;
  });
};