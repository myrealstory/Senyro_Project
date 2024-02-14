"use client";

import Download from "@/images/icons/Icon_download@3x.png";
import Printer from "@/images/icons/Icon_printer@3x.png";
import html2canvas from "html2canvas";
import Image from "next/image";
import jsPDF from "jspdf";
import { Disclaimer } from "@/components/member/Disclaimer";
import { useGetSalesHistoryDetailsQuery } from "@/redux/api/memberApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRef } from "react";
import { InstoreReceiptInfoTable } from "@/components/member/InstoreReceiptInfoTable";
import { InstoreReceiptDescriptionTable } from "@/components/member/InstoreReceiptDescriptionTable";
import { InstoreReceiptSummaryTable } from "@/components/member/InstoreReceiptSummaryTable";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import "@/style/member/member.scss";

export default function InstoreReceiptPage({ params }: { params: { receipt_id: string; lang: LocaleKeysType } }) {
  const pdfRef = useRef<HTMLElement>(null);
  const transactionMode = useSelector((state: RootState) => state.generalState.transactionMode.mode);
  const { data: getSalesHistoryDetails } = useGetSalesHistoryDetailsQuery({
    id: params.receipt_id,
    mode: transactionMode,
  });
  const instoreReceiptDetails = getSalesHistoryDetails?.statusCode === 200 && getSalesHistoryDetails.data;
  const { translate: t } = useTranslation(params.lang);
  const handlePrint = () => {
    if (window !== undefined) window.print();
  };

  const handleDownloadPdf = () => {
    const input = pdfRef.current;
    if (!input) {
      return;
    }
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save("receipt.pdf");
    });
  };

  const InstoreReceiptDisclaimers = [
    t("transactionDisclaimer.remarks1"),
    t("transactionDisclaimer.remarks2"),
    t("transactionDisclaimer.remarks3"),
    t("transactionDisclaimer.remarks4"),
    t("transactionDisclaimer.remarks5"),
  ];

  return (
    <>
      {instoreReceiptDetails && (
        <div className="instoreReceiptSummaryFirstContainer">
          <div className="instoreReceiptSummarySecondContainer">
            <div className="instoreReceiptSummaryThirdContainer">
              <div className="instoreReceiptSummaryBtnsContainer">
                <button onClick={handleDownloadPdf} className="buttonDownloadAndPrint">
                  <Image src={Download} width={24} height={24} alt="click to download receipt" />
                </button>
                <button onClick={handlePrint} className="buttonDownloadAndPrint">
                  <Image src={Printer} width={24} height={24} alt="Click to print receipt" />
                </button>
              </div>
              <section ref={pdfRef}>
                <div className="instoreReceiptSummaryTitleContainer">
                  <h3 className="instoreReceiptSummaryTitleMobile">
                    {t("transactionInstoreDetails.transactionDetailsMobileTitle")}
                  </h3>
                  <h3 className="instoreReceiptSummaryTitleWeb">
                    {t("transactionInstoreDetails.transactionDetailsWebTitle")}
                  </h3>
                </div>

                <div className="instoreReceiptSummaryTableContainer ">
                  <InstoreReceiptSummaryTable
                    titles={[
                      t("transactionInstoreDetails.transactionNum"),
                      t("transactionInstoreDetails.store"),
                      t("transactionInstoreDetails.dateAndTime"),
                    ]}
                    receiptId={`#${instoreReceiptDetails.posTransactionNumber}`}
                    receiptItems={instoreReceiptDetails}
                  />
                </div>
                <div className="instoreReceiptInfosTableContainer">
                  {instoreReceiptDetails && (
                    <div key={params.receipt_id} className="instoreReceiptItemsContainer">
                      <InstoreReceiptInfoTable
                        title={t("transactionInstoreDetails.itemsBreakdown") as string}
                        itemTitles={[t("transactionInstoreDetails.qty"), t("transactionInstoreDetails.item")]}
                        itemList={instoreReceiptDetails.itemList}
                      />
                      <InstoreReceiptDescriptionTable
                        details={instoreReceiptDetails}
                        lang={params.lang}
                      />
                    </div>
                  )}
                </div>
                <Disclaimer title={t("transactionInstoreDetails.disclaimer")} remarks={InstoreReceiptDisclaimers} />
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
