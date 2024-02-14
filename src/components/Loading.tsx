"use client";

import Image from "next/image";
import LoadingGif from "@/images/loadingGif/sen-ryo_loadinganimation_20231214_400.gif";

export const Loading = () => {
  return (
    <div className="fixed left-0 top-0 z-[99999] h-full w-full bg-primaryGold/70 bg-opacity-50 backdrop-blur-md">
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-4">
        <div>
          <Image
            src={LoadingGif}
            width={0}
            height={0}
            alt="Loading"
            className="h-auto w-[90px] self-center lg:w-[120px]"
          />
        </div>
      </div>
    </div>
  );
};
