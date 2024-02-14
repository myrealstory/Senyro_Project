"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { setLoadingScreenDisplay, setTopBarErrorMessage } from "@/redux/slice/generalStateSlice";

export const ErrorDispatcher = ({data}: {data: {
  api: string;
  error: string;
}[]}) => {

  const dispatch = useDispatch();

  const prepareErrorMessage = () => {
    const error: string[] = [];
    data?.length && data.forEach((value) => {
      if (value.error) {
        error.push(`Api: ${value.api} Error: ${value.error}`);
      }
    })
    if (error?.length) {
      dispatch(setLoadingScreenDisplay(false));
      dispatch(setTopBarErrorMessage(error));
    }
  }

  useEffect(() => {
    prepareErrorMessage();
  }, [data])

  return <></>;
}
