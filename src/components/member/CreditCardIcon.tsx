import Image from "next/image";
import VisaCardYellow from "@/images/icons/Icon_Visa-yellow@3x.png";
import MastercardWithText from "@/images/icons/Icon_Master-font@3x.png";
import MastercardWithoutText from "@/images/icons/Icon_Master@3x.png";
import AmericanExpress from "@/images/icons/Icon_AE@3x.png";
import "@/style/member/member.scss";

export const CreditCardIcon = ({
  checkoutForm,
  cardType,
}: {
  checkoutForm?: boolean;
  cardType?: string;
  cardImage?: string;
}) => {
  return (
    <>
      {cardType === "Visa" && (
        <Image
          src={VisaCardYellow}
          width={0}
          height={0}
          alt="visa card"
          className={`savedVisaCardIcon ${checkoutForm ? "checkoutFormVisaStyle" : "nonCheckoutFormVisaStyle"}`}
        />
      )}
      {cardType === "Mastercard" && (
        <Image
          src={checkoutForm ? MastercardWithoutText : MastercardWithText}
          width={0}
          height={0}
          alt="master card"
          className={`savedMasterCardIcon ${checkoutForm ? "checkoutFormMasterStyle" : "nonCheckoutFormMasterStyle"}`}
        />
      )}
      {cardType === "AMEX" && (
        <Image src={AmericanExpress} width={0} height={0} alt="america express" className="savedCardAmexIcon" />
      )}
    </>
  );
};
