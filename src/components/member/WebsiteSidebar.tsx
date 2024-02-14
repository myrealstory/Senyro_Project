import Link from "next/link";
import { SideProps } from "./MobileSidebar";
import { ROUTES } from "@/constants";
import { usePathname } from "next/navigation";
// import { useState } from "react";

// import { useWindowSize } from "@/hook/useWindowSize";
import { Profile } from "./Profile";

export const WebsiteSidebar = ({ lang, items, numberOfCoupons, user }: SideProps) => {
  // const [showQRCodeCard, setShowQRCodeCard] = useState(false);

  // const { width } = useWindowSize();
  const path = usePathname();

  // const handleShowQRCodeCard = () => {
  //   setShowQRCodeCard(!showQRCodeCard);
  // };

  // const desktopQRCode =
  //   path.includes(`/${lang}/${ROUTES.MEMBER}`) ||
  //   path.includes(`/${lang}/${ROUTES.TRANSACTION_INSTORE}`) ||
  //   path.includes(`/${lang}/${ROUTES.TRANSACTION_ONLINE}`) ||
  //   path.includes(`/${lang}/${ROUTES.COUPON_VALID}`) ||
  //   path.includes(`/${lang}/${ROUTES.PAY_WITH_CARDS}`) ||
  //   path.includes(`/${lang}/${ROUTES.INBOX_PERSONAL}`) ||
  //   path.includes(`/${lang}/${ROUTES.INBOX_PROMOTION}`) ||
  //   (path.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`) && width >= 1024);

  return (
    <>
      <Profile user={user} lang={lang} />
      {items.map(item => (
        <li
          key={item.id}
          className={`${
            (`/${lang}/${ROUTES.MEMBER}` === path && item.id === "member") ||
            (`/${lang}/${ROUTES.MEMBER_UPGRADE}` === path && item.id === "upgrade") ||
            (`/${lang}/${ROUTES.MEMBER_COUPON}` === path && item.id === "coupons") ||
            (`/${lang}/${ROUTES.MEMBER_TRANSACTION}` === path && item.id === "transaction") ||
            (`/${lang}/${ROUTES.MEMBER_FAV}` === path && item.id === "favourite") ||
            (`/${lang}/${ROUTES.MEMBER_SAVED_CARDS}` === path && item.id === "savedCard") ||
            (path.includes(`/${lang}/${ROUTES.TRANSACTION_ONLINE}`) && item.id === "transaction") ||
            (path.includes(`/${lang}/${ROUTES.TRANSACTION_INSTORE}`) && item.id === "transaction") ||
            (path.includes(`/${lang}/${ROUTES.COUPON_VALID}`) && item.id === "coupons") ||
            (path.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`) && item.id === "coupons") ||
            (path.includes(`/${lang}/${ROUTES.PAY_WITH_CARDS}`) && item.id === "coupons") ||
            (path.includes(`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`) && item.id === "savedCard")
              ? "w-[18rem] md:bg-secondaryLightGold2"
              : ""
          } ${
            path.includes(`/${lang}/${ROUTES.MEMBER_EDIT_PROFILE}`) && item.id === "member" ? "font-semibold" : ""
          } px-4 py-4 md:rounded-[19px] lg:pl-[23px] xl:py-4 xl:pl-[15px] `}
        >
          <Link href={`/${lang}/${item.path}`} className="md:flex md:items-center md:gap-[1.1rem]">
            <div>
              {`/${lang}/${item.path}` === path ||
              (path === `/${lang}/${ROUTES.MEMBER_ADD_CARDS}` && item.id === "savedCard") ||
              (path.includes(`/${lang}/${ROUTES.COUPON_VALID}`) && item.id === "coupons") ||
              (path.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`) && item.id === "coupons") ||
              (path.includes(`/${lang}/${ROUTES.PAY_WITH_CARDS}`) && item.id === "coupons") ||
              (`/${lang}/member` === path && item.title === "Member Area")
                ? item.imageActivatedDesktop
                : item.imageDesktop}
            </div>
            <div className="flex items-center">
              <span
                className={`${
                  (`/${lang}/${ROUTES.MEMBER}` === path && item.id === "member") ||
                  (`/${lang}/${ROUTES.MEMBER_UPGRADE}` === path && item.id === "upgrade") ||
                  (`/${lang}/${ROUTES.MEMBER_COUPON}` === path && item.id === "coupons") ||
                  (`/${lang}/${ROUTES.MEMBER_TRANSACTION}` === path && item.id === "transaction") ||
                  (`/${lang}/${ROUTES.MEMBER_FAV}` === path && item.id === "favourite") ||
                  (`/${lang}/${ROUTES.MEMBER_SAVED_CARDS}` === path && item.id === "savedCard") ||
                  (path.includes(`/${lang}/${ROUTES.TRANSACTION_ONLINE}`) && item.id === "transaction") ||
                  (path.includes(`/${lang}/${ROUTES.TRANSACTION_INSTORE}`) && item.id === "transaction") ||
                  (path.includes(`/${lang}/${ROUTES.COUPON_VALID}`) && item.id === "coupons") ||
                  (path.includes(`/${lang}/${ROUTES.COUPON_EXPIRED}`) && item.id === "coupons") ||
                  (path.includes(`/${lang}/${ROUTES.PAY_WITH_CARDS}`) && item.id === "coupons") ||
                  (path === `/${lang}/${ROUTES.MEMBER_ADD_CARDS}` && item.id === "savedCard")
                    ? "font-extrabold text-primaryGold"
                    : "text-primaryDark"
                } text-xl  font-semibold`}
              >
                {item.title}
              </span>
              {item.id === "coupons" && numberOfCoupons > 0 && (
                <div className="ml-3 flex h-9 w-9  items-center justify-center rounded-full bg-primaryGold lg:h-7 lg:w-7">
                  <span className="text-[12px] text-secondaryLightGold2">{numberOfCoupons}</span>
                </div>
              )}
            </div>
          </Link>
        </li>
      ))}
    </>
  );
};
