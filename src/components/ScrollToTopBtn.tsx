"use client";

import Image from "next/image";
import gotoTop from "@/images/icons/Icon_up@3x.png";
// import { scrolltoTop } from "@/utils/commonUtils";
import { useWindowSize } from "@/hook/useWindowSize";

export const ScrollToTopBtn = () => {
  const { scrollY } = useWindowSize();
  return (
    <>
      {scrollY > 150 && (
        <div>
          <button
            className="fixed bottom-[150px]  right-4 z-[999] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white60  md:bottom-[1vw] md:right-[1vw] md:h-[4vw] md:w-[4vw]"
            onClick={() => {
              typeof window !== undefined &&
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
            }}
          >
            <Image src={gotoTop} alt="gototop" width={0} height={0} className="h-2 w-4 md:h-[0.6vw] md:w-[1.3vw]" />
          </button>
        </div>
      )}
    </>
  );
};
