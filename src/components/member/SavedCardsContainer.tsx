"use client";

import Image from "next/image";
import VisaCard from "@/images/icons/Icon_VISA@3x.png";
import Mastercard from "@/images/icons/Icon_Master@3x.png";
import AmericanExpress from "@/images/icons/Icon_AE@3x.png";
import Add from "@/images/icons/Icon_add@3x.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDeleteSavedCardMutation, useGetCreditCardsQuery } from "@/redux/api/memberApi";
import { usePathname } from "next/navigation";
import { CardDisclaimer } from "@/components/member/CardDisclaimer";
import { CreditCard } from "@/components/member/CreditCard";
import { MobileButtonContainer } from "@/components/layout/MobileButtonContainer";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import { ROUTES } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import "@/style/member/member.scss";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

export const SavedCardsContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const path = usePathname();
  const { translate: t } = useTranslation(lang);
  const { data: getCreditCardResponse, refetch, isSuccess, isLoading } = useGetCreditCardsQuery();
  const profileData = useSelector((state: RootState) => state.profile);
  const [deleteSavedCardRequest] = useDeleteSavedCardMutation();
  const [creditCards, setCreditCards] = useState(getCreditCardResponse?.data ?? []);
  const numberOfCards = creditCards && creditCards.length;
  const disabledAddButton = numberOfCards && numberOfCards >= 5;
  const dispatch = useDispatch();
  const [isPageReady, setIsPageReady] = useState(false);

  const handleDeleteCard = (cardId: string) => {
    if (creditCards) {
      deleteSavedCardRequest({ id: cardId }).then(() => {
        refetch();
      });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      dispatch(setLoadingScreenDisplay(false));
      setIsPageReady(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (getCreditCardResponse?.data) {
      setCreditCards(getCreditCardResponse.data);
    }
  }, [getCreditCardResponse]);

  const renderCardsList = (
    <>
      {isSuccess && (
        <div className="savedCardsHasCardsContainer">
          <ul>
            {creditCards &&
              creditCards.map(card => (
                <CreditCard
                  key={card.id}
                  profile={profileData}
                  card={card}
                  onDelete={handleDeleteCard}
                  path={path}
                  lang={lang}
                  checkoutForm={true}
                />
              ))}
            <div>
              <Link
                href={`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`}
                className={`savedCardsAddCardWebBtn ${
                  disabledAddButton ? "pointer-events-none bg-opacity-40" : "bg-primaryGold"
                }`}
              >
                <Image src={Add} width={20} height={20} alt="add credit card" />
                <span>{t("savedCards.addCard")}</span>
              </Link>
            </div>
            <CardDisclaimer lang={lang} />
          </ul>

          <MobileButtonContainer zIndex={999}>
            <Link href={`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`} className="savedCardsAddCardMobileBtn">
              <Image width={0} height={0} src={Add} alt={"Add Card"} />
              {t("savedCards.addCard")}
            </Link>
          </MobileButtonContainer>
        </div>
      )}
    </>
  );
  const renderNoCreditCard = (
    <>
      <div className="savedCardsNoCardsContainer">
        <div className="savedCardsNoCardsImageContainer">
          <Image
            src={VisaCard}
            width={68}
            height={22}
            alt="Visa card icon"
            className="h-auto self-center md:w-[100px]  xl:w-[125px]"
          />
          <Image
            src={Mastercard}
            width={58}
            height={36}
            alt="Mastercard icon"
            className="h-auto self-center md:w-[65px] xl:w-[87px]"
          />
          <Image
            src={AmericanExpress}
            width={36}
            height={36}
            alt="America Express icon"
            className="h-auto self-center md:w-[45px]  xl:w-[54px]"
          />
        </div>
        <div className="savedCardsNoCardsAddCardBtn">
          <Link
            href={`/${lang}/${ROUTES.MEMBER_ADD_CARDS}`}
            className={`${disabledAddButton ? "bg-opacity-40" : "bg-primaryGold"}`}
          >
            <Image src={Add} width={24} height={24} alt="add credit card" />
            <span>{t("savedCards.addCard")}</span>
          </Link>
        </div>
      </div>
      <div className="lg:hidden">
        <CardDisclaimer lang={lang} />
      </div>
    </>
  );

  if (!isPageReady) {
    return <></>;
  }

  return (
    <>
      {numberOfCards && numberOfCards >= 1 ? (
        <div className="savedCardsContainer">{renderCardsList}</div>
      ) : (
        <div>{renderNoCreditCard}</div>
      )}
    </>
  );
};
