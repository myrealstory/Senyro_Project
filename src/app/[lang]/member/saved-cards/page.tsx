import { LocaleKeysType } from "@/app/i18n";
import { SavedCardsContainer } from "@/components/member/SavedCardsContainer";

export default function SavedCardsPage({ params }: { params: { lang: LocaleKeysType } }) {
  return <SavedCardsContainer lang={params.lang} />;
}
