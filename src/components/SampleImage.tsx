import React from "react";
import Image from "next/image";
import SampleIcon from "@/../images/icons/Icon_SampleImage@3x.png";

type SampleImageType = {
  titleLeft?: boolean;
};

function SampleImage({ titleLeft }: SampleImageType) {
  return (
    <div
      className={`flex h-[327px] w-[327px] items-center justify-center ${
        titleLeft ? "md:h-96 md:w-96" : "md:h-[31.6rem] md:w-[31.6rem]"
      } `}
    >
      <Image src={SampleIcon} alt={"Sample"} width={0} height={0} className="opacity-30" sizes="100vw" />
    </div>
  );
}

export default SampleImage;
