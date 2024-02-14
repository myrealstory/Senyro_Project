"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store";
import { REACT_ENV } from "@/types/commonTyps";
import { WidgetConfig } from "@/config";
import { setTopBarErrorMessage } from "@/redux/slice/generalStateSlice";

export const TopErrorMessageBar = () => {
  const { topBarErrorMessage } = useSelector((state: RootState) => state.generalState);
  const [isBarDisplay, setIsBarDisplay] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (topBarErrorMessage?.length) {
      setIsBarDisplay(true);
    } else {
      setIsBarDisplay(false);
    }
  }, [topBarErrorMessage])

  if (!isBarDisplay || !WidgetConfig.topErrorMessageBar.env.includes(process.env.NEXT_PUBLIC_ENV as REACT_ENV)) {
    return <></>;
  }

  return (
    <div className="w-full z-[99999] fixed bg-lightGrey">
      <div className="bg-primaryGold w-[50px] cursor-pointer h-[20px] leading-normal"
      onClick={() => {
        dispatch(setTopBarErrorMessage([]));
      }}
      >CLOSE</div><br/>
      {topBarErrorMessage.map((message, index) => (
        <p key={index} className="leading-[30px]">{message}</p>
      ))}
    </div>
  );
}