"use client";
import Link from "next/link";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { useWindowSize } from "@/hook/useWindowSize";
import Image from "next/image";
import { getRouteNameFromPathname } from "@/utils/commonUtils";
import { useState, useCallback } from "react";

// ----------------- mobile -----------------
import mobileUnselectedAboutSenryo from "@/images/tag/AboutUsImagetab/Mob&APP/EN/Unselected/about@2x.png";
import mobileUnselectedJobApplication from "@/images/tag/AboutUsImagetab/Mob&APP/EN/Unselected/job@2x.png";
import mobileUnselectedRecruitment from "@/images/tag/AboutUsImagetab/Mob&APP/EN/Unselected/recruitment@2x.png";

import mobileSelectedAboutSenryo from "@/images/tag/AboutUsImagetab/Mob&APP/EN/Selected/about@2x.png";
import mobileSelectedJobApplication from "@/images/tag/AboutUsImagetab/Mob&APP/EN/Selected/job@2x.png";
import mobileSelectedRecruitment from "@/images/tag/AboutUsImagetab/Mob&APP/EN/Selected/recruitment@2x.png";

import mobileUnselectedAboutSenryoTc from "@/images/tag/AboutUsImagetab/Mob&APP/TC/Unselected/about_TC@2x.png";
import mobileUnselectedJobApplicationTc from "@/images/tag/AboutUsImagetab/Mob&APP/TC/Unselected/job_TC@2x.png";
import mobileUnselectedRecruitmentTc from "@/images/tag/AboutUsImagetab/Mob&APP/TC/Unselected/recruitment_TC@2x.png";

import mobileSelectedAboutSenryoTc from "@/images/tag/AboutUsImagetab/Mob&APP/TC/Selected/about_TC@2x.png";
import mobileSelectedJobApplicationTc from "@/images/tag/AboutUsImagetab/Mob&APP/TC/Selected/job_TC@2x.png";
import mobileSelectedRecruitmentTc from "@/images/tag/AboutUsImagetab/Mob&APP/TC/Selected/recruitment_TC@2x.png";
// ----------------- desktop -----------------
import desktopUnselectedAboutSenryo from "@/images/tag/AboutUsImagetab/Desktop/EN/Unselected/about@2x.png";
import desktopUnselectedJobApplication from "@/images/tag/AboutUsImagetab/Desktop/EN/Unselected/job@2x.png";
import desktopUnselectedRecruitment from "@/images/tag/AboutUsImagetab/Desktop/EN/Unselected/recruitment@2x.png";

import desktopSelectedAboutSenryo from "@/images/tag/AboutUsImagetab/Desktop/EN/Selected/about@2x.png";
import desktopSelectedJobApplication from "@/images/tag/AboutUsImagetab/Desktop/EN/Selected/job@2x.png";
import desktopSelectedRecruitment from "@/images/tag/AboutUsImagetab/Desktop/EN/Selected/recruitment@2x.png";

import desktopUnselectedAboutSenryoTc from "@/images/tag/AboutUsImagetab/Desktop/TC/Unselected/about_TC@2x.png";
import desktopUnselectedJobApplicationTc from "@/images/tag/AboutUsImagetab/Desktop/TC/Unselected/job_TC@2x.png";
import desktopUnselectedRecruitmentTc from "@/images/tag/AboutUsImagetab/Desktop/TC/Unselected/recruitment_TC@2x.png";

import desktopSelectedAboutSenryoTc from "@/images/tag/AboutUsImagetab/Desktop/TC/Selected/about_TC@2x.png";
import desktopSelectedJobApplicationTc from "@/images/tag/AboutUsImagetab/Desktop/TC/Selected/job_TC@2x.png";
import desktopSelectedRecruitmentTc from "@/images/tag/AboutUsImagetab/Desktop/TC/Selected/recruitment_TC@2x.png";

type HoverStatusType = {
  [key: string]: boolean;
};

export const AboutSideBar = ({ lang, path }: { lang: LocaleKeysType; path: string }) => {
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();
  const slug = getRouteNameFromPathname(path);
  const [hoverStatus, setHoverStatus] = useState<HoverStatusType>({});

  const handleHover = (linkTitle: string, isHovering: boolean) => {
    setHoverStatus(prev => ({ ...prev, [linkTitle]: isHovering }));
  };

  const links = [
    {
      title: `${translate("about.aboutSenryo")}`,
      path: `/${lang}/about`,
      mobileUnselectedEn: mobileUnselectedAboutSenryo,
      desktopUnselectedEn: desktopUnselectedAboutSenryo,
      mobileSelectedEn: mobileSelectedAboutSenryo,
      desktopSelectedEn: desktopSelectedAboutSenryo,
      mobileUnselectedTc: mobileUnselectedAboutSenryoTc,
      desktopUnselectedTc: desktopUnselectedAboutSenryoTc,
      mobileSelectedTc: mobileSelectedAboutSenryoTc,
      desktopSelectedTc: desktopSelectedAboutSenryoTc,
    },
    {
      title: `${translate("about.recruitment")}`,
      path: `/${lang}/about/recruitment/career-opportunites`,
      mobileUnselectedEn: mobileUnselectedRecruitment,
      desktopUnselectedEn: desktopUnselectedRecruitment,
      mobileSelectedEn: mobileSelectedRecruitment,
      desktopSelectedEn: desktopSelectedRecruitment,
      mobileUnselectedTc: mobileUnselectedRecruitmentTc,
      desktopUnselectedTc: desktopUnselectedRecruitmentTc,
      mobileSelectedTc: mobileSelectedRecruitmentTc,
      desktopSelectedTc: desktopSelectedRecruitmentTc,
    },
    {
      title: `${translate("about.jobApplication")}`,
      path: `/${lang}/about/job-application`,
      mobileUnselectedEn: mobileUnselectedJobApplication,
      desktopUnselectedEn: desktopUnselectedJobApplication,
      mobileSelectedEn: mobileSelectedJobApplication,
      desktopSelectedEn: desktopSelectedJobApplication,
      mobileUnselectedTc: mobileUnselectedJobApplicationTc,
      desktopUnselectedTc: desktopUnselectedJobApplicationTc,
      mobileSelectedTc: mobileSelectedJobApplicationTc,
      desktopSelectedTc: desktopSelectedJobApplicationTc,
    },
  ];

  const getImageSrc = useCallback(
    (link: (typeof links)[0]) => {
      const isSelected = slug.thirdSlug === getRouteNameFromPathname(link.path).thirdSlug;
      const isMobile = width < 768;
      const isHovering = hoverStatus[link.title];

      if (isMobile) {
        if (isSelected) {
          return lang === "en" ? link.mobileSelectedEn : link.mobileSelectedTc;
        } else {
          return isHovering
            ? lang === "en"
              ? link.mobileSelectedEn
              : link.mobileSelectedTc
            : lang === "en"
            ? link.mobileUnselectedEn
            : link.mobileUnselectedTc;
        }
      } else {
        if (isSelected) {
          return lang === "en" ? link.desktopSelectedEn : link.desktopSelectedTc;
        } else {
          return isHovering
            ? lang === "en"
              ? link.desktopSelectedEn
              : link.desktopSelectedTc
            : lang === "en"
            ? link.desktopUnselectedEn
            : link.desktopUnselectedTc;
        }
      }
    },
    [lang, slug, links, width, hoverStatus]
  );

  return (
    <ul className="mx-auto flex w-full max-w-[360px] justify-center gap-4 px-4 sm:px-0 md:max-w-[500px] md:gap-7">
      {links.map(link => (
        <li
          key={link.title}
          className="flex h-[52px] w-[110px] items-center justify-center md:w-[155px]"
          onMouseEnter={() => handleHover(link.title, true)}
          onMouseLeave={() => handleHover(link.title, false)}
        >
          <Link href={link.path} className="h-full  2xl:tracking-[0px]">
            <Image
              src={getImageSrc(link)}
              alt="About tabs"
              className="h-full w-full rounded-[14px] object-cover"
              width={0}
              height={0}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

{
  /* {links.map(link => (
            <li
              key={link.title}
              className={`${path === link.path ? "bg-primaryGold text-white" : "bg-primaryGold2 text-primaryGold"}  `}
            >
              <Link
                href={link.path}
                className={` ${link.title === "About Sen-ryo" ? "w-[60px] lg:w-full" : ""} aboutPageAsideLinkBtns`}
              >
                {link.title}
              </Link>
            </li>
          ))} */
}

{
  /* {link.title} */
}
