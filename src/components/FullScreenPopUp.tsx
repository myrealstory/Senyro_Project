"use client";
import React, { PropsWithChildren } from "react";
import ClosedBTN from "@/../images/icons/Icons-Closed-White@3x.png";
import Image from "next/image";
import { useWindowSize } from "@/hook/useWindowSize";
export interface FullScreenPopUpProps {
  propHandleClosed: React.Dispatch<React.SetStateAction<boolean>>;
  closeBtn: boolean;
  Appear: boolean;
}

export const FullScreenPopUp = ({
  children,
  propHandleClosed,
  closeBtn = true,
  Appear,
}: PropsWithChildren<FullScreenPopUpProps>) => {
  const { width } = useWindowSize();

  const handleClosed = () => {
    if (propHandleClosed) {
      propHandleClosed(false);
    }
    // dispatch(setIsPopupOpen(true));
  };

  React.useEffect(() => {
    if (Appear === true) {
      document.body.style.overflow = "hidden"; // disable scrolling
    } else {
      document.body.style.overflow = "visible"; // enable scrolling
    }

    return () => {
      document.body.style.overflow = "visible"; // enable scrolling
      // console.log("isPopupOpen",isPopupOpen)
    };
  }, [Appear, width]);

  return (
    <>
      {Appear === true && (
        <div className=" fixed left-0 top-0 z-[99999] flex h-screen w-full items-center justify-center bg-[#E8E4DE]/80 backdrop-blur-[1px]">
          <div className=" flex flex-col items-center">
            {children}
            {closeBtn && (
              <button className=" flex items-center justify-center" onClick={handleClosed}>
                <Image src={ClosedBTN} alt="Closed Button" width={0} height={0} sizes="100vw" className="h-16 w-16" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
