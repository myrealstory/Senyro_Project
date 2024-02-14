import React, { ChangeEvent, useState } from "react";
import PaymentSelect from "./PaymentSelect";
import "../checkout/CustomInput.css";

export default function CardInfoForm() {
  const inputStyle = "w-full border border-[#616161] text-base md:text-lg text-black p-5";
  const [isChecked, setIsChecked] = useState(true);
  const [cardInfo, setCardInfo] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryMon: "",
    expiryYear: "",
    securityCode: "",
  });
  const isCheckHandler = () => {
    setIsChecked(!isChecked);
  };
  const cardInfoHandler = (event: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setCardInfo(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  interface Option {
    value: string;
    label: string;
  }

  const month: Option[] = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const year: Option[] = [
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
  ];

  return (
    <div>
      <div className="mb-8">
        <input type="text" className={inputStyle} name="cardHolder" onChange={cardInfoHandler} />
      </div>
      <div className="mb-8">
        <input type="number" className={inputStyle} name="cardNumber" onChange={cardInfoHandler} />
      </div>
      <div className="mb-8 flex items-center space-x-2 md:space-x-4">
        <span className="w-1/3 text-xl text-[#616161]">有效日期</span>
        <div className="w-1/3">
          <PaymentSelect options={month} value={cardInfo.expiryMon} name="expiryMon" onChange={cardInfoHandler} />
        </div>
        <div className="w-1/3">
          <PaymentSelect options={year} value={cardInfo.expiryYear} name="expiryYear" onChange={cardInfoHandler} />
        </div>
      </div>
      <div className="mb-8">
        <input
          type="number"
          placeholder="信用卡驗證碼(CVV)"
          value={cardInfo.securityCode}
          className={inputStyle}
          name="securityCode"
          onChange={cardInfoHandler}
        />
      </div>
      <div className="mb-8">
        <label className="flex items-center">
          <input type="checkbox" className="hidden" onChange={isCheckHandler} />
          <span
            className={`relative mr-4 inline-block h-[25px] w-[25px] rounded-[4px] border border-[#B1B1B1] bg-[#B1B1B1] after:absolute after:left-1/2 after:top-1/2 after:h-[1.75rem] after:w-[1.75rem] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-lg after:bg-no-repeat after:content-[''] md:h-8 md:w-8 md:rounded-lg after:md:h-[1.75rem] after:md:w-[1.75rem] ${
              isChecked ? "after:bg-[url('../../../images/icons/Icon_tick-white@3x.png')]" : "after:bg-transparent"
            }`}
          ></span>
          <span className="text-lg text-[#616161] md:text-xl">儲存付款資料</span>
        </label>
      </div>
    </div>
  );
}
