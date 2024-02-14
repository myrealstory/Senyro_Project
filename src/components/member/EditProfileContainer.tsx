"use client";

import Link from "next/link";
import Image from "next/image";
import GoBack from "@/images/icons/Icon_chevron-left@3x.png";
import { EditProfileForm } from "@/components/forms/EditProfileForm";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { ROUTES } from "@/constants";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { InfoPopup } from "./InfoPopup";
import "@/style/member/member.scss";

export const EditProfileContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  const [isPageReady, setIsPageReady] = useState(false);
  const { isLoadingScreenDisplay } = useSelector((state: RootState) => state.generalState);
  const [isLeavingPopupOpen, setIsLeavingPopupOpen] = useState(false);

  const handleGoBack = () => {
    window.history.back();
  };

  useEffect(() => {
    if (!isLoadingScreenDisplay) {
      setIsPageReady(true);
    }
  }, [isLoadingScreenDisplay]);

  return (
    <div
      className={`${
        isPageReady
          ? "px-4 md:px-11 lg:mt-[23px] lg:max-w-[650px] lg:rounded-[32px] lg:bg-white lg:py-11 lg:shadow-lg"
          : ""
      }`}
    >
      <Link href={`/${lang}/${ROUTES.MEMBER}`} className="lg:hidden">
        <Image src={GoBack} width={0} height={0} alt="Click to go back to the last page" className="h-auto w-[32px]" />
      </Link>
      {isPageReady && (
        <div className="editProfileTitlesContainer">
          <h1>{translate("editProfile.editProfile")}</h1>
          <p>{translate("editProfile.description")}</p>
        </div>
      )}
      <EditProfileForm lang={lang} setIsLeavingPopupOpen={setIsLeavingPopupOpen} />

      {isLeavingPopupOpen &&
        createPortal(
          <InfoPopup
            title={""}
            content={translate("editProfile.leavePageMsg")}
            shown={isLeavingPopupOpen}
            btnText1={translate("popup.cancel") as string}
            btnText2={translate("popup.confirm") as string}
            close={() => setIsLeavingPopupOpen(false)}
            confirm={handleGoBack}
          />,
          document.body
        )}
    </div>
  );
};
