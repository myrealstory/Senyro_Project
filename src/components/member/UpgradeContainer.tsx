"use client";
import { RenewalCard } from "@/components/member/RenewalCard";
import { UpgradeCard } from "@/components/member/UpgradeCard";
import { useGetRenewQuery } from "@/redux/api/memberApi";
import { useState, useEffect } from "react";
import { PromotionImage } from "../PromotionImage";
import PromotionTC from "@/images/membership/Membership_banner_TC@2x.png";
import PromotionEN from "@/images/membership/membership-program.png";
import { LocaleKeysType } from "@/app/i18n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ROUTES } from "@/constants";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

const UpgradeContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { data: getRenewResponse } = useGetRenewQuery();
  const profile = useSelector((state: RootState) => state.profile);
  const [, setMemberTire] = useState(profile?.memberTierCode ?? 0);
  const [hasRenewData, setHasRenewData] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setMemberTire(profile?.memberTierCode as number);
  }, [profile]);

  useEffect(() => {
    if (getRenewResponse?.data?.renewMemberTier) {
      setHasRenewData(true);
    }
    dispatch(setLoadingScreenDisplay(false));
  }, [getRenewResponse]);

  if (getRenewResponse?.statusCode !== 200) {
    return <></>;
  }

  return (
    <div className="upgradeContainer">
      {getRenewResponse?.data?.renewMemberTier && (
        <RenewalCard renewalData={getRenewResponse?.data?.renewMemberTier} lang={lang} />
      )}

      {getRenewResponse?.data?.upgradeMemberTier && (
        <UpgradeCard
          upgradeData={getRenewResponse?.data?.upgradeMemberTier}
          lang={lang}
          secondContainerClass={`${hasRenewData ? "lg:mt-[-1px]" : "lg:mt-[-1px]"}`}
        />
      )}
      <PromotionImage
        img={lang === "en" ? PromotionEN : PromotionTC}
        divClass={"my-[30px] lg:mx-0 lg:mb-[80px] xl:mt-[18px] xl:mb-0 "}
        imgClass={"block h-auto w-full rounded-[30px] object-cover"}
        alt={"Promotion"}
        width={830}
        height={318}
        url={`/${lang}/${ROUTES.MEMBERSHIP_PROGRAM}`}
      />
    </div>
  );
};

export default UpgradeContainer;
