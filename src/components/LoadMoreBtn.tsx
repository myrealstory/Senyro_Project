"use client";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";

export const LoadMoreBtn = ({
  onLoadMore,
  loadMore,
  lang,
}: {
  onLoadMore: () => void;
  loadMore: boolean;
  lang: LocaleKeysType;
}) => {
  const { translate: t } = useTranslation(lang);

  return (
    <>
      {loadMore === true ? null : (
        <button
          onClick={onLoadMore}
          className="h-[55px] w-full max-w-[170px] rounded-full border-[1px] border-primaryGold text-[20px] font-[600] text-primaryGold hover:bg-primaryGold hover:text-white lg:max-w-[30%]"
        >
          {t("coupons.loadMore")}
        </button>
      )}
    </>
  );
};
