import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import AboutHomeContainer from "@/components/about/AboutHomeContainer";

export default async function About({ params }: { params: { lang: LocaleKeysType } }) {
  return <AboutHomeContainer lang={params.lang} />;
}
