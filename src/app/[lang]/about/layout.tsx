"use client";
import { LocaleKeysType } from "@/app/i18n";
import { usePathname } from "next/navigation";
import Banner from "@/images/WEB-IMAGE-aboutus.png";
import Image from "next/image";
import { AboutSideBar } from "@/components/about/AboutSidebar";
// import { Footer } from "@/components/Footer";
import "@/style/general-information/general-information.scss";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/app/i18n/client";

export default function AboutLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: LocaleKeysType };
}) {
  const path = usePathname();
  const router = useRouter();
  const [activated, setActivated] = useState<"Career Opportunity" | "Staff benefit & promotion">("Career Opportunity");
  const [isCareerOpportunityHovered, setIsCareerOpportunityHovered] = useState(false);
  const [isStaffBenefitHovered, setIsStaffBenefitHovered] = useState(false);

  const { translate } = useTranslation(lang);

  useEffect(() => {
    if (path.includes("career-opportunites")) {
      setActivated("Career Opportunity");
    }
    if (path.includes("carrer-path-and-staff-benefits")) {
      setActivated("Staff benefit & promotion");
    }
  }, [path]);

  const handleCareerOpportunity = () => {
    setActivated("Career Opportunity");
    router.push(`/${lang}/about/recruitment/career-opportunites`);
  };

  const handleStaffBenefit = () => {
    setActivated("Staff benefit & promotion");
    router.push(`/${lang}/about/recruitment/carrer-path-and-staff-benefits`);
  };

  return (
    <>
      <header>
        <Image
          src={Banner}
          width={0}
          height={0}
          alt="Sen-ryo hero banner"
          className="aboutPageHeroBanner"
          loading="lazy"
          placeholder="blur"
        />
      </header>
      <main className="aboutPageLayoutMainComponent ">
        <aside
          className={`flex w-full justify-center py-6 sm:py-8 ${
            path.includes("recruitment") ? "xl:pb-8 xl:pt-20" : "xl:py-20"
          }  `}
        >
          <AboutSideBar lang={lang} path={path} />
        </aside>

        {path.includes("recruitment") && (
          <div className="recruitmentPageSubTagsContainer">
            <div
              className="recruitmentPageSubTagContainer"
              onMouseEnter={() => setIsCareerOpportunityHovered(true)}
              onMouseLeave={() => setIsCareerOpportunityHovered(false)}
            >
              <button
                onClick={handleCareerOpportunity}
                className={`py-2 ${
                  activated === "Career Opportunity" || isCareerOpportunityHovered
                    ? "recruitmentPageSubTagOpportunitiesIsActivated"
                    : "text-primaryGold"
                }`}
              >
                {translate("about.career")}
              </button>
            </div>

            <div
              className="recruitmentPageSubTagContainer"
              onMouseEnter={() => setIsStaffBenefitHovered(true)}
              onMouseLeave={() => setIsStaffBenefitHovered(false)}
            >
              <button
                onClick={handleStaffBenefit}
                className={`px-[6px] md:px-3 xl:px-5 ${
                  activated === "Staff benefit & promotion" || isStaffBenefitHovered
                    ? "recruitmentPageSubTagBenefitsIsActivated"
                    : "text-primaryGold"
                }`}
              >
                {translate("about.staffBenefits")}
              </button>
            </div>
          </div>
        )}
        {children}
      </main>
    </>
  );
}
