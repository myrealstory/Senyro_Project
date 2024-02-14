"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FullScreenPopUp } from "./FullScreenPopUp";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { CookiesKey } from "@/constants/cookies";
import { FloatingPopupBannerType } from "@/types/api/apiTypes";
import moment from "moment";

const ExclusivePages = ["checkout", "order-complete", "member/add-cards"];

export const PopUpBanner = ({ data, isOpen }: { data: FloatingPopupBannerType; isOpen: boolean }) => {
  const popupBannerData = data;
  const router = useRouter();
  const path = usePathname();
  const pageName = path.split("/").slice(2).join("/");
  const isExclusivePages = useMemo(() => ExclusivePages.findIndex(p => pageName.startsWith(p)) >= 0, [pageName]);
  const [isPopupOpen, setIsPopupOpen] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen === true) {
      setTimeout(() => {
        setIsPopupOpen(true);
      }, 150);
    }
  }, [isOpen, popupBannerData]);

  if (isExclusivePages) {
    return null;
  }

  return (
    <>
      {popupBannerData !== undefined && (
        <FullScreenPopUp
          closeBtn={true}
          propHandleClosed={() => {
            setCookie(CookiesKey.screenPopBanner, "false", { expires: moment().add(10, "year").toDate() });
            setIsPopupOpen(false);
          }}
          Appear={isPopupOpen}
        >
          <div
            className={"mb-6 h-[330px] w-[330px] overflow-hidden rounded-3xl  md:h-[38.5vw] md:w-[38.8vw]"}
            role={"button"}
            onClick={() => router.push(popupBannerData?.redirectUrl as string)}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${popupBannerData.banner}`}
              alt={popupBannerData.imageAlt === null ? `${popupBannerData.banner}` : `${popupBannerData.imageAlt}`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-full w-full object-cover"
            />
          </div>
        </FullScreenPopUp>
      )}
    </>
  );
};
