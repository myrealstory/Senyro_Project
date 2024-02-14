"use client";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import Tooltip from "@/images/icons/alert-circle-purple.png";
import { RootState } from "@/redux/store";
import { useTranslation } from "@/app/i18n/client";
import { ProgressConstans } from "@/constants/product/CartPicker";
import { AvailablePickupTimesApiParamsType, CartPickupStep1Type } from "@/types/componentTypes";
import { checkIfNumberStringHasValue } from "@/utils/commonUtils";
import { BranchListType, BranchesType } from "@/types/branchTypes";
import { useGetBranchListQuery, useGetRegionListQuery, useLazyGetBranchListQuery } from "@/redux/api/branchApi";
import {
  setPage,
  setSelectedDistrictId,
  setSelectedRegionId,
  setSelectedBranchCode,
  setDistrictList,
  setSelectedPickupDate,
  setSelectedPickupMethod,
  setBranchPickupInfo,
  setWillUpdateSelectedPickupDate,
  setShouldCacheStep1,
  setIsBackFrom,
} from "@/redux/slice/firstTimeOrderPopupSlice";

import { GPS } from "../GPS";
import Progress from "../Progress";
import CustomSelect from "../CustomSelect";
import CustomButton from "../CustomButton";
import CustomCheckbox from "./CustomCheckbox";
import debounce from "lodash.debounce";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { fetchRequestClientSide } from "@/utils/clientUtils";
import { ENDPOINTS } from "@/constants";
import { useWindowSize } from "@/hook/useWindowSize";

export const CartPickupStep1 = ({ lang }: CartPickupStep1Type) => {
  const { translate } = useTranslation(lang);
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const [lastOrderBranch, setLastOrderBranch] = useState<BranchListType | null | undefined>();
  const [pickBranchCode, setPickBranchCode] = useState("");
  const [isSelectedRegionHasChange, setIsSelectedRegionHasChange] = useState(false);
  const [GPSInfo, setGPSInfo] = useState<{
    isActive: boolean;
    latitude: number | undefined;
    longitude: number | undefined;
  }>({
    isActive: false,
    latitude: undefined,
    longitude: undefined,
  });
  const {
    isBackFrom,
    shouldCacheStep1,
    districtList,
    selectedBranchCode,
    selectedRegionId,
    selectedDistrictId,
    preSelectedData,
  } = useSelector((state: RootState) => state.firstTimeOrderPopup);
  const { cartType } = useSelector((state: RootState) => state.generalState.isCartPickupOpen);
  const { noPreSelectBranch, globalSelectedProductSkuCode } = useSelector((state: RootState) => state.generalState);
  const [isStep1Ready, setIsStep1Ready] = useState(shouldCacheStep1 ?? false);

  const { data: initBranchList } = useGetBranchListQuery(
    { lang, cache: true },
    { skip: !shouldCacheStep1 && cartType !== "EDIT" }
  );
  const { data: regionList } = useGetRegionListQuery({ lang });

  const [getBranchList, { data: latestBranchList }] = useLazyGetBranchListQuery();

  useEffect(() => {
    if (cartType === "EDIT") {
      getBranchList({
        lang,
        region: checkIfNumberStringHasValue(selectedRegionId) ? selectedRegionId : undefined,
        district: checkIfNumberStringHasValue(selectedDistrictId) ? selectedDistrictId : undefined,
      })
        .unwrap()
        .then(() => {
          dispatch(setIsBackFrom(true));
        });
    }
  }, [cartType]);

  const branchList = useMemo(() => {
    if (GPSInfo.isActive && latestBranchList?.statusCode === 200) {
      return latestBranchList.data.branches;
    }
    if (!isBackFrom && !isSelectedRegionHasChange && cartType === "EDIT" && initBranchList?.statusCode === 200) {
      return initBranchList.data.branches;
    }
    if (latestBranchList?.statusCode === 200) {
      return latestBranchList.data.branches;
    }
    if (initBranchList?.statusCode === 200) {
      return initBranchList.data.branches;
    }
    return [];
  }, [latestBranchList, initBranchList, isSelectedRegionHasChange, GPSInfo, isBackFrom]);

  const lastTimeOrderedBranch = useMemo(() => {
    if (latestBranchList?.statusCode === 200 && latestBranchList.data.lastOrderBranch) {
      return latestBranchList.data.lastOrderBranch;
    }
    if (initBranchList?.statusCode === 200 && initBranchList.data.lastOrderBranch) {
      return initBranchList.data.lastOrderBranch;
    }
    return null;
  }, [latestBranchList, initBranchList]);

  const newDistrictList = useMemo(() => {
    if (checkIfNumberStringHasValue(selectedRegionId)) {
      return districtList[selectedRegionId!] ?? [];
    }

    return [];
  }, [districtList, selectedRegionId]);

  const debounceGetBranchList = useCallback(
    debounce(() => {
      getBranchList({
        lang,
        region: checkIfNumberStringHasValue(selectedRegionId) ? selectedRegionId : undefined,
        district: checkIfNumberStringHasValue(selectedDistrictId) ? selectedDistrictId : undefined,
        lat: GPSInfo.latitude ?? undefined,
        long: GPSInfo.longitude ?? undefined,
      });
    }, 400),
    [selectedRegionId, selectedDistrictId, GPSInfo]
  );

  useEffect(() => {
    setTimeout(() => {
      setIsStep1Ready(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (branchList?.length && isSelectedRegionHasChange == true) {
      const districtList: any = {};
      branchList.map(branch => {
        if (!districtList[branch.region.id]) {
          districtList[branch.region.id] = [];
        }
        if (!districtList[branch.region.id].find((districtList: any) => districtList.id === branch.district.id)) {
          districtList[branch.region.id] = [
            ...districtList[branch.region.id],
            {
              id: branch.district.id,
              name: branch.district.name,
            },
          ];
        }
      });

      dispatch(setDistrictList(districtList));
      setIsSelectedRegionHasChange(false);
    }
  }, [branchList]);

  useEffect(() => {
    if (isStep1Ready) {
      debounceGetBranchList();
    }
  }, [selectedRegionId, selectedDistrictId, GPSInfo]);

  useEffect(() => {
    if (lastTimeOrderedBranch) {
      setLastOrderBranch(lastTimeOrderedBranch);
    }
  }, [lastTimeOrderedBranch]);

  useEffect(() => {
    if (selectedBranchCode) {
      branchList.forEach(branch => {
        if (branch.branchCode === selectedBranchCode && !branch.isAvailablePickup) {
          dispatch(setSelectedBranchCode(""));
        }
      });
    }
  }, [selectedBranchCode, branchList]);

  const storeListContent = ({ item, index, isCheck }: { item: BranchListType; index: number; isCheck?: boolean }) => {
    let bottomText: JSX.Element = <></>;
    const descriptionsText: JSX.Element[] = [];
    if (item.oosProducts?.length) {
      bottomText = (
        <div className="text-12 leading-5 text-primaryPurple md:text-10">
          {translate("branchSelectionPopup.oosText", {
            replace1: item.oosProducts.map(product => product.name).join(","),
          })}
        </div>
      );
    }

    if (item?.descriptions && item?.descriptions?.length) {
      item?.descriptions.map((description, index) => {
        descriptionsText.push(
          <p key={index} className="multiline-ellipsis text-12 leading-5 text-primaryPurple md:text-10">
            {description}
          </p>
        );
      });
    }

    return (
      <li key={index} className="mb-2 w-[98%]">
        <CustomCheckbox
          disable={!item.isAvailablePickup}
          label={item.name}
          description={
            <>
              <p className="md:multiline-ellipsis mb-1 text-13 font-medium leading-4 lg:text-14 lg:leading-5 ">
                {item.address}
              </p>
              <p className="text-12 leading-5 text-primaryDark md:text-10">{item.directionMessage}</p>
              <p className="flex items-start gap-1 text-12 leading-5 text-primaryPurple md:text-10">
                <Image
                  src={Tooltip}
                  width={0}
                  height={0}
                  alt="tool tip"
                  className="aspect-square h-[16px] w-[16px] object-contain"
                />
                {item.reminderMessage}
              </p>
              {descriptionsText}
            </>
          }
          onCheck={() => {
            setPickBranchCode(item.branchCode);
          }}
          isChecked={isCheck ? isCheck : pickBranchCode === item.branchCode}
          extraInfo={{
            topRightText: item.distanceKm ? `${String(item.distanceKm).slice(0, 4).padEnd(4, "0")} KM` : null,
            bottomText,
          }}
        />
      </li>
    );
  };

  const renderStoreList = () => {
    const targetList: JSX.Element[] = [];
    if (cartType === "NEW") {
      branchList.forEach((item, i) => {
        if (pickBranchCode !== "" ? pickBranchCode === item.branchCode : selectedBranchCode === item.branchCode) {
          targetList.unshift(
            storeListContent({
              item: item,
              index: i,
              isCheck:
                !noPreSelectBranch &&
                (pickBranchCode !== "" ? pickBranchCode === item.branchCode : selectedBranchCode === item.branchCode),
            })
          );
        } else {
          targetList.push(
            storeListContent({
              item: item,
              index: i,
              isCheck:
                !noPreSelectBranch &&
                (pickBranchCode !== "" ? pickBranchCode === item.branchCode : selectedBranchCode === item.branchCode),
            })
          );
        }
      });
    }

    if (cartType === "EDIT") {
      branchList.forEach((item, i) => {
        if (pickBranchCode !== "" ? pickBranchCode === item.branchCode : selectedBranchCode === item.branchCode) {
          targetList.unshift(
            storeListContent({
              item: item,
              index: i,
              isCheck:
                pickBranchCode !== "" ? pickBranchCode === item.branchCode : selectedBranchCode === item.branchCode,
            })
          );
        } else {
          targetList.push(
            storeListContent({
              item: item,
              index: i,
              isCheck:
                pickBranchCode !== "" ? pickBranchCode === item.branchCode : selectedBranchCode === item.branchCode,
            })
          );
        }
      });
    }
    return targetList;
  };

  //gotoNext button
  const gotoNext = () => {
    const targetBranchCode = pickBranchCode?.length ? pickBranchCode : selectedBranchCode;

    if (cartType === "EDIT") {
      dispatch(setSelectedPickupDate(undefined));
      dispatch(setSelectedPickupMethod(undefined));
    }

    if (cartType === "EDIT" && preSelectedData.selectedBranchCode === targetBranchCode) {
      dispatch(setWillUpdateSelectedPickupDate(true));
    }

    dispatch(setSelectedBranchCode(targetBranchCode));
    const params: AvailablePickupTimesApiParamsType = {};
    if (globalSelectedProductSkuCode?.length) {
      params.skuCode = globalSelectedProductSkuCode;
    }
    fetchRequestClientSide<BranchesType>({
      url: `${ENDPOINTS.GET_BRANCHES}/${targetBranchCode}/available-pickup-times`,
      language: lang,
      params: params,
      options: {
        method: "GET",
      },
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(setBranchPickupInfo(res.data));
        }
        dispatch(setPage(2));
        dispatch(setShouldCacheStep1(true));
        dispatch(setIsBackFrom(false));
      })
      .catch(error => {
        console.error(`[Error] - ${ENDPOINTS.GET_BRANCHES}`, error);
      });
  };

  const isCheckLastOrder = useMemo(() => {
    if (cartType === "EDIT" && pickBranchCode === "") {
      return lastOrderBranch?.branchCode === selectedBranchCode;
    }

    return false;
  }, [selectedBranchCode, pickBranchCode, lastOrderBranch]);

  return (
    <>
      <div className="flex h-[82%] flex-col">
        <Progress title={ProgressConstans} progress={1} lang={lang} containerStyle="md:my-2 my-3" />
        <div className="mb-2 flex w-full items-center justify-between">
          <h3 className="text-18 font-semibold leading-4 md:text-17">{translate("SingleProduct.selectStore")}</h3>

          {width < 768 && (
            <GPS
              lang={lang}
              onActivate={coords => {
                setGPSInfo({
                  isActive: true,
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                });
              }}
              onDeactivate={() => {
                setGPSInfo({
                  isActive: false,
                  latitude: undefined,
                  longitude: undefined,
                });
              }}
            />
          )}
        </div>
        <div className="mb-3 flex w-full flex-wrap items-center justify-between  sm:justify-normal">
          <div className="w-1/2 pr-1 md:w-auto">
            {regionList?.statusCode === 200 && (
              <CustomSelect
                label={translate("SingleProduct.1Area")}
                data={[{ label: translate("SingleProduct.dropDownArea") }].concat(
                  regionList.data.map(list => ({ label: list.name, value: list.id as number }))
                )}
                value={selectedRegionId}
                buttonClasses="w-full md:w-[190px]"
                onChange={value => {
                  setIsSelectedRegionHasChange(true);
                  dispatch(setSelectedRegionId(value));
                }}
                defaultOnChange={() => {
                  dispatch(setSelectedRegionId(undefined));
                  dispatch(setSelectedDistrictId(undefined));
                }}
              />
            )}
          </div>
          <div className="w-1/2 pl-1 md:w-auto">
            <CustomSelect
              label={translate("SingleProduct.1District")}
              data={[{ label: translate("SingleProduct.dropDownDistrict") }].concat(
                newDistrictList.map((list: any) => ({ label: list.name, value: list.id }))
              )}
              value={selectedDistrictId}
              buttonClasses="w-full md:w-[190px]"
              onChange={value => {
                dispatch(setSelectedDistrictId(value));
              }}
              defaultOnChange={() => {
                dispatch(setSelectedDistrictId(undefined));
              }}
              inactive={!checkIfNumberStringHasValue(selectedRegionId) || newDistrictList.length === 0}
            />
          </div>
          {width > 768 && (
            <GPS
              lang={lang}
              onActivate={coords => {
                setGPSInfo({
                  isActive: true,
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                });
              }}
              onDeactivate={() => {
                setGPSInfo({
                  isActive: false,
                  latitude: undefined,
                  longitude: undefined,
                });
              }}
            />
          )}
        </div>
        {cartType === "EDIT" && isAlreadyLogin && lastOrderBranch && (
          <>
            <p className="mb-2 text-18 font-semibold leading-5 text-primaryDark md:text-15 md:font-medium md:text-primaryGold">
              {translate("SingleProduct.lastOrdered")}
            </p>
            <ul className=" mb-2 md:pr-2">
              {lastOrderBranch && storeListContent({ item: lastOrderBranch, index: 0, isCheck: isCheckLastOrder })}
            </ul>
          </>
        )}
        {branchList?.length > 0 && (
          <p className="mb-2 text-18 font-semibold leading-5 text-primaryDark md:text-15 md:text-primaryGold ">
            {translate("SingleProduct.storeList")}
          </p>
        )}
        {/* <p className="mb-3 text-14 leading-4 text-primaryDark md:text-11 md:mb-4 md:text-primaryGold">
            {translate("SingleProduct.selectStoreContent")}
          </p> */}
        <ul className={"custom-scrollbar h-full  overflow-y-auto  md:pr-2 "}>{renderStoreList() as React.ReactNode}</ul>
      </div>
      <div className="stepBtnContainer">
        <CustomButton
          containerClass={"defaultStyle"}
          onClick={gotoNext}
          textClass="textStyle"
          title={translate("SingleProduct.next") as string}
          disabled={selectedBranchCode || pickBranchCode !== "" ? false : true}
        />
      </div>
    </>
  );
};
