import { LocaleKeysType } from "@/app/i18n";
import "@/style/general-information/general-information.scss";
import RecruitmentContainer from "@/components/about/RecruitmentContainer";

export default function JobApplicationPage({ params }: { params: { lang: LocaleKeysType } }) {
  return <RecruitmentContainer lang={params.lang} />;
}
