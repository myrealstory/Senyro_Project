"use client";

import Image from "next/image";
import Mask from "@/components/Mask";
import Undo from "@/images/icons/Icon_reset-gold@3x.png";
import { useState, useMemo, useEffect, useRef } from "react";
import moment from "moment";
import { useTranslation } from "@/app/i18n/client";
import "@/style/popup/popup.scss";
import { LocaleKeysType } from "@/app/i18n";
import { RevampedSelect } from "../forms/RevampedSelect";

export type DateValueType = {
  yearFrom: string;
  monthFrom: string;
  yearTo: string;
  monthTo: string;
}

type DatePickPopupType = {
  onChange: (...params: any) => any;
  onClose: () => void;
  onReset: () => void;
  isPopupShow: boolean;
  lang: LocaleKeysType;
  defaultDateValue?: DateValueType;
}

export const DatePickPopup = ({ onChange, onClose, onReset, lang, isPopupShow, defaultDateValue }: DatePickPopupType) => {
  const { translate: t } = useTranslation(lang);

  const [dateValue, setDateValue] = useState<DateValueType>({
    yearFrom: "",
    monthFrom: "",
    yearTo: "",
    monthTo: "",
  });

  const previousDateValue = useRef<DateValueType>();

  useEffect(() => {
    if (defaultDateValue) {
      setDateValue(defaultDateValue);
    }
  }, [defaultDateValue])

  useEffect(() => {
    if (previousDateValue.current?.yearFrom !== dateValue.yearFrom) {
      setDateValue({
        ...dateValue,
        monthFrom: monthItemsFrom[0].code,
      })
    } else if (previousDateValue.current?.yearTo !== dateValue.yearTo) {
      setDateValue({
        ...dateValue,
        monthTo: monthItemsTo[0].code,
      })
    }
    previousDateValue.current = dateValue;
  }, [dateValue])

  const today = useMemo(() => moment(), []);
  const currentYear = useMemo(() => moment(today).year(), [today]);
  const currentMonth = useMemo(() => moment(today).month() + 1, [today]);

  const yearsItems = useMemo(() => {
    const yearItems = [{
      label: "YYYY",
      code: "",
    }];
    for (let index = 1; index >= 0; index--) {
      const targetYear = moment(today).subtract(index, "year").year().toString();
      yearItems.push({
        label: targetYear,
        code: targetYear,
      })
    }
    return yearItems;
  }, [currentYear])

  const getMonthItems = (target: "FROM" | "TO") => {
    const targetYearValue = target === "FROM" ? dateValue.yearFrom : dateValue.yearTo;
    const monthItems = [{
      label: "MMM",
      code: ""
    }];
    let indexFrom = 0;
    let indexTo = 0;
    if (String(moment(today).subtract(1, "year").year()) === targetYearValue) {
      indexFrom = currentMonth + 1;
      indexTo = 12;
    } else if (String(currentYear) === targetYearValue) {
      indexFrom = 1;
      indexTo = currentMonth;
    }
    for (let index = indexFrom; index <= indexTo; index++) {
      monthItems.push({
        label: t(`months.${String(index).padStart(2, "0")}`),
        code: String(index).padStart(2, "0"),
      })
    }
    return monthItems;
  }

  const monthItemsFrom = useMemo(() => {
    return getMonthItems("FROM");
  }, [currentMonth, dateValue, currentYear])

  const monthItemsTo = useMemo(() => {
    return getMonthItems("TO");
  }, [currentMonth, dateValue, currentYear])

  const isFormValid = useMemo(() => {
    let isValid = false;
    if (dateValue.monthFrom !== "" && dateValue.monthTo !== "" && dateValue.yearFrom !== "" && dateValue.yearTo !== "" && 
      moment(`${dateValue.yearTo}-${dateValue.monthTo}`, "YYYY-MM").isSameOrAfter(moment(`${dateValue.yearFrom}-${dateValue.monthFrom}`, "YYYY-MM"))
    ) {
      isValid = true;
    }

    return isValid;
  }, [dateValue])

  const isResetButtonAvailalbe = useMemo(() => {
    return dateValue.monthFrom?.length > 0 || dateValue.yearFrom?.length > 0 || dateValue.monthTo?.length > 0 || dateValue.yearTo?.length > 0;
  }, [dateValue])

  const onSubmit = () => {
    if (!isFormValid) {
      return;
    }

    onChange && onChange(dateValue);
  }

  return (
    <Mask>
      <div className="transactionDatePickerPopupContainer">
        <div className="transactionDatePickerResetContainer">
          <div>
            {isPopupShow ? <h3>{t("transactions.selectDateRange")}</h3> : <h3>{t("transactions.selectDate")}</h3>}
            {/* // reset */}
            <button onClick={() => {
              if (isResetButtonAvailalbe) {
                onReset();
              }
            }}>
              <Image src={Undo} width={0} height={0} alt="Undo" className={` ${!isResetButtonAvailalbe && "opacity-70"}`} />
              <span className={`${!isResetButtonAvailalbe ? "text-opacity-70" : "font-semibold text-opacity-100"}`}>
                {t("transactions.reset")}
              </span>
            </button>
          </div>
          <span>{t("transactions.last12months")}</span>
        </div>
        <form className="transactionDatePickerFormContainer">
          <label>
            <span>{t("transactions.from")}</span>
            <div>
              <RevampedSelect
                items={yearsItems}
                onChange={(value: string) => {
                  setDateValue({
                    ...dateValue,
                    yearFrom: value,
                  })
                }}
                value={dateValue.yearFrom}
              />
              <RevampedSelect
                items={monthItemsFrom}
                onChange={(value: string) => {
                  setDateValue({
                    ...dateValue,
                    monthFrom: value
                  })
                }}
                value={dateValue.monthFrom}
                disabled={dateValue.yearFrom === ""}
              />
            </div>
          </label>

          <label>
            <span>{t("transactions.to")}</span>
            <div>
              <RevampedSelect
                items={yearsItems}
                onChange={(value: string) => {
                  setDateValue({
                    ...dateValue,
                    yearTo: value,
                  })
                }}
                value={dateValue.yearTo}
              />
              <RevampedSelect
                items={monthItemsTo}
                onChange={(value: string) => {
                  setDateValue({
                    ...dateValue,
                    monthTo: value
                  })
                }}
                value={dateValue.monthTo}
                disabled={dateValue.yearTo === ""}
              />
            </div>
          </label>
          <div className="transactionDatePickerPopupBtns">
            <button onClick={onClose}>{t("transactions.cancel")}</button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!isFormValid}
              className={`${
                isFormValid
                  ? "bg-primaryGold text-white"
                  : "bg-primaryGold15 text-white"
              }`}
            >
              {t("transactions.ok")}
            </button>
          </div>
        </form>
      </div>
    </Mask>
  );
};
