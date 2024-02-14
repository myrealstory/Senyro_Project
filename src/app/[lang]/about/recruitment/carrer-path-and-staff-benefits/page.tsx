import React from "react";
import { BenefitCard } from "@/components/about/BenefitCard";
import { LocaleKeysType } from "@/app/i18n";

const CareerPathCardPage = ({ params }: { params: { lang: LocaleKeysType } }) => {
  return <BenefitCard lang={params.lang} id={"BenefitCard"} />;
};

export default CareerPathCardPage;
