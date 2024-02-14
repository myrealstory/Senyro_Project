import { Metadata } from "next";

import Recommend from "@/components/cart/Recommend";
import ProductInfo from "@/components/product/ProductInfo";
import { LocaleKeysType } from "@/app/i18n";

import { getProductApi } from "../../api/getProductApi";
import getPdpPromotionalMsgApi from "../../api/getPdpPromotionalMsgApi";
import "@/style/PDP/PDP.scss";

export const generateMetadata = async ({
  params,
}: {
  params: { lang: LocaleKeysType; id: string };
}): Promise<Metadata> => {
  const slugId = String(params.id);
  const productDetail = await getProductApi<"isDetail">({ slugId: slugId, lang: params.lang, type: "EFFECTIVE" });
  if (productDetail.status === 200) {
    return {
      title: productDetail.data.product?.detailPageMetaTitle,
      keywords: productDetail.data.product?.detailPageMetaKeyword,
      description: productDetail.data.product?.detailPageMetaDescription,
    };
  }
  return {};
};

export default async function ProductPage({ params }: { params: { lang: LocaleKeysType; id: string } }) {
  const slugId = params.id;
  const lang = params.lang;
  const productDetail = await getProductApi<"isDetail">({ slugId: slugId, lang: lang, type: "EFFECTIVE" });
  const promotionalMsg = await getPdpPromotionalMsgApi({ lang: lang, slug: slugId });

  return (
    <>
      <div className="wrapper PDPContainer">
        <div className="PDPContainerRow">
          {productDetail.status === 200 && promotionalMsg.status === 200 && (
            <ProductInfo
              data={productDetail.data.product}
              lang={lang}
              promotionalMsgData={promotionalMsg.data}
              isPromotionalMsgSuccess={promotionalMsg.status === 200}
            />
          )}
        </div>
      </div>
      {productDetail?.status === 200 &&
        productDetail.data.recommendationList &&
        productDetail.data.recommendationList?.length > 0 && (
          <Recommend
            recommendData={productDetail.data.recommendationList}
            recommendId={productDetail.data.recommendationId}
            mode="NORMAL"
          />
        )}
    </>
  );
}
