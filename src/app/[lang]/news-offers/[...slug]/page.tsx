import "@/style/general-information/general-information.scss";
import { Metadata } from "next";
import { LocaleKeysType } from "@/app/i18n";
import NewsOffersDetailContainer from "@/components/general/NewsOffersDetailContainer";

import { fetchRequestSeverSide } from "@/utils/serverUtils";
import { ENDPOINTS } from "@/constants/endpoints";
import { NewsOffersListDetailType } from "@/types/api/apiTypes";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

const getNewsDetail = (slug: string, lang: LocaleKeysType) => {
  return fetchRequestSeverSide<NewsOffersListDetailType>({
    url: `${process.env.NEXT_PUBLIC_API_DOMAIN}/${ENDPOINTS.GET_NEWS}/${slug}`,
    language: lang,
    options: {
      method: "GET",
      revalidate: 0,
    },
  }).catch(error => {
    return error;
  });
};

export const generateMetadata = async ({
  params,
}: {
  params: { lang: LocaleKeysType; slug: string };
}): Promise<Metadata> => {
  const newsDetail = await getNewsDetail(params.slug, params.lang);
  if (newsDetail.status === 200) {
    return {
      title: newsDetail.data.metaTitle,
      keywords: newsDetail.data.metaKeyword,
      description: newsDetail.data.metaDescription,
    };
  }
  return {};
};

export default async function NewsPage({ params }: { params: { slug: string; lang: LocaleKeysType } }) {
  const newsDetail = await getNewsDetail(params.slug, params.lang);

  if (!newsDetail || newsDetail.status !== 200 || !newsDetail.data) {
    redirect(`/${params.lang}/${ROUTES.INDEX}`);
  }

  return (
    <>
      <NewsOffersDetailContainer newsDetail={newsDetail.data} lang={params.lang} />
    </>
  );
}
