import { Metadata } from "next";
import { LocaleKeysType } from "@/app/i18n";

import { StoreContainer } from "@/components/store-locator/StoreContainer";
import { FetchFailResponse } from "@/types/commonTyps";
import { ENDPOINTS } from "@/constants/endpoints";
import { Stores } from "@/types/api/apiTypes";
import { fetchRequestSeverSide } from "@/utils/serverUtils";

export const metadata: Metadata = {
  title: "Store Locator",
};

export default async function StoreLocationPage({ params }: { params: { lang: LocaleKeysType } }) {
  const storeList = await fetchRequestSeverSide<Stores[]>({
    url: ENDPOINTS.GET_STORE,
    language: params.lang,
    options: {
      method: "GET",
      revalidate: 0,
    },
  }).catch((error: FetchFailResponse) => {
    console.log(error);
    return error;
  });
  // absolute lg:left-[7rem] lg:top-[12rem]
  return (
    <main className="lg:h-fit ">
      {storeList.status === 200 && (
        <>
          <StoreContainer lang={params.lang} storeLists={storeList.data} />
        </>
      )}
    </main>
  );
}
