"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setGlobalAlertStatus } from "@/redux/slice/generalStateSlice";

export const AlertModal = () =>
  {
    const {
      isGlobalAlertDisplay,
      containerClasses,
      alertTitle,
      alertContent,
      leftButtonText,
      onLeftButtonClick,
      rightButtonText,
      onRightButtonClick,
      extraContent,
    } = useSelector((state: RootState) => state.generalState);
    const dispatch = useDispatch();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
   
    const closeAlert = () => {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: false,
          alertTitle: "",
          alertContent: "",
          leftButtonText: "",
          rightButtonText: "",
          onLeftButtonClick: () => null,
          onRightButtonClick: () => null,
        })
      );
    };

    useEffect(() => {
      setIsAlertOpen(!!isGlobalAlertDisplay);
    }, [isGlobalAlertDisplay]);

    if (!isAlertOpen) {
      return <></>;
    }

    return (
      <>
        <div className="absolute left-0 top-0 z-[999998] block h-full w-full bg-[#E8E4DE]/80 backdrop-blur-[1px]"></div>
        <div
          className={`fixed left-1/2 top-1/2 z-[999999] h-auto w-full -translate-x-1/2 -translate-y-1/2 ${
            containerClasses ? containerClasses : "h-auto max-h-[527px] min-w-[300px] max-w-[95%]  md:max-w-[600px]"
          } overflow-hidden rounded-2xl bg-transparent shadow-3xl xl:rounded-[32px]`}
        >
          <div
            className={"flex h-full w-full  flex-col items-center justify-center  bg-white px-5 py-10 font-semibold md:p-8 2xl:px-8 2xl:pb-12 2xl:pt-16"}
          >
            {alertTitle?.length && <h6 className="text-center text-22 text-primaryDark  md:text-24 md:leading-[33px]" dangerouslySetInnerHTML={{__html: alertTitle}} />}

            {alertContent && alertContent?.length > 0 && (
              <p
                className={"items-center mb-7 mt-10 text-17 leading-5 text-primaryDark md:mb-0 md:mt-5 md:leading-7"}
                dangerouslySetInnerHTML={{
                  __html: alertContent
                }}
              />
            )}
            {extraContent && extraContent?.length > 10 ? (
              <div dangerouslySetInnerHTML={{ __html: extraContent }} />
            ) : (
              <></>
            )}
            <div
              className={`${
                leftButtonText && rightButtonText ? "justify-center md:justify-between" : "justify-center"
              } mt-4 flex h-full w-full flex-col-reverse items-center px-4 md:mt-16 md:max-h-[50px] md:flex-row xl:max-h-[60px] xl:min-h-[60px]  xl:px-5`}
            >
              {leftButtonText && (
                <button
                  className="my-4 h-full max-h-[50px] min-h-[50px] w-full rounded-full border border-solid border-primaryPurple bg-transparent text-18 font-medium text-primaryPurple  md:my-0 md:max-h-full md:max-w-[250px]  md:leading-5  xl:max-h-[60px]  xl:min-h-[60px]  xl:leading-6"
                  onClick={() => {
                    onLeftButtonClick && onLeftButtonClick();
                    closeAlert();
                  }}
                >
                  {leftButtonText}
                </button>
              )}
              {rightButtonText && (
                <button
                  className="h-full max-h-[50px] min-h-[50px] w-full rounded-full border border-solid border-primaryPurple bg-primaryPurple text-18 font-medium text-white md:max-w-[250px] md:leading-5 xl:max-h-[60px] xl:min-h-[60px] xl:leading-6 "
                  onClick={() => {
                    onRightButtonClick && onRightButtonClick();
                    closeAlert();
                  }}
                >
                  {rightButtonText}
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
