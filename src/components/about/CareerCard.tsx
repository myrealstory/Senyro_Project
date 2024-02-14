"use client";
import { useState } from "react";
import { CareerFoldUnit } from "@/components/about/CareerFoldUnit";
// import { careerContent } from "@/constants/about/career";
import { ScrollToTopBtn } from "../ScrollToTopBtn";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";

interface content {
  title: string;
  JD: string[];
}

export const CareerCard = ({ lang }: { lang: LocaleKeysType; id?: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { translate } = useTranslation(lang);
  const h1Content = `${translate("about.careerCardContent1")}
  ${translate("about.careerCardContent2")}`;

  const careerContent: content[] = [
    {
      title: `${translate("aboutUsRecruitment.shopManager")}`,
      JD: [
        `${translate("aboutUsRecruitment.shopManagerRequirment1")}`,
        `${translate("aboutUsRecruitment.shopManagerRequirment2")}`,
        `${translate("aboutUsRecruitment.shopManagerRequirment3")}`,
        `${translate("aboutUsRecruitment.shopManagerRequirment4")}`,
        `${translate("aboutUsRecruitment.shopManagerRequirment5")}`,
        `${translate("aboutUsRecruitment.shopManagerRequirment6")}`,
        `${translate("aboutUsRecruitment.shopManagerRequirment7")}`,
      ],
    },
    {
      title: `${translate("aboutUsRecruitment.kitchenSupervisor")}`,
      JD: [
        `${translate("aboutUsRecruitment.kitchenSupervisorRequirment1")}`,
        `${translate("aboutUsRecruitment.kitchenSupervisorRequirment2")}`,
        `${translate("aboutUsRecruitment.kitchenSupervisorRequirment3")}`,
        `${translate("aboutUsRecruitment.kitchenSupervisorRequirment4")}`,
        `${translate("aboutUsRecruitment.kitchenSupervisorRequirment5")}`,
      ],
    },
    {
      title: `${translate("aboutUsRecruitment.server")}`,
      JD: [
        `${translate("aboutUsRecruitment.serverRequirment1")}`,
        `${translate("aboutUsRecruitment.serverRequirment2")}`,
        `${translate("aboutUsRecruitment.serverRequirment3")}`,
        `${translate("aboutUsRecruitment.serverRequirment4")}`,
        `${translate("aboutUsRecruitment.serverRequirment5")}`,
        `${translate("aboutUsRecruitment.serverRequirment6")}`,
      ],
    },
    {
      title: `${translate("aboutUsRecruitment.cook")}`,
      JD: [
        `${translate("aboutUsRecruitment.cookrRequirment1")}`,
        `${translate("aboutUsRecruitment.cookrRequirment2")}`,
        `${translate("aboutUsRecruitment.cookrRequirment3")}`,
        `${translate("aboutUsRecruitment.cookrRequirment4")}`,
      ],
    },
    {
      title: `${translate("aboutUsRecruitment.cleaner")}`,
      JD: [
        `${translate("aboutUsRecruitment.cleanerRequirment1")}`,
        `${translate("aboutUsRecruitment.cleanerRequirment2")}`,
      ],
    },
  ];

  return (
    <section className="recruitmentPageWrapper pb-5 ">
      <ScrollToTopBtn />

      <h1 className="CareerCardH1">{h1Content}</h1>

      <article className="CareerCardArticle">
        {careerContent.map((item, index) => (
          <CareerFoldUnit
            key={index}
            title={item.title}
            isActive={activeIndex === index}
            activeIndex={activeIndex}
            onShow={() => setActiveIndex(index)}
            JDArray={item.JD}
          />
        ))}
      </article>
    </section>
  );
};
