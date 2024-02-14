"use client";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Logo from "@/images/icons/logo-senryo@3x.png";
import React from "react";

export const HeaderForErrPage = () => {
  const router = useRouter();

  const handleHome = () => {
    router.push("/en/index");
  };

  return (
    <>
      <div className={"left-0 top-0 z-[990] block w-full"}>
        <div className="w-full bg-primaryGrey">
          <div className="wrapper flex items-center justify-between pb-[10px] pt-3  md:pb-4 md:pt-[1.8vw]">
            <button
              className="hidden md:mr-[10.7vw] md:block md:h-[3.14vw] md:w-[4.1vw] lg:h-[4.19vw] lg:w-[5.4vw]"
              onClick={handleHome}
            >
              <Image
                src={Logo}
                alt={"logo"}
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            </button>
            <button className="block h-9 w-12 md:hidden" onClick={handleHome}>
              <Image
                src={Logo}
                alt={"logo"}
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
