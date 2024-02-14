import { Metadata } from "next";
import "@/style/general-information/general-information.scss";
import QualityIngredientContainer from "@/components/general/QualityIngredientContainer";
import { LocaleKeysType } from "@/app/i18n";

export const metadata: Metadata = {
  title: "Quality Ingredient",
};

export default function QualityIngredientPage({ params }: { params: { lang: LocaleKeysType } }) {
  return <QualityIngredientContainer lang={params.lang} />;
}
