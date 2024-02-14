"use client";

import Image, { StaticImageData } from "next/image";
import { LocaleKeysType } from "@/app/i18n";
import { Tags } from "./Tags";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { ROUTES } from "@/constants";

interface Props {
  lang: LocaleKeysType;
  id: string;
  imageUrl: StaticImageData | null;
  title: string;
  tags: string[];
  effectiveDate: string;
  expiryDate: string;
  couponStatus?: string;
  path?: string;
}

export const formatStatusCase = (status?: string) => {
  if (status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
  return "";
};
export const SingleCouponCard = ({
  id,
  imageUrl,
  title,
  tags,
  effectiveDate,
  couponStatus,
  expiryDate,
  lang,
  path,
}: Props) => {
  const { translate: t } = useTranslation(lang);
  const expiredPath = path?.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`);

  const renderStatus = (status?: string) => {
    if (status?.toLocaleLowerCase() === "expired") {
      return t("coupons.expired");
    }

    if (status?.toLocaleLowerCase() === "used") {
      return t("coupons.used");
    }
  };

  const formattedDate = (date: string) => {
    // change 11/12/2023 to 2023/12/11
    const splitDate = date.split("/");
    const year = splitDate[2];
    const month = splitDate[1];
    const day = splitDate[0];
    return `${year}/${month}/${day}`;
  };

  return (
    <>
      <figure key={id} className="couponSingleCardContainer">
        <div className="couponSingleCardImgContainer">
          {imageUrl !== null ? (
            <Image
              src={imageUrl}
              width={1061}
              height={0}
              alt="coupon"
              className={`${couponStatus === undefined ? "" : "brightness-75"}`}
            />
          ) : null}
          {expiredPath && <span className="font-bold shadow-lg">{renderStatus(couponStatus)}</span>}
        </div>
        <div className="singleCouponTagContainer">
          <h2>{title}</h2>
          <Tags tags={tags} lang={lang} />
          <h4>
            {t("coupons.validityPeriod")} {formattedDate(effectiveDate)} {t("coupons.to")} {formattedDate(expiryDate)}
          </h4>
        </div>
      </figure>
    </>
  );
};
