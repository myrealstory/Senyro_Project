"use client";
import Image from "next/image";
import { ScrollToTopBtn } from "../ScrollToTopBtn";
// import { CareerPathCard } from "./CareerPathCard";
import { useWindowSize } from "@/hook/useWindowSize";
import IconCalendar from "@/images/icons/Calendar-withGoldBG.png";
import IconMoney from "@/images/icons/IconMoneyr-withGoldBG.png";
import IconStar from "@/images/icons/IconStar-withGoldBG.png";
// import { StaffBenefitConstanst } from "@/constants/about/recruitment";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import CareerPathDesktopEn from "@/images/tag/CareerPath/Desktop/Career Path@2x.png";
import CareerPathDesktopTc from "@/images/tag/CareerPath/Desktop/Career Path_TC@2x.png";
import CareerPathMobileEn from "@/images/tag/CareerPath/Mobile/Career Path@2x.png";
import CareerPathMobileTc from "@/images/tag/CareerPath/Mobile/Career Path_TC@2x.png";

interface StaffBenefitType {
  title: string;
  content: string[];
}

export const BenefitCard = ({ lang }: { lang: LocaleKeysType; id?: string }) => {
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();

  const StaffBenefitConstanst: StaffBenefitType[] = [
    {
      title: "dayOffAmountAndLeaves",
      content: [
        `${translate("benefitCard.dayOffAmountAndLeaves1")}`,
        `${translate("benefitCard.dayOffAmountAndLeaves2")}`,
        `${translate("benefitCard.dayOffAmountAndLeaves3")}`,
        `${translate("benefitCard.dayOffAmountAndLeaves4")}`,
      ],
    },
    {
      title: "Bonus",
      content: [
        `${translate("benefitCard.bonusContent1")}`,
        `${translate("benefitCard.bonusContent2")}`,
        `${translate("benefitCard.bonusContent3")}`,
        `${translate("benefitCard.bonusContent4")}`,
        `${translate("benefitCard.bonusContent5")}`,
        `${translate("benefitCard.bonusContent6")}`,
      ],
    },
    {
      title: "OtherBenefits",
      content: [
        `${translate("benefitCard.otherBenefits1")}`,
        `${translate("benefitCard.otherBenefits2")}`,
        `${translate("benefitCard.otherBenefits3")}`,
        `${translate("benefitCard.otherBenefits4")}`,
        `${translate("benefitCard.otherBenefits5")}`,
      ],
    },
  ];

  const getImageSrc = () => {
    if (lang === "en") {
      if (width > 768) {
        return CareerPathDesktopEn;
      } else {
        return CareerPathMobileEn;
      }
    } else {
      if (width > 768) {
        return CareerPathDesktopTc;
      } else {
        return CareerPathMobileTc;
      }
    }
  };

  return (
    <main className="recruitmentPageWrapper">
      <ScrollToTopBtn />

      <h1 className="BenefitCardTitle">{translate("about.careerPath")}</h1>

      {/* <CareerPathCard lang={lang} /> */}
      <section className="flex items-center justify-center">
        <Image
          alt="CareerPathCard"
          src={getImageSrc()}
          className="h-full w-full object-cover sm:w-[55%] md:w-[70%] lg:w-[70%]"
        />
      </section>

      <article className="flex flex-col">
        <h2 className="BenefitCardTitle">{translate("about.staffBenefitsTitle")}</h2>
        <div>
          {/* 第一區 */}
          <div className="BenefitCardSegmentContainer">
            <Image width={0} height={0} src={IconCalendar} className="BenefitCardImage" alt={"IconCalendar"} />
            <div className="BenefitCardSeperateLine"></div>
          </div>
          <div>
            <ul className="BenefitCardDetailUl">
              {StaffBenefitConstanst[0].content.map((item, index) => (
                <li key={index} className="">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* 第二區 */}
          <div className="BenefitCardSegmentContainer">
            <Image width={0} height={0} src={IconMoney} className="BenefitCardImage" alt={"IconMoney"} />
            <div className="BenefitCardSeperateLine"></div>
          </div>
          <div>
            <ul className="BenefitCardDetailUl">
              {StaffBenefitConstanst[1].content.map((item, index) => (
                <li key={index} className="">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* 第三區 */}
          <div className="BenefitCardSegmentContainer">
            <Image width={0} height={0} src={IconStar} className="BenefitCardImage" alt={"IconStar"} />
            <div className="BenefitCardSeperateLine"></div>
          </div>
          <div>
            <ul className="BenefitCardDetailUl">
              {StaffBenefitConstanst[2].content.map((item, index) => (
                <li key={index} className="">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
};
