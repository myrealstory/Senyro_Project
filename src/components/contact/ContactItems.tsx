"use client";
import Email from "@/images/icons/Icon_contact-email@3x.png";
import Phone from "@/images/icons/Icon_contact-phone@3x.png";
import Location from "@/images/icons/Icon_contact-location@3x.png";
import Image from "next/image";
import "@/style/general-information/general-information.scss";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";

export const ContactItems = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  return (
    <ul className="ContactItemsUl">
      <h2>{translate("contactUs.greeting")}</h2>
      <li>
        <div className="pt-1">
          <Image src={Email} width={0} height={0} alt="Email" className="ContactItemsImages xl:-mt-1" />
        </div>
        <div className="ContactItemsEmailContainer">
          <h3>{translate("contactUs.email")}</h3>
          <div className="ContactItemsEmailDiv">
            <a href="mailto: cs@sen-ryo.com.hk">cs@sen-ryo.com.hk</a>
            <span>{translate("contactUs.emailContent")}</span>
          </div>
          <div className="ContactItemsEmailDiv">
            <a href="mailto: member@sen-ryo.com.hk"> member@sen-ryo.com.hk </a>
            <span> {translate("contactUs.memberEnquiry")} </span>
          </div>
        </div>
      </li>
      <li>
        <div>
          <Image src={Phone} width={0} height={0} alt="phoneIcon" className="ContactItemsImagePhone" />
        </div>
        <div className="ContactItemsHotLineContainer">
          <h3>{translate("contactUs.csHotline")} </h3>
          <div className="ContactItemsHotLineDiv">
            <h4>
              <a href="tel:852-2101-1789">(852) 2101 1789</a>
            </h4>
            <span>{translate("contactUs.csServiceTime")}</span>
          </div>
        </div>
      </li>
      <li>
        <div className="pt-1">
          <Image src={Location} width={0} height={0} alt="locationPinIcon" className="ContactItemsImageLocation" />
        </div>
        <div className="ContactItemsAdressDiv">
          <h3>{translate("contactUs.address")}</h3>
          {lang === "en" && (
            <span>
              18/F Maxim’s Centre,<span className="hidden lg:block"></span> No. 17 Cheung Shun Street,
              <span className="hidden lg:block"></span> Cheung Sha Wan, Kowloon, Hong Kong
            </span>
          )}
          {lang === "tc" && <span>香港九龍長沙灣長順街17號美心集團中心18樓</span>}
        </div>
      </li>
    </ul>
  );
};
