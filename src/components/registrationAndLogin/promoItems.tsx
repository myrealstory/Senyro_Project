import Image from "next/image";
import Gift from "@/images/icons/Icon_gift-gold@3x.png";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import Link from "next/link";
import { ROUTES } from "@/constants";

export const PromoItems = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);
  return (
    <div className="mt-40 flex flex-col gap-[14px] lg:hidden">
      <Link href={`/${lang}/${ROUTES.MEMBERSHIP_PROGRAM}`} className="flex items-center gap-[6px]">
        <Image src={Gift} width={25} height={25} alt="sen-ryo member privileges & Rewards" />
        <span className="text-[15px] leading-5 text-primaryGold underline sm:text-[16px]">
          {t("registrationStep1.mobilePromoMsg1")}
        </span>
      </Link>
    </div>
  );
};
