"use client";
import { LocaleKeysType } from "@/app/i18n";
import { StaticImageData } from "next/image";
import { Tags } from "./Tags";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import Link from "next/link";

interface Props {
  lang: LocaleKeysType;
  id: string;
  imageUrl: StaticImageData | null;
  title: string;
  tags: string[];
  effectiveDate: string;
  expiryDate: string;
  noLink?: boolean;
  validCoupons?: boolean;
  couponStatus?: string;
}

export const CouponCard = ({
  noLink,
  lang,
  id,
  imageUrl,
  title,
  tags,
  effectiveDate,
  expiryDate,
  validCoupons,
  couponStatus,
}: Props) => {
  const { translate: t } = useTranslation(lang);
  const validCouponRedirectLink = `/${lang}/${ROUTES.COUPON_VALID}/${id}`;
  const expiredCouponRedirectLink = `/${lang}/${ROUTES.COUPON_EXPIRED}/${id}`;

  const renderStatus = (status?: string) => {
    if (status?.toLocaleLowerCase() === "expired") {
      return t("coupons.expired");
    }

    if (status?.toLocaleLowerCase() === "used") {
      return t("coupons.used");
    }
  };

  // 28/12/2023 => 2023/12/28
  const formattedDate = (date: string) => {
    const splitDate = date.split("/");
    const reverseDate = splitDate.reverse();
    const resultDate = reverseDate.join("-");
    return resultDate;
  };

  return (
    <Link
      href={validCoupons ? validCouponRedirectLink : expiredCouponRedirectLink}
      key={id}
      className={`h-auto ${noLink ? "pointer-events-none" : "pointer-events-auto"} couponCard shadow`}
    >
      {
        <div className="couponImgContainer relative">
          {imageUrl !== null ? (
            <>
              <Image
                src={imageUrl}
                width={515}
                height={315}
                alt="coupon"
                className={`relative ${validCoupons ? "" : "brightness-75"} `}
              />
              {couponStatus !== undefined ? (
                <span className="font-bold shadow-lg">{renderStatus(couponStatus)}</span>
              ) : null}
            </>
          ) : null}
        </div>
      }

      <div className="couponContentContainer">
        <div className={`flex flex-col ${lang === "en" ? "gap-4" : "gap-5"}  py-2 `}>
          <h3>{title}</h3>
          <Tags tags={tags} lang={lang} />
        </div>
        <div>
          <h4 className="block">
            {t("coupons.validityPeriod")} {formattedDate(effectiveDate)} {t("coupons.to")} {formattedDate(expiryDate)}
          </h4>
        </div>
      </div>
    </Link>
  );
};
