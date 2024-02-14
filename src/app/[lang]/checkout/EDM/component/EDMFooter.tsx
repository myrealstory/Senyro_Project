"use client";
import { ComponentType } from "@/app/[lang]/page";
import { useTranslation } from "@/app/i18n/client";
import React from "react";

import AppleDownload from "@/../../images/icons/Icon_AppleDownload@3x.png";
import AndroidDownload from "@/../../images/icons/Icon_AndroidDownload@3x.png";
import AndroidDownloadHover from "@/../../images/icons/Icon_AndroidDownload@3x.png";
import { HoverImage } from "@/components/HoverImage";
import Link from "next/link";

function EDMFooter({ lang }: ComponentType) {
  const { translate } = useTranslation(lang);
  const gotoPage = "https://order.sen-ryo.com.hk/";
  return (
    <div className=" bg-primaryGold px-20 py-12 text-white">
      <p className=" mb-6 text-28 font-semibold leading-8">{translate("EDM.download")}</p>
      <div className=" mb-10 flex items-center">
        <HoverImage
          defaultSrc={AppleDownload}
          hoverSrc={AppleDownload}
          alt="apple"
          width={0}
          height={0}
          classname="mr-5 w-[177px] aspect-[3.1/1] h-auto"
          hasDetailSlug={true}
          disableAspectSquare
        />
        <HoverImage
          defaultSrc={AndroidDownload}
          hoverSrc={AndroidDownloadHover}
          alt="android"
          width={0}
          height={0}
          classname="w-[203px] aspect-[3.1/1] h-auto"
          hasDetailSlug={true}
          disableAspectSquare
        />
      </div>
      <p className=" mb-4 text-20 font-medium">{translate("EDM.HK")}</p>
      <div className="mb-4 font-light [&_p]:text-14 [&_p]:leading-6">
        <p className="tracking-[-0.8px]">{translate("EDM.HKaddress01")}</p>
        <p>
          <span>{translate("EDM.general")}</span>
          <a className="underline" href="#">
            {translate("EDM.generalEmail")}
          </a>
        </p>
        <p>
          <span>{translate("EDM.HKmemberEnquiry")}</span>
          <a className="underline" href="#">
            {translate("EDM.memberEmail")}
          </a>
        </p>
      </div>
      <div className="mb-10 box-border flex text-18 font-medium leading-5 text-white">
        <button>{translate("EDM.termsBtn")}</button>
        <span className="mx-4 border-l-[0.5px] border-solid border-white"></span>
        <button>{translate("EDM.privacy")}</button>
      </div>
      <Link href={"https://order.sen-ryo.com.hk"} className=" text-14 font-light leading-6 text-white underline">
        {gotoPage}
      </Link>
      <p className="text-16 font-normal leading-7">{translate("EDM.reminded")}</p>
    </div>
  );
}

export default EDMFooter;
