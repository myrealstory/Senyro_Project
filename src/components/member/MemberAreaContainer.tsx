"use client";
import EDMPic from "@/images/samplePic/EDM_PlaceHolder@3x.png";
import { LocaleKeysType } from "@/app/i18n";
import { MemberAreaCard } from "@/components/member/MemberAreaCard";
import { PromotionImage } from "@/components/PromotionImage";
import { useDispatch, useSelector } from "react-redux";
import "@/style/member/member.scss";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

const MemberAreaContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const [isMounted, setIsMounted] = useState(false);
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    setTimeout(() => {
      dispatch(setLoadingScreenDisplay(false));
    }, 500);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="memberProfileContainer flex justify-end">
      <MemberAreaCard user={profile} lang={lang} />
      <PromotionImage
        divClass="block w-full lg:w-1/2  xl:mt-0 px-4 lg:px-0"
        width={544}
        height={544}
        alt="member area promo"
        placeholder="blur"
        loading="lazy"
        imgClass="h-auto w-full rounded-[18px] lg:h-[450px]"
        img={EDMPic}
      />
    </div>
  );
};

export default MemberAreaContainer;
