import React from "react";
import { CareerCard } from "@/components/about/CareerCard";
import { LocaleKeysType } from "@/app/i18n";

const CareerCardPage = ({ params }: { params: { lang: LocaleKeysType } }) => {
  return <CareerCard lang={params.lang} id={"CareerCard"} />;
};

export default CareerCardPage;
