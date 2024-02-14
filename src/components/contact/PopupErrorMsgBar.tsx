"use client";

import React from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PopupErrorMsgBar: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const popupStyles = isOpen ? "block" : "hidden";
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${popupStyles}   `}>
      <div
        className="flex h-[225px] max-h-[365px] w-[354px] max-w-[600px] flex-col justify-center rounded-3xl bg-white 
                px-[25px]  lg:h-[41.66vw] lg:w-[65%] "
      >
        <p className="my-8 text-center text-[20px] font-semibold leading-8 lg:my-[80px] lg:text-[32px] lg:leading-[42px]">
          Something went wrong.<span className="block"></span>Please try again later.
        </p>
        <button
          className=" mb-6 flex h-[48px] items-center justify-center rounded-full bg-primary text-[18px] 
                            font-medium tracking-[-0.56px] text-white lg:mb-[40px] lg:h-[80px] lg:text-[28px]"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};
