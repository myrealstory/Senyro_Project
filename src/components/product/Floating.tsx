"use client";
import React from "react";
import Image from "next/image";
// import EDMplaceHolder from "@/images/samplePic/EDM_PlaceHolder.png";
import IconCloseButton from "@/images/icons/Icon_x-circle@3x.png";
import { FloatingType } from "@/types/componentTypes";
import "@/style/component/component.scss";
import { useGetFloatingBannerQuery } from "@/redux/api/generalApi";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/hook/useWindowSize";

export default function Floating({ close }: FloatingType) {
  const { data: floatingBannerData, isSuccess } = useGetFloatingBannerQuery();
  const router = useRouter();
  const { width } = useWindowSize();

  return (
    <>
      {isSuccess && floatingBannerData.data && (
        <div className={`floatingContainer ${width < 1024 ? "mobile darkBG" : "desktop"}`}>
          <button onClick={close} type="button" className="closeBtn">
            <Image src={IconCloseButton} alt="IconCloseButton" width={0} height={0} sizes="100vw" />
          </button>
          <button
            onClick={() => router.push(floatingBannerData.data.redirectUrl as string)}
            type="button"
            className="floatingImage"
          >
            <div>
              <Image
                width={0}
                height={0}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${floatingBannerData.data.banner}`}
                alt={
                  floatingBannerData.data.imageAlt === null
                    ? `${floatingBannerData.data.banner}`
                    : `${floatingBannerData.data.imageAlt}`
                }
                sizes="100vw"
              />
            </div>
          </button>
        </div>
      )}
    </>
  );
}
