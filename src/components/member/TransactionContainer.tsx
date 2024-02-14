"use client";

import Image from "next/image";
import Chevron from "@/images/icons/Icon_chevron-r-white@3x.png";
import Reset from "@/images/icons/Icon_reset-white@3x.png";
import Edit from "@/images/icons/Icon_edit-white@3x.png";
import { InstoreReceipts } from "./InstoreReceipts";
import { OnlineReceipts } from "./OnlineReceipts";
import { DatePickPopup, DateValueType } from "./DatePickPopup";
import { CustomTab } from "./CustomTab";
import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { setLoadingScreenDisplay, setTransactionMode } from "@/redux/slice/generalStateSlice";
import { LocaleKeysType } from "@/app/i18n";
import { useGetSalesHistoryLazyQuery } from "@/redux/api/memberApi";
import { useTranslation } from "@/app/i18n/client";
import moment from "moment";
import "@/style/member/member.scss";

export const TransactionContainer = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);
  const [mode, setMode] = useState(lang === "en" ? "Instore" : "堂食/到店外賣");
  const [showPopup, setPopup] = useState(false);
  const [edited, setEdited] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  const [dateValue, setDateValue] = useState<DateValueType>({
    yearFrom: "",
    monthFrom: "",
    yearTo: "",
    monthTo: "",
  });

  const [getSalesHistoryLazy, { data: salesHistoryResponse }] = useGetSalesHistoryLazyQuery();
  const dispatch = useDispatch();

  const instoreReceipts = salesHistoryResponse?.data?.inStore;
  const onlineReceipts = salesHistoryResponse?.data?.online?.orders;
  const awaitPickupReceipts = salesHistoryResponse?.data?.online?.awaitPickupOrders;
  const instoreReceiptsLength = salesHistoryResponse?.data?.inStoreTotal;
  const onlineReceiptsLength = salesHistoryResponse?.data?.onlineTotal;
  const awaitPickupLength = salesHistoryResponse?.data?.online?.awaitPickupOrders?.length;

  const defaultDateFrom = useMemo(() => moment().subtract(1, "year").startOf("month").format("YYYY-MM-DD"), []);
  const defaultDateTo = useMemo(() => moment().endOf("month").format("YYYY-MM-DD"), []);

  useEffect(() => {
    getSalesHistory(defaultDateFrom, defaultDateTo)
      .then(() => {
        dispatch(setLoadingScreenDisplay(false));
      })
      .finally(() => {
        setIsPageReady(true);
      });
  }, []);

  const getSalesHistory = (fromDate: string, toDate: string) => {
    return getSalesHistoryLazy({
      fromDate,
      toDate,
    });
  };

  const handleModeChange = (mode: string) => {
    setMode(mode);
    dispatch(setTransactionMode({ mode: mode.toLowerCase() }));
  };

  const handleDatePickerOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPopup(!showPopup);
  };

  const handleReset = () => {
    getSalesHistory(defaultDateFrom, defaultDateTo)
      .unwrap()
      .then(() => {
        setDateValue({
          yearFrom: "",
          monthFrom: "",
          yearTo: "",
          monthTo: "",
        });
        setEdited(false);
      });
  };

  const renderContent = () => {
    if (lang === "en" ? mode === "Instore" : mode === "堂食/到店外賣" && salesHistoryResponse?.statusCode === 200) {
      return <InstoreReceipts lang={lang} instoreReceipts={instoreReceipts} />;
    } else if (lang === "en" ? mode === "Online" : mode === "網上訂購" && salesHistoryResponse?.statusCode === 200) {
      return <OnlineReceipts lang={lang} onlineReceipts={onlineReceipts} awaitPickupOrders={awaitPickupReceipts} />;
    }
    return null;
  };

  const disabledDateFilter = useCallback(() => {
    if (awaitPickupLength === 0 && onlineReceiptsLength === 0 && instoreReceiptsLength === 0) {
      return true;
    }
    return false;
  }, []);

  const disabledColor = useCallback(() => {
    if (instoreReceiptsLength === 0 && onlineReceiptsLength === 0 && awaitPickupLength === 0) {
      return "bg-primaryGold/60";
    }

    return "bg-primaryGold";
  }, []);

  const renderFilteredDateView = () => {
    return (
      <span>
        {/* {t("transactions.selectRange")} */}
        {t("transactions.from")} {`${t(`months.${dateValue.monthFrom}`)} ${dateValue.yearFrom}`}
        {t("transactions.to")} {`${t(`months.${dateValue.monthTo}`)} ${dateValue.yearTo}`}
      </span>
    );
  };

  if (!isPageReady) {
    return <></>;
  }

  return (
    <div className="transactionContainer">
      <div className="transactionDatePickerContainer">
        {edited === false ? (
          <>
            <button
              type="button"
              onClick={() => setPopup(!showPopup)}
              className={`transactionSelectDateBtn ${disabledColor()}`}
              disabled={disabledDateFilter()}
            >
              <span>{t("transactions.selectDateRange")}</span>
              <Image
                src={Chevron}
                width={14}
                height={14}
                alt="Click to select date"
                className="h-auto w-[10px] self-center"
              />
            </button>
            <span className="block py-2 text-[10px] font-medium text-primaryGold">
              {t("transactions.last12months")}
            </span>
          </>
        ) : (
          <>
            <div className="transactionDatePickerBarContainer">
              <div className="flex items-center gap-3">
                {renderFilteredDateView()}
                <button onClick={handleDatePickerOpen} className="flex items-center gap-1 pr-2">
                  <Image src={Edit} width={17} height={17} alt="Edit" />
                </button>
              </div>
              <div className="transactionEditResetBtns">
                <button onClick={handleReset} className="flex items-center gap-1">
                  <Image src={Reset} width={17} height={17} alt="Reset" />
                </button>
              </div>
            </div>
            <span className="block py-2 text-[10px] font-medium text-primaryGold">
              {t("transactions.last12months")}
            </span>
          </>
        )}
        {showPopup &&
          createPortal(
            <DatePickPopup
              defaultDateValue={dateValue}
              onChange={(dateValue: DateValueType) => {
                const dateFrom = `${dateValue.yearFrom}-${dateValue.monthFrom}-01`;
                const lastDateOfMonth = moment(`${dateValue.yearFrom}-${dateValue.monthFrom}-01`, "YYYY-MM-DD")
                  .endOf("month")
                  .date();
                const dateTo = `${dateValue.yearTo}-${dateValue.monthTo}-${lastDateOfMonth}`;
                getSalesHistory(dateFrom, dateTo)
                  .unwrap()
                  .then(() => {
                    setPopup(false);
                    setDateValue({
                      yearFrom: dateValue.yearFrom,
                      monthFrom: dateValue.monthFrom,
                      yearTo: dateValue.yearTo,
                      monthTo: dateValue.monthTo,
                    });
                    setEdited(true);
                  });
              }}
              onClose={() => setPopup(false)}
              onReset={() => {
                handleReset();
                setPopup(false);
              }}
              isPopupShow={showPopup}
              lang={lang}
            />,
            document.body
          )}
      </div>
      <div>
        {salesHistoryResponse !== undefined && salesHistoryResponse.statusCode === 200 && (
          <CustomTab
            onChange={handleModeChange}
            mode={mode}
            tabs={[t("transactions.instore"), t("transactions.online")]}
            counts={[salesHistoryResponse?.data.inStoreTotal, salesHistoryResponse?.data.onlineTotal]}
          />
        )}
      </div>
      {renderContent()}
    </div>
  );
};
