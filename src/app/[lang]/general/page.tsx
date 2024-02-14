import { LocaleKeysType } from "@/app/i18n";
import { Metadata } from "next";
import GeneralPageContainer from "@/components/general/GeneralPageContainer";

export const metadata: Metadata = {
  title: "Gerenal Page",
};

export default async function General({ params }: { params: { lang: LocaleKeysType } }) {
  return (
    <>
      <GeneralPageContainer lang={params.lang} />
    </>
  );
}
