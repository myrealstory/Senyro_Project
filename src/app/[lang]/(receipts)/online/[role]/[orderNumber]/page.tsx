"use client";

import Image from "next/image";
import Clock from "@/images/icons/Icon_clock@3x.png";
import MapPin from "@/images/icons/Icon_map_pin@3x.png";
import Download from "@/images/icons/Icon_download@3x.png";
import Printer from "@/images/icons/Icon_printer@3x.png";
import Check from "@/images/icons/Icon_tick_Gold@3x.png";
import { Disclaimer } from "@/components/member/Disclaimer";
import { ReceiptTable } from "@/components/member/ReceiptTable";
import { AmountTable } from "@/components/member/AmountTable";
import { PaymentDetailsTable } from "@/components/member/PaymentDetailsTable";
import { useGetOnlineGuestOrderReceiptQuery } from "@/redux/api/orderCheckoutApi";
import { LocaleKeysType } from "@/app/i18n";
import { useEffect, useRef, useState } from "react";
import { convertDateFormat } from "@/components/forms";
import { ReceiptInfoTable } from "@/components/member/ReceiptInfoTable";
import { useTranslation } from "@/app/i18n/client";
import "@/style/member/member.scss";
import { QRcode } from "@/components/member/QRcode";
import { ENDPOINTS } from "@/constants";

export default function OnlineReceiptPage({
  params,
}: {
  params: { role: "member" | "guest"; orderNumber: string; lang: LocaleKeysType };
}) {
  const [isMounted, setIsMounted] = useState(false);
  const role = params.role;
  const pdfRef = useRef<HTMLElement>(null);
  const orderNumber = params.orderNumber;

  const [qrSize] = useState(200);
  const { translate: t } = useTranslation(params.lang);
  const { data: getOnlineOrderResponse } = useGetOnlineGuestOrderReceiptQuery({
    orderNumber: orderNumber,
  });
  const onlineReceiptDetails = getOnlineOrderResponse && getOnlineOrderResponse.data;
  const orderSummary = getOnlineOrderResponse?.data.orderSummary;
  const paymentDetails = getOnlineOrderResponse?.data.paymentDetail;
  const discounts = getOnlineOrderResponse?.data.orderSummary.discounts;
  const orderTime = getOnlineOrderResponse && convertDateFormat(getOnlineOrderResponse?.data.orderTime);
  const addOnItems = getOnlineOrderResponse?.data.orderSummary.addonItems;

  const OnlineReceiptDisclaimers = [
    t("transactionPickTerms.remarks1"),
    t("transactionPickTerms.remarks2"),
    t("transactionPickTerms.remarks3"),
    t("transactionPickTerms.remarks4"),
    t("transactionPickTerms.remarks5"),
    t("transactionPickTerms.remarks6"),
    t("transactionPickTerms.remarks7"),
    t("transactionPickTerms.remarks8"),
  ];

  const handlePrint = () => {
    if (window !== undefined) window.print();
  };

  const handleDownloadPdf = () => {
    window.open(`${ENDPOINTS.GET_ORDER_RECEIPT_PDF}?lang=${params.lang}&embeddedOrderStr=${orderNumber}`);
  };

  const renderPaymentType = (str?: string) => {
    const lowerCaseStr = str?.toLowerCase();
    if (lowerCaseStr === "visa") return t("transactionOnlineDetails.visa");
    if (lowerCaseStr === "mastercard") return t("transactionOnlineDetails.mastercard");
    if (lowerCaseStr === "payme") return t("transactionOnlineDetails.payme");
    if (lowerCaseStr === "octopus app") return t("transactionOnlineDetails.Octopus");
    if (lowerCaseStr === "apple pay") return t("transactionOnlineDetails.apple");
    if (lowerCaseStr === "google pay") return t("transactionOnlineDetails.google");
  };

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  const renderPickUpInfo = (
    <>
      {onlineReceiptDetails && (
        <div className="receiptPickupContainer" key={onlineReceiptDetails.transactionNumber}>
          <div className="receiptPickupH3">
            <h3>{t("transactionOnlineDetails.onlineOrderReceipt")}</h3>
          </div>
          <div className="receiptPickupSecondContainer">
            <ReceiptInfoTable
              titles={[
                t("transactionOnlineDetails.transactionNum") as string,
                t("transactionOnlineDetails.orderTime") as string,
              ]}
              transactionNum={onlineReceiptDetails.transactionNumber}
              orderTime={orderTime}
            />
          </div>
          <div className={"receiptPickupInfoContainer"}>
            {" "}
            <h3 className="receiptPickupInfoShowToStaff">{t("transactionOnlineDetails.showThisToStaff")}</h3>
            <span className="receiptPickupInfoNo">#{onlineReceiptDetails.pickupNo}</span>

            <div className="xl:mb-[10px]">
              <QRcode qrCodeStr={onlineReceiptDetails.pickupQrCodeStr} qrSize={qrSize} />
            </div>
            {/* Pick up details */}
            <div className="receiptPickupDetailsContainer">
              <div className="receiptPickupDetails">
                <div className="flex h-fit items-center gap-2">
                  <div>
                    <Image
                      src={Clock}
                      width={0}
                      height={0}
                      alt="Pick time icon"
                      className="h-auto w-[25px] self-center lg:w-[27px]"
                    />
                  </div>
                  <div className="receiptPickupImageContainer w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="w-1/2"> {t("transactionOnlineDetails.pickupTime")}</h4>
                      <span className="w-1/2 text-end text-[14px] font-semibold">
                        {onlineReceiptDetails.pickupTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src={MapPin}
                      width={0}
                      height={0}
                      alt="Pick up store map pin icon"
                      className="h-auto w-[26px] self-center"
                    />
                  </div>
                  <div className="receiptPickupImageContainer w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="w-1/2">{t("transactionOnlineDetails.pickupStore")}</h4>
                      <span className="w-1/2 text-end font-semibold">{onlineReceiptDetails.pickupStoreName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="receiptPickupDetailsContactContainer">
                <div>
                  <h4> {t("transactionOnlineDetails.storeAddress")}</h4>
                  <span>{onlineReceiptDetails.pickupStoreAddress}</span>
                </div>
                <div>
                  <h4>{t("transactionOnlineDetails.contactNumber")}</h4>
                  <span>{onlineReceiptDetails.pickupStoreContactNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderOrderSummary = (
    <>
      <div className="receiptOrderSummaryContainer">
        <h3>{t("transactionOnlineDetails.orderSummary")}</h3>
        <ul className={`receiptOrderSummaryListContainer ${orderSummary?.modifiers?.length ? "py-7" : "pt-5"}`}>
          {orderSummary &&
            orderSummary.modifiers?.map((modifier, index) => (
              <li key={index}>
                <Image src={Check} width={15} height={10} alt="Sauce check" />
                <span>{modifier.name}</span>
              </li>
            ))}
        </ul>
        {/* Order items */}
        {orderSummary?.items && (
          <ReceiptTable
            titles={[
              t("transactionOnlineDetails.food"),
              t("transactionOnlineDetails.qty"),
              t("transactionOnlineDetails.subTotal"),
            ]}
            items={orderSummary?.items}
            lang={params.lang}
          />
        )}

        {/* Add On items */}

        {addOnItems && addOnItems.length > 0 ? (
          <ReceiptTable
            titles={[
              t("transactionOnlineDetails.addon"),
              t("transactionOnlineDetails.qty"),
              t("transactionOnlineDetails.subTotal"),
            ]}
            items={addOnItems}
            lang={params.lang}
          />
        ) : null}

        {/* Gift */}
        {orderSummary?.giftItems && orderSummary?.giftItems.length > 0 ? (
          <ReceiptTable
            titles={[
              t("transactionOnlineDetails.gift"),
              t("transactionOnlineDetails.qty"),
              t("transactionOnlineDetails.subTotal"),
            ]}
            items={orderSummary?.giftItems}
            lang={params.lang}
          />
        ) : null}
        <div className="receiptDivider"></div>
        {/* Amount */}

        <AmountTable
          lang={params.lang}
          titles={[
            t("transactionOnlineDetails.subTotalItem") +
              ` ( ${onlineReceiptDetails?.orderSummary.itemTotalQty} ${t("transactionOnlineDetails.items")})`,
            t("transactionOnlineDetails.discount"),
            t("transactionOnlineDetails.redeemedSR"),
            t("transactionOnlineDetails.totalAmountPayable"),
          ]}
          amount={onlineReceiptDetails?.orderSummary.itemTotalAmount}
          discount={discounts}
          SRPoint={onlineReceiptDetails?.orderSummary.memberPointRedeemedPrice}
          totalAmount={paymentDetails && paymentDetails?.totalAmount}
        />
        <h3 className="receiptPaymentDetails">{t("transactionOnlineDetails.paymentDetails")}</h3>

        <PaymentDetailsTable
          role={role}
          key={paymentDetails?.name}
          titles={[
            t("transactionOnlineDetails.paymentAmount"),
            t("transactionOnlineDetails.paymentMethod"),
            t("transactionOnlineDetails.paymentType"),
            t("transactionOnlineDetails.creditCard"),
            t("transactionOnlineDetails.name"),
            t("transactionOnlineDetails.email"),
            t("transactionOnlineDetails.mobile"),
            t("transactionOnlineDetails.srMemberName"),
            t("transactionOnlineDetails.membershipNo"),
          ]}
          totalAmountWithDiscount={paymentDetails?.totalAmount}
          paymentMethod={onlineReceiptDetails?.paymentDetail.paymentMethod}
          paymentType={renderPaymentType(onlineReceiptDetails?.paymentType)}
          cardNum={paymentDetails?.creditCardNumber}
          name={role === "member" ? paymentDetails?.memberName : paymentDetails?.name}
          email={paymentDetails?.email}
          phone={paymentDetails?.phoneNumber}
          SRName={paymentDetails?.memberName?.slice(0.2)}
          membershipNo={paymentDetails?.memberNumber}
        />
      </div>
    </>
  );

  if (!getOnlineOrderResponse) {
    return <></>;
  }

  return (
    <>
      <div className="receiptFirstContainer">
        <div className="receiptSecondContainer">
          <div className="receiptButtonsContainer">
            <button onClick={handleDownloadPdf}>
              <Image src={Download} width={24} height={24} alt="click to download receipt" />
            </button>
            <button onClick={handlePrint}>
              <Image src={Printer} width={24} height={24} alt="Click to print receipt" />
            </button>
          </div>
          <section id="print-section" ref={pdfRef} className="receiptPickupOrderSummaryContainer">
            {renderPickUpInfo}
            {renderOrderSummary}
            <div className="receiptDisclaimerContainer">
              <Disclaimer title={t("transactionPickTerms.title")} remarks={OnlineReceiptDisclaimers} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
