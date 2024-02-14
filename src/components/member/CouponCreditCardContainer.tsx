"use client";

import Add from "@/images/icons/Icon_add@3x.png";
import Link from "next/link";
import Image from "next/image";
import { CardDisclaimer } from "./CardDisclaimer";
import { LocaleKeysType } from "@/app/i18n";
import { SaveCardResponseType, ProfileResType } from "@/types/api/apiTypes";
import { CreditCard } from "./CreditCard";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";

export const CouponCreditCardContainer = ({
  lang,
  cards,
  profile,
}: {
  lang: LocaleKeysType;
  cards: SaveCardResponseType["data"];
  profile: ProfileResType["data"];
}) => {
  // const [creditCards] = useState(cards);
  const path = usePathname();
  const disabledAddButton = cards.length >= 5;
  const { translate: t } = useTranslation(lang);

  const renderNoCreditCard = (
    <>
      {cards === undefined && (
        <div>
          <h2>No Saved Cards</h2>
        </div>
      )}
    </>
  );

  return (
    <ul className="couponCreditCardContainer">
      {cards.length === 0 && renderNoCreditCard}
      {cards.map(card => (
        <CreditCard
          key={card.id}
          card={card}
          onDelete={() => console.log("")}
          lang={lang}
          path={path}
          profile={profile}
        />
      ))}

      <div className="couponAddCardBtn">
        <Link
          href={`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`}
          className={` ${disabledAddButton ? "pointer-events-none bg-opacity-40" : "bg-primaryGold"}`}
        >
          <Image src={Add} width={24} height={24} alt="add credit card" className="" />
          <span>{t("savedCards.addCard")}</span>
        </Link>
      </div>
      <CardDisclaimer lang={lang} />
    </ul>
  );
};
