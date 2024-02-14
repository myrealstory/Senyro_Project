"use client";
import moment from "moment";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";

import { RootState } from "@/redux/store";
import { ENDPOINTS } from "@/constants/endpoints";
import { useTranslation } from "@/app/i18n/client";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { ProgressConstans } from "@/constants/product/CartPicker";
import { PickUpMethodType } from "@/types/firstTimeOrderPopupTypes";
import { useCartPickupStep } from "@/hook/useCartPickupStep";
import { CartPickupStep2Type, AvailablePickupTimesApiParamsType } from "@/types/componentTypes";
import { fetchRequestClientSide } from "@/utils/clientUtils";
import { checkIfNumberStringHasValue } from "@/utils/commonUtils";
import { AvailablePickupDateType, BranchesType } from "@/types/branchTypes";
import {
  setPage,
  setBranchPickupInfo,
  setSelectedPickupDate,
  setSelectedPickupHour,
  setSelectedPickupMethod,
  setSelectedPickupMinute,
  setBranchAvailablePickupDate,
  setIsBackFrom,
} from "@/redux/slice/firstTimeOrderPopupSlice";

import Progress from "../Progress";
import CustomButton from "../CustomButton";
import CustomSelect from "../CustomSelect";
import CustomCheckbox from "./CustomCheckbox";
import CustomDatepicker from "../CustomDatepicker";
import { useLazyGetBranchListQuery } from "@/redux/api/branchApi";
import { useWindowSize } from "@/hook/useWindowSize";

export const CartPickupStep2 = ({ lang }: CartPickupStep2Type) => {
  const { translate } = useTranslation(lang);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const dispatch = useDispatch();

  const [getBranchList] = useLazyGetBranchListQuery();

  const { onStep2Submit } = useCartPickupStep({
    lang,
  });
  const {width} = useWindowSize();

  const [pickupMethod, setPickupMethod] = useState<PickUpMethodType>();
  const [isDateReady, setIsDateReady] = useState<boolean>(false);
  const [pickupDate, setPickupDate] = useState<string | undefined>();
  const [pickupHour, setPickupHour] = useState<string | undefined>();
  const [pickupMin, setPickupMin] = useState<string | undefined>();

  const {
    selectedRegionId,
    selectedDistrictId,
    branchPickupInfo,
    selectedBranchCode,
    branchAvailablePickupDate,
    willUpdateSelectedPickupDate,
    preSelectedData,
    selectedPickupMethod,
    selectedPickupDate,
    selectedPickupHour,
    selectedPickupMinute
  } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const { isCartPickupOpen, globalSelectedProductSkuCode, sourceForAddCart } = useSelector(
    (state: RootState) => state.generalState
  );

  const generateMinutsArray = (availablePickupTimes?: Record<string, string[]>, pickupHour?: string) => {
    const array = [];
    if (availablePickupTimes && pickupHour) {
      const minsData = availablePickupTimes[pickupHour];

      for (let index = 0; index < minsData?.length ?? 0; index++) {
        const value = minsData[index].toString();
        array.push({ title: value, value: value });
      }
    }

    return array;
  };

  const generateHoursArray = (availablePickupTimes?: Record<string, string[]>) => {
    const array = [];
    if (availablePickupTimes) {
      let hours = Object.keys(availablePickupTimes);
      if (hours.length > 0) {
        hours = hours.sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);

          return numA - numB;
        });
      }
      for (let index = 0; index < hours?.length ?? 0; index++) {
        const value = hours[index].toString();
        array.push({ title: value, value: value });
      }
    }
    return array;
  };

  const availableDate = useMemo(
    () => moment(branchPickupInfo.advancedPickup?.availablePickupDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
    [branchPickupInfo]
  );

  const hoursArray = useMemo(() => {
    if (branchPickupInfo) {
      return generateHoursArray(branchPickupInfo?.advancedPickup?.availablePickupTimes);
    }
    return [];
  }, [branchPickupInfo]);

  const minsArray = useMemo(() => {
    if (branchPickupInfo && pickupHour) {
      return generateMinutsArray(branchPickupInfo?.advancedPickup?.availablePickupTimes, pickupHour);
    }
    return [];
  }, [branchPickupInfo, pickupHour]);

  useEffect(() => {
    if (willUpdateSelectedPickupDate) {
      const pickupMothod = preSelectedData.selectedPickupMethod ?? selectedPickupMethod;
      setPickupMethod(pickupMothod);

      if (pickupMothod === "PICKUP") {
        const pickupDate = preSelectedData.selectedPickupDate ?? selectedPickupDate;
        const pickupHour = preSelectedData.selectedPickupHour ?? selectedPickupHour;
        const pickupMinute = preSelectedData.selectedPickupMinute ?? selectedPickupMinute;

        debounceGetAvailablePickupDates(
          pickupDate,
          pickupHour,
          pickupMinute,
        );
      }
    }
  }, [willUpdateSelectedPickupDate, preSelectedData, selectedPickupMethod, 
    selectedPickupDate, selectedPickupHour, selectedPickupMinute]);

  const debounceGetAvailablePickupTimes = useCallback(
    debounce((preSelectedData: { pickupDate: string; pickupHour?: string; pickupMins?: string }) => {
      setIsDateReady(false);
      setPickupDate(preSelectedData.pickupDate);
      const params: AvailablePickupTimesApiParamsType = {};
      if (preSelectedData.pickupDate) {
        params.date = preSelectedData.pickupDate + "T00:00:00.000Z";
      }
      if (globalSelectedProductSkuCode?.length) {
        params.skuCode = globalSelectedProductSkuCode;
      }
      fetchRequestClientSide<BranchesType>({
        url: `${ENDPOINTS.GET_BRANCHES}/${selectedBranchCode}/available-pickup-times`,
        language: lang,
        params: params,
        options: {
          method: "GET",
        },
      })
        .then(res => {
          if (res.status === 200) {
            dispatch(setBranchPickupInfo(res.data));
            const hoursArray = generateHoursArray(res.data.advancedPickup?.availablePickupTimes);
            let minsArray = generateMinutsArray(res.data.advancedPickup?.availablePickupTimes, hoursArray[0].value);
            let targetHours = hoursArray[0].value;
            let targetMins = minsArray[0].value;
            if (preSelectedData.pickupHour) {
              let foundTargetHour = false;
              if ((foundTargetHour = !!hoursArray.find(hour => hour.value === preSelectedData.pickupHour))) {
                targetHours = preSelectedData.pickupHour;
                minsArray = generateMinutsArray(res.data.advancedPickup?.availablePickupTimes, targetHours);
              }
              if (
                foundTargetHour &&
                preSelectedData.pickupMins &&
                minsArray.find(hour => hour.value === preSelectedData.pickupMins)
              ) {
                targetMins = preSelectedData.pickupMins;
              }
            }
            setPickupHour(targetHours);
            setPickupMin(targetMins);
          }
        })
        .catch(error => {
          console.error("[Error] - debounceGetAvailablePickupTimes", error);
        })
        .finally(() => {
          setIsDateReady(true);
        });
    }, 0),
    []
  );

  const debounceGetAvailablePickupDates = useCallback(
    debounce((pickupDate?: string, pickupHour?: string, pickupMins?: string) => {
      setIsDateReady(false);
      fetchRequestClientSide<AvailablePickupDateType>({
        url: `${ENDPOINTS.GET_BRANCHES}/${selectedBranchCode}/available-pickup-dates${
          globalSelectedProductSkuCode?.length ? `?skuCode=${globalSelectedProductSkuCode}` : ""
        }`,
        language: lang,
        options: {
          method: "GET",
        },
      })
        .then(res => {
          if (res.status === 200) {
            dispatch(setBranchAvailablePickupDate(res.data));
            const isSelectedDateValid = !!res.data.availableDates.find(date => {
              const formattedDate = moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
              return formattedDate === pickupDate;
            });

            if (isSelectedDateValid) {
              setPickupDate(pickupDate);
            }

            debounceGetAvailablePickupTimes({
              pickupDate: isSelectedDateValid
                ? pickupDate
                : moment(res.data.currentDatetime, "DD-MM-YYYY").format("YYYY-MM-DD"),
              pickupHour,
              pickupMins,
            });
          }
        })
        .catch(error => {
          console.error("[Error] - debounceGetAvailablePickupDates : ", error);
        })
        .finally(() => {
          setIsDateReady(true);
        });
    }, 300),
    []
  );

  const instantContent = (timeNow: number) => {
    return (
      <p className="multiline-ellipsis mb-1 text-13 font-medium leading-5 ">
        {translate("SingleProduct.asapMessage1")}
        <span className="mx-1 text-13 font-bold leading-[14px] text-primaryDark ">{timeNow}</span>
        {translate("SingleProduct.asapMessage2")}
      </p>
    );
  };

  const handleBackPage = () => {
    getBranchList({
      lang,
      region: checkIfNumberStringHasValue(selectedRegionId) ? selectedRegionId : undefined,
      district: checkIfNumberStringHasValue(selectedDistrictId) ? selectedDistrictId : undefined,
    })
      .unwrap()
      .finally(() => {
        dispatch(setIsBackFrom(true));
        dispatch(setPage(1));
      });
  };

  const handleNextPage = () => {
    dispatch(setSelectedPickupDate(pickupDate));
    dispatch(setSelectedPickupHour(pickupHour));
    dispatch(setSelectedPickupMethod(pickupMethod));
    dispatch(setSelectedPickupMinute(pickupMin));
    if (pickupMethod !== undefined) {
      if (isCartPickupOpen.cartType === "NEW" && isAlreadyLogin === false) {
        dispatch(setPage(3));
      } else {
        onStep2Submit({ pickupMethod, pickupDate, pickupHour, pickupMin, translate, source: sourceForAddCart });
      }
    }
  };

  return (
    <>
      <Progress title={ProgressConstans} progress={2} lang={lang} containerStyle="my-4" />
      <h3 className="mb-4 text-16 font-semibold leading-6 md:mb-2 md:text-15">
        {translate("SingleProduct.selectTime")}
      </h3>
      <h6 className="mb-6 text-16 font-normal leading-6 md:text-15">{translate("SingleProduct.selectStoreContent")}</h6>
      <ul className="custom-scrollbar mb-[auto] h-[auto] pr-2  md:h-[700px]">
        <li className="mb-3">
          <CustomCheckbox
            label={translate("SingleProduct.2Title01")}
            description={instantContent(branchPickupInfo?.instantPickup?.instantPrepTime ?? 0)}
            onCheck={() => {
              setPickupMethod("EFFECTIVE");
            }}
            isChecked={pickupMethod === "EFFECTIVE"}
            disable={!branchPickupInfo?.instantPickup?.available}
          />
        </li>
        <li className="mb-3">
          <CustomCheckbox
            label={translate("SingleProduct.2Title02")}
            description={
              <p className="multiline-ellipsis mb-1 text-[13px] font-medium leading-[17px] ">
                {translate("SingleProduct.pickDateTime")}
              </p>
            }
            onCheck={() => {
              setPickupMethod("PICKUP");
              setIsDateReady(false);
              setPickupDate(pickupDate ?? availableDate);
              setPickupHour(pickupHour ?? hoursArray[0].value);
              setPickupMin(
                pickupMin ??
                  generateMinutsArray(
                    branchPickupInfo?.advancedPickup?.availablePickupTimes,
                    pickupHour ?? hoursArray[0].value
                  )[0].value
              );
              debounceGetAvailablePickupDates();
            }}
            isChecked={pickupMethod === "PICKUP"}
            disable={!branchPickupInfo?.advancedPickup?.available}
          >
            <div className="relative mt-6 h-[130px] md:my-4 md:h-[55px]">
              <div className="absolute left-0 top-0 z-10 h-auto w-full pr-4 md:flex md:gap-4 md:pr-0">
                <div className="flex h-[50px] w-full flex-col gap-4 md:h-[55px] md:w-[240px] md:flex-row">
                  <CustomDatepicker
                    containerClasses="w-full flex-[4] h-full"
                    date={pickupDate ?? availableDate}
                    onSelect={value => {
                      setPickupHour(undefined);
                      setPickupMin(undefined);
                      setPickupDate(value);
                      debounceGetAvailablePickupTimes({
                        pickupDate: value,
                      });
                    }}
                    availableDates={branchAvailablePickupDate?.availableDates}
                    disable={!isDateReady}
                  />
                </div>
                <div className="mt-4 flex w-full justify-between sm:w-auto sm:justify-normal md:mt-0">
                  <CustomSelect
                    label="HH"
                    data={hoursArray.map(hour => {
                      return {
                        label: hour.title,
                        value: hour.value,
                      };
                    })}
                    value={pickupHour}
                    buttonClasses={"w-full h-full md:w-[100px]"}
                    containerClasses={"flex flex-col md:mr-5 mr-2"}
                    onChange={value => {
                      setPickupHour(value);
                      setPickupMin(undefined);
                    }}
                    inactive={!isDateReady || !pickupDate}
                  />
                  <CustomSelect
                    label="MM"
                    data={minsArray.map(minute => {
                      return {
                        label: minute.title,
                        value: minute.value,
                      };
                    })}
                    value={pickupMin}
                    buttonClasses={"mr-0 ml-1 sm:ml-0 w-full h-full md:w-[100px]"}
                    containerClasses={"flex flex-col "}
                    onChange={value => {
                      setPickupMin(value);
                    }}
                    inactive={!isDateReady || !pickupHour}
                  />
                </div>
              </div>
            </div>
          </CustomCheckbox>
        </li>
      </ul>
      <div className="stepBtnContainer">
          <CustomButton
            containerClass={
              "defaultStyle left"
            }
            onClick={handleBackPage}
            textClass={"textStyle"}
            title={translate("SingleProduct.previous") as string}
            secondary
            noBorder={width < 1024}
          />
          <CustomButton
            containerClass={"defaultStyle right"}
            onClick={handleNextPage}
            textClass="textStyle"
            title={
              translate(
                `SingleProduct.${isCartPickupOpen.cartType === "NEW" && isAlreadyLogin === false ? "next" : "confirm"}`
              ) as string
            }
            disabled={
              pickupMethod === undefined ||
              (pickupMethod === "PICKUP" && 
              (!isDateReady || pickupDate === undefined || pickupHour === undefined || pickupMin === undefined))
            }
          />
      </div>
    </>
  );
};
