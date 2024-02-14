import React, { ReactElement, useEffect, useRef, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { usePathname } from "next/navigation";

import "@/style/customDatePicker.css";
import { useTranslation } from "@/app/i18n/client";
import { getLangFromString } from "@/utils/commonUtils";
import Icon_Calendar_Gold from "@/images/icons/Icon_Calendar_Gold.png";
// import Icon_datepicker_arrow_down from "@/images/icons/Icon_datepicker_arrow_down@3x.png";
import Icon_datepicker_arrow_left from "@/images/icons/Icon_datepicker_arrow_left@3x.png";
// import Icon_datepicker_arrow_left_dim from "@/images/icons/Icon_datepicker_arrow_left_dim@3x.png";
import Icon_datepicker_arrow_right from "@/images/icons/Icon_datepicker_arrow_right@3x.png";
import Icon_datepicker_arrow_right_dim from "@/images/icons/Icon_datepicker_arrow_right_dim@3x.png";
import { useComponentLostFocus } from "@/hook/useComponentLostFocus";

interface DatePickerProsp {
  containerClasses?: string;
  date?: string;
  onSelect?: (...params: any) => any;
  contactForm?: boolean;
  availableDates?: string[];
  disable?: boolean;
}

export default function CustomDatepicker({
  containerClasses,
  date,
  onSelect,
  contactForm,
  availableDates,
  disable,
}: DatePickerProsp) {
  const wrapperRef = useRef(null);
  const currentMonth = moment().month();
  const currentYear = moment().year();
  const [selectedDate, setSelectedDate] = useState(date ? date : "");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isOpenCalendarView, setIsOpenCalendarView] = useState(false);
  const [isOpenMonthLiView, setIsOpenMonthLiView] = useState(false);
  const path = usePathname();
  const lang = getLangFromString(path);
  const { translate } = useTranslation(lang);

  useComponentLostFocus(wrapperRef, () => {
    setIsOpenMonthLiView(false);
    setIsOpenCalendarView(false);
  });

  useEffect(() => {
    if (disable) {
      setIsOpenCalendarView(false);
      setIsOpenMonthLiView(false);
    }
  }, [disable]);

  useEffect(() => {
    if (date) {
      setSelectedDate(date);
    }
  }, [date]);

  useEffect(() => {
    const calendarView = document.getElementById("calendarView");
    const calendarViewButton = document.getElementById("calendarViewButton");
    if (isOpenCalendarView && calendarViewButton && calendarView && window) {
      // in pixel, like padding / margin
      const factor = 30;
      const screenHeight = window.innerHeight;
      const elementViewport = calendarView.getBoundingClientRect();
      const calendarViewButtonViewport = calendarViewButton.getBoundingClientRect();
      const isOutOfScreen = screenHeight - elementViewport.y - elementViewport.height - factor <= 0;
      if (isOutOfScreen) {
        calendarView.style.bottom = `${calendarViewButtonViewport.height}px`;
      } else {
        calendarView.style.removeProperty("bottom");
      }
    }
  }, [isOpenCalendarView]);

  const generateDateFirstRow = () => {
    const liArray = [];
    for (let index = 0; index < 7; index++) {
      liArray.push(
        <li className="flex flex-1 justify-center px-3 box-border flex-shrink-0" key={index}>
          <p className="py-[4px] text-13 font-normal leading-6 text-primaryDark">
            {translate(`moment.day${index}InSingleWord`)}
          </p>
        </li>
      );
    }
    return <ul className="flex h-full flex-1">{liArray}</ul>;
  };

  const generateDate = () => {
    const format = "YYYY-MM-DD";
    // const pickUpAvailableDayRange = 14;
    const unavailableLastMonthDaysOpacity = 20;
    const normalDaysOpacity = 100;
    const unavailableDaysOpacity = 50;
    const today = moment().year(selectedYear).month(selectedMonth);
    const firstWeekDayOfMonth = moment(today).startOf("month").day();
    const lastWeekDayOfMonth = moment(today).endOf("month").day();
    const lastDateOfLastMonth = moment(today).subtract(1, "month").endOf("month").date();
    const lastDateOfMonth = moment(today).endOf("month").date();
    const dates: {
      value: string;
      isToday?: boolean;
      opacity: number;
      enable: boolean;
    }[] = [];
    const newDates: {
      value: string;
      isToday?: boolean;
      opacity: number;
      enable: boolean;
    }[][] = [];

    // first: generate the view of selected month
    for (let index = 0 - firstWeekDayOfMonth; index <= lastDateOfMonth + (6 - lastWeekDayOfMonth - 1); index++) {
      let value = "";
      let opacity = unavailableLastMonthDaysOpacity;
      let enable = false;
      let isToday = false;
      if (index < 0) {
        value = moment()
          .year(selectedYear)
          .month(selectedMonth)
          .subtract(1, "month")
          .date(lastDateOfLastMonth + index + 1)
          .format(format);
      } else {
        value = moment().year(selectedYear).month(selectedMonth).date(1).add(index, "days").format(format);
        opacity = unavailableDaysOpacity;
      }

      const formattedValue = moment(value, format).format("DD-MM-YYYY");

      if (availableDates?.includes(formattedValue)) {
        enable = true;
        opacity = normalDaysOpacity;
      }

      if (value === moment(today).format(format)) {
        isToday = true;
      }

      dates.push({
        isToday,
        value,
        opacity,
        enable,
      });
    }

    // second: perpare the root view and push into an array for rending
    let dimensions = 0;
    let secondIndex = 0;

    dates.forEach((value, index) => {
      if (!newDates[dimensions]) {
        newDates[dimensions] = [];
      }

      newDates[dimensions][secondIndex] = value;
      secondIndex++;

      if (index !== 0 && (index + 1) % 7 === 0) {
        secondIndex = 0;
        dimensions++;
      }
    });

    return newDates;
  };

  const generateDateBody = () => {
    const datesArray = generateDate();
    const datesBodyRoot: React.ReactElement<any, string | React.JSXElementConstructor<any>>[] = [];
    let datesBodyRow: ReactElement[] = [];

    datesArray.forEach((dates, index) => {
      datesBodyRow = [];
      dates.forEach((date, secIndex) => {
        datesBodyRow.push(
          <li
            key={secIndex}
            className={`flex flex-1 justify-center px-3 box-border flex-shrink-0 ${date.opacity === 100 ?"cursor-pointer":"cursor-text"}`}
            onClick={() => {
              date.enable && setSelectedDate(date.value);
              date.enable && onSelect && onSelect(date.value);
              if (date.enable) setIsOpenCalendarView(false);
            }}
          >
            <div
              className={`${
                selectedDate === date.value
                  ? "bg-primaryGold "
                  : date.isToday
                  ? "bg-secondaryLightGold2 "
                  : "bg-transparent"
              } flex aspect-square h-full w-auto items-center  justify-center rounded-full `}
            >
              <p
                className={`${
                  selectedDate === date.value ? "text-white" : date.isToday ? "text-primaryGold" : "text-primaryDark"
                } text-13 font-normal leading-[2rem] sm:leading-6 md:leading-7 lg:leading-7 xl:leading-8 2xl:leading-10 opacity-${
                  date.opacity
                }`}
              >
                {moment(date.value).date()}
              </p>
            </div>
          </li>
        );
      });
      datesBodyRoot.push(
        <ul key={index} className="flex h-full flex-1">
          {datesBodyRow}
        </ul>
      );
    });

    return datesBodyRoot;
  };

  const renderTodayInFormat = () => {
    const weekday = translate(`moment.day${moment(selectedDate).day()}InShort`);
    return <p className="text-16 leading-6">{moment(selectedDate).format("YYYY-MM-DD") + ` (${weekday})`}</p>;
  };

  const generateMonthLiView = () => {
    const months = [];
    for (let index = 1; index <= 12; index++) {
      months.push(
        <li
          className={`px-[16px] py-[14px] text-[16px] font-normal leading-[18.77px] ${
            index !== 12 ? "border-b-[0.5px] border-lightGrey" : ""
          }`}
          onClick={() => {
            setSelectedMonth(index - 1);
            setIsOpenMonthLiView(false);
          }}
        >
          {index.toString().length === 1 ? `0${index}` : index}
        </li>
      );
    }
    return months;
  };

  const handleMonthChange = (increment: boolean) => {
    if (increment) {
      if (selectedMonth === 11) {
        // December
        setSelectedMonth(0); // January
        setSelectedYear(selectedYear + 1); // Increment year
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    } else {
      if (selectedMonth === 0) {
        // January
        setSelectedMonth(11); // December
        setSelectedYear(selectedYear - 1); // Decrement year
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`flex  flex-1 flex-col ${containerClasses} 
                    ${contactForm ? "z-[10] h-[50px]" : "z-[9999] h-full "}
                    ${disable ? "opacity-50" : ""}`}
    >
      <button
        id="calendarViewButton"
        className="flex-1"
        onClick={() => !disable && setIsOpenCalendarView(!isOpenCalendarView)}
      >
        <div
          className={`${
            disable ? "bg-primaryGold15" : ""
          } flex h-full flex-row items-center justify-between rounded-full border border-primaryGold pl-[27.53px] pr-[18.35px] leading-[18.06px]`}
        >
          {selectedDate ? (
            renderTodayInFormat()
          ) : (
            <p
              className={
                contactForm
                  ? "text-[16px] font-medium tracking-[-0.44px] text-primaryGold opacity-40 "
                  : "text-16 font-medium text-primaryGold opacity-60 md:text-18"
              }
            >
              {contactForm ? translate("campaign.chooseDatePlaceHolder") : translate("cart.pickupDatePlaceHolder")}
            </p>
          )}
          <Image src={Icon_Calendar_Gold} alt="" width={18.35} height={18.35} className="ml-auto" />
        </div>
      </button>
      {isOpenCalendarView ? (
        <div className="relative">
          <div
            id="calendarView"
            className="absolute z-[999] my-3 w-fit rounded-3xl
              bg-white
              px-[20px]
              pb-[20px]
              pt-[25px]
              drop-shadow-[0_17px_42px_rgba(40,40,40,0.2)]
            "
          >
            <div className="mb-[20px] flex flex-row items-center">
              <div className="relative">
                <div className="flex flex-row">
                  <p className="text-lg font-bold leading-6 text-neutral10o">
                    {translate(`moment.month${moment().month(selectedMonth).month()}`)} {selectedYear}
                  </p>
                </div>
                {isOpenMonthLiView ? (
                  <div
                    className="custom-scrollbar absolute z-[999]
                  h-[200px]
                  w-full
                  overflow-auto
                  rounded-b-3xl
                  bg-white
                  drop-shadow-[0_17px_42px_rgba(40,40,40,0.2)]"
                  >
                    <div className="flex flex-col">{generateMonthLiView()}</div>
                  </div>
                ) : null}
              </div>
              <div className="ml-auto flex flex-row items-center">
                <Image
                  src={Icon_datepicker_arrow_left}
                  alt="Icon_datepicker_arrow_left"
                  width={18.35}
                  height={18.35}
                  onClick={() => handleMonthChange(false)}
                />
                <Image
                  src={
                    selectedMonth < 11 || selectedYear < currentYear + 1
                      ? Icon_datepicker_arrow_right
                      : Icon_datepicker_arrow_right_dim
                  }
                  alt="arrow_right"
                  width={18.35}
                  height={18.35}
                  onClick={() => handleMonthChange(true)}
                />
              </div>
            </div>
            <div className="flex flex-col">
              {generateDateFirstRow()}
              {generateDateBody()}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
