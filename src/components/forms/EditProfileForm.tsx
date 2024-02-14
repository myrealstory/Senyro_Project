/* eslint-disable quotes */
"use client";

import moment from "moment";
import MaleIcon from "@/images/icons/Icon_male.png";
import FemaleIcon from "@/images/icons/Icon_female.png";
import SelectedMale from "@/images/icons/Icon_Male-white@3x.png";
import SelectedFemale from "@/images/icons/Icon_Female-white@3x.png";
import { useState, FormEvent, useEffect, useMemo, MouseEvent } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { usePathname } from "next/navigation";
import { LocaleKeysType } from "@/app/i18n";
import { email, firstName, lastName, mobile } from "@/constants/registration/input";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import { EmailCheckbox, SMSCheckbox } from "@/constants/registration/checkbox";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { useGetRegionListQuery } from "@/redux/api/branchApi";
import { useGetProfileQuery, useEditProfileMutation } from "@/redux/api/memberApi";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Headings } from "../member/Headings";
import { handleAlertMessageForGeneralPage } from "@/utils/clientUtils";
import { ROUTES } from "@/constants";
import { RevampedSelect } from "./RevampedSelect";

import { RevampedChip } from "./RevampedChip";
import "@/style/auth/auth.scss";
import { setLoadingScreenDisplay } from "@/redux/slice/generalStateSlice";

export type FormValueType = {
  firstName?: string;
  lastName?: string;
  countryCode?: string;
  mobile?: string;
  email?: string;
  title?: string;
  month?: number;
  year?: number;
  livingCountry?: string;
  region?: string;
  district?: string;
  gender?: string;
  hasChild?: boolean;
  preferLang?: string;
  smsOptIn: boolean;
  emailOptIn: boolean;
};

export type ExtraFormValueType = {
  emailForVerify?: string;
};

export type FormErrorType = {
  [key in keyof FormValueType]?: string;
};

export const EditProfileForm = ({
  lang,
  setIsLeavingPopupOpen,
}: {
  lang: LocaleKeysType;
  setIsLeavingPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();
  const profileData = useSelector((state: RootState) => state.profile);
  const { isSuccess, refetch } = useGetProfileQuery();
  const [editProfile] = useEditProfileMutation();
  const router = useRouter();
  const path = usePathname();
  const { width } = useWindowSize();
  const { data: regionList } = useGetRegionListQuery({ lang });

  const [formValue, setFormValue] = useState<FormValueType>({
    firstName: undefined,
    lastName: undefined,
    countryCode: undefined,
    mobile: undefined,
    email: undefined,
    title: undefined,
    month: undefined,
    year: undefined,
    livingCountry: undefined,
    region: undefined,
    district: undefined,
    gender: undefined,
    hasChild: undefined,
    preferLang: undefined,
    smsOptIn: false,
    emailOptIn: false,
  });
  const [formError, setFormError] = useState<FormErrorType>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoadingScreenDisplay(false));
    }, 500);
  }, []);

  const handleLeavingPopUp = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLeavingPopupOpen(true);
  };

  // [Alert message - Batch 2] comment for now - can't detect the "leaving the page" action
  // const handleLeavingPopUp = (e?: MouseEvent<HTMLButtonElement>) => {
  //   e && e.preventDefault();
  //   if (isEditing) {
  //     handleAlertMessageForGeneralPage({
  //       alertCode: "g58",
  //       alertType: "popup",
  //       translate: t,
  //       dispatch,
  //       extraInfo: {
  //         leftButtonCallback: async () => {
  //           router.push(`/${lang}/${ROUTES.MEMBER}`);
  //         },
  //         rightButtonCallback: async () => {
  //           await handleSave(undefined, true);
  //           router.push(`/${lang}/${ROUTES.MEMBER}`);
  //         }
  //       },
  //     })
  //   } else {
  //     router.push(`/${lang}/${ROUTES.MEMBER}`);
  //   }
  // };

  const isFormValid = useMemo(() => {
    if (!formError) {
      return true;
    }
    return Object.values(formError).filter(error => error && error.length).length === 0;
  }, [formError]);

  const checkIsFormValid = () => {
    const newErrorObject: FormErrorType = {};

    Object.entries(formValue).forEach(([key, value]) => {
      const formErrorKey = key as keyof FormErrorType;
      if (typeof value !== "boolean" && !value) {
        newErrorObject[formErrorKey] = translate("alertModal.required")!;
      }
    });

    if (formValue.title === "Mr." && formValue.gender === "female") {
      newErrorObject.gender = " ";
    } else if (
      formValue.gender === "male" &&
      (formValue.title === "Mrs." || formValue.title === "Miss" || formValue.title === "Ms.")
    ) {
      newErrorObject.gender = " ";
    }

    if (formValue.livingCountry === "hk" && formValue.region) {
      newErrorObject.region = undefined;
    }

    if (formValue.livingCountry === "hk" && formValue.district) {
      newErrorObject.district = undefined;
    }

    if (formValue.livingCountry !== "hk") {
      newErrorObject.district = undefined;
      newErrorObject.region = undefined;
    }

    // has child is optional
    newErrorObject.hasChild = undefined;

    // birth year is optional
    newErrorObject.year = undefined;

    setFormError(newErrorObject);
  };

  const handleSave = async (e?: FormEvent, isSkipSuccessPopup?: boolean) => {
    e && e.preventDefault();

    if (!isFormValid) {
      return;
    }

    await editProfile({
      birthMonth: formValue.month!,
      birthYear: formValue.year!,
      hasChild: formValue.hasChild!,
      countryCode: formValue.countryCode!,
      livingCountry: formValue.livingCountry!,
      preferLang: formValue.preferLang!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      gender: formValue.gender!,
      mobile: formValue.mobile!,
      email: formValue.email!,
      districtCode: formValue.district,
      regionCode: formValue.region,
      title: formValue.title!,
      smsOptIn: !formValue.smsOptIn!,
      emailOptIn: !formValue.emailOptIn!,
    })
      .unwrap()
      .then(res => {
        refetch();
        if (res.statusCode === 200 && !isSkipSuccessPopup) {
          handleAlertMessageForGeneralPage({
            alertCode: "g60",
            alertType: "popup",
            translate,
            dispatch,
            lang,
            extraInfo: {
              rightButtonCallback: async () => {
                router.push(`/${lang}/${ROUTES.MEMBER}`);
              },
            },
          });
        } else {
          handleAlertMessageForGeneralPage({
            alertCode: res.returnCode ?? "No Alert Code Has Returned",
            alertType: "popup",
            translate,
            dispatch,
            lang,
            extraInfo: {
              message: (res as any).message,
              alertCode: res.returnCode,
            },
          });
        }
      });
  };

  useEffect(() => {
    if (profileData) {
      setFormValue({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        countryCode: profileData.countryCode,
        mobile: profileData.mobile.split(" ").join("").replaceAll('"', ""),
        email: profileData.email,
        title: profileData.title,
        month: profileData.birthMonth,
        year: profileData.birthYear ?? undefined,
        livingCountry: profileData.livingCountry,
        region: profileData.region,
        district: profileData.district,
        gender: profileData.gender,
        hasChild: profileData.hasChild,
        preferLang: profileData.preferLang.toLowerCase(),
        smsOptIn: !profileData.smsOptIn ?? false,
        emailOptIn: !profileData.emailOptIn ?? false,
      });
    }
  }, [profileData, regionList]);

  useEffect(() => {
    checkIsFormValid();
  }, [formValue]);

  const languageItems = useMemo(() => {
    const commonStyle = "chipBtn";
    return [
      {
        label: translate("profile.preferLang_zh"),
        code: "zh",
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.preferLang_en"),
        code: "en",
        buttonStyle: commonStyle,
      },
    ];
  }, []);

  const childrenItems = useMemo(() => {
    const commonStyle = "chipBtn";
    return [
      {
        label: translate("profile.hasChild_yes"),
        code: true,
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.hasChild_no"),
        code: false,
        buttonStyle: commonStyle,
      },
    ];
  }, []);

  const genderItems = useMemo(() => {
    const iconStyle = "flex h-[55px] w-[55px] items-center justify-center rounded-full";
    const textStyle = "rounded-[40px] px-4";
    return [
      {
        label: "",
        code: "male",
        isIconButton: true,
        iconSrc: formValue.gender === "male" ? SelectedMale : MaleIcon,
        buttonStyle: iconStyle,
        disabled: formValue.title === "Mrs." || formValue.title === "Miss" || formValue.title === "Ms.",
      },
      {
        label: "",
        code: "female",
        isIconButton: true,
        iconSrc: formValue.gender === "female" ? SelectedFemale : FemaleIcon,
        buttonStyle: iconStyle,
        disabled: formValue.title === "Mr.",
      },
      {
        label: translate("profile.gender_undisclosed"),
        code: "undisclosed",
        isIconButton: false,
        iconSrc: "",
        buttonStyle: textStyle,
        disabled: false,
      },
    ];
  }, [formValue]);

  const regionAndDistrictItems = useMemo(() => {
    const regionItems: {
      label: string;
      code: string | undefined;
    }[] = [
      {
        label: translate("profile.region_default"),
        code: undefined,
      },
    ];

    const districtMap: {
      [region: string]: {
        label: string;
        code: string | undefined;
      }[];
    } = {
      "": [
        {
          label: translate("profile.district_default"),
          code: undefined,
        },
      ],
    };

    if (regionList?.data?.length) {
      regionList?.data?.forEach(region => {
        regionItems.push({
          label: region.name,
          code: region.code,
        });
        region.districts.forEach(district => {
          if (!districtMap[region.code]) {
            districtMap[region.code] = [
              {
                label: translate("profile.district_default"),
                code: undefined,
              },
            ];
          }
          districtMap[region.code].push({
            label: district.name,
            code: district.code,
          });
        });
      });
    }

    return {
      regionItems,
      districtMap,
    };
  }, [regionList, formValue]);

  const countryItems = useMemo(() => {
    const items: {
      label: string;
      code: string | undefined;
    }[] = [
      {
        label: translate("profile.country_default"),
        code: undefined,
      },
      {
        label: translate("profile.country_hk"),
        code: "hk",
      },
      {
        label: translate("profile.country_macau"),
        code: "macau",
      },
      {
        label: translate("profile.country_mainland"),
        code: "mainland",
      },
    ];

    return items;
  }, []);

  const monthItems = useMemo(() => {
    const items: {
      label: string;
      code: number | undefined;
    }[] = [
      {
        label: translate("profile.month"),
        code: undefined,
      },
    ];
    for (let i = 1; i <= 12; i++) {
      items.push({
        label: String(i).padStart(2, "0"),
        code: i,
      });
    }

    return items;
  }, []);

  const yearItems = useMemo(() => {
    const items: {
      label: string;
      code: number | undefined | null;
      defaultLabel?: string | null;
    }[] = [
      {
        label: translate("profile.year_optional"),
        code: undefined,
        defaultLabel: translate("profile.year_optional"),
      },
    ];
    for (let i = moment().subtract(99, "year").year(); i <= moment().subtract(18, "year").year(); i++) {
      items.push({
        label: String(i),
        code: i,
      });
    }

    return items;
  }, []);

  const titleItems = useMemo(() => {
    const commonStyle = "chipBtnWithMoreRadius";
    return [
      {
        label: translate("profile.title_default"),
        code: undefined,
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.title_mr"),
        code: "Mr.",
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.title_mrs"),
        code: "Mrs.",
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.title_ms"),
        code: "Ms.",
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.title_miss"),
        code: "Miss",
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.title_dr"),
        code: "Dr.",
        buttonStyle: commonStyle,
      },
      {
        label: translate("profile.title_prof"),
        code: "Prof.",
        buttonStyle: commonStyle,
      },
    ];
  }, []);

  const updateFormValue = (field: keyof typeof formValue, value: string | number | boolean | undefined) => {
    setIsEditing(true);
    setFormValue({
      ...formValue,
      [field]: value,
    });
  };

  const updateTitleAndGender = (title?: string) => {
    let gender: string | undefined = formValue.gender;
    if (title === "Mr." && gender !== "undisclosed") {
      gender = "male";
    } else if ((title === "Mrs." || title === "Ms." || title === "Miss") && gender !== "undisclosed") {
      gender = "female";
    }
    setIsEditing(true);
    setFormValue({
      ...formValue,
      title,
      gender,
    });
  };

  return (
    <>
      {isSuccess && (
        <form className=" mb-14 flex w-full flex-col gap-9 lg:mb-0">
          {width <= 1290 ? (
            <div>
              <Headings title={translate("registrationStep2.title") as string} />
              <RevampedSelect
                items={titleItems}
                onChange={(value: string) => {
                  updateTitleAndGender(value);
                }}
                value={formValue.title}
                hasError={!!formError?.title && formError?.title?.length > 0}
                error={formError?.title}
              />
            </div>
          ) : (
            <div>
              <Headings title={translate("registrationStep2.title") as string} />
              <RevampedChip
                items={titleItems}
                onClick={(value: string) => {
                  updateTitleAndGender(value);
                }}
                value={formValue.title}
                hasError={!!formError?.title && formError?.title?.length > 0}
                error={formError?.title}
              />
            </div>
          )}
          <div className="registerInfoFormNamesContainer">
            <Input
              labelFor={firstName.labelFor}
              labelText={translate("registrationStep2.yourName")}
              placeholder={translate("registrationStep2.givenName") as string}
              type={firstName.type}
              autoComplete={firstName.autoComplete}
              required={firstName.required}
              name={firstName.id}
              id={firstName.id}
              minLength={firstName.minLength}
              maxLength={firstName.maxLength}
              isValid={true}
              lang={lang}
              path={path}
              editValue={profileData?.firstName}
            />
            <Input
              labelFor={lastName.labelFor}
              labelText={translate("registrationStep2.yourName")}
              placeholder={translate("registrationStep2.birthName") as string}
              type={lastName.type}
              autoComplete={lastName.autoComplete}
              required={lastName.required}
              name={lastName.name}
              id={lastName.id}
              minLength={lastName.minLength}
              maxLength={lastName.maxLength}
              isValid={true}
              lang={lang}
              path={path}
              editValue={profileData?.lastName}
            />
          </div>
          <div>
            <Headings title={translate("registrationStep2.gender") as string} />
            <RevampedChip
              items={genderItems}
              onClick={(value: string) => {
                updateFormValue("gender", value);
              }}
              value={formValue.gender}
              hasError={!!formError?.gender && formError?.gender?.length > 0}
              error={formError?.gender}
            />
          </div>

          <Input
            labelFor={mobile.labelFor}
            labelText={translate("registrationStep2.mobileNum")}
            type={mobile.type}
            autoComplete={mobile.autoComplete}
            required={mobile.required}
            name={mobile.name}
            id={mobile.id}
            minLength={mobile.minLength}
            maxLength={mobile.maxLength}
            editValue={profileData?.mobile.replace(/(\d{4})/g, "$1 ").trim()}
            lang={lang}
            path={path}
            isValid={true}
          />
          <Checkbox
            labelFor={SMSCheckbox.labelFor}
            labelText={translate("registrationStep2.dontReceiveSMS") as string}
            type={SMSCheckbox.type}
            name={SMSCheckbox.name}
            id={SMSCheckbox.id}
            required={SMSCheckbox.required}
            checked={formValue.smsOptIn}
            onChange={() => {
              updateFormValue("smsOptIn", !formValue.smsOptIn);
            }}
          />
          <Input
            labelFor={email.labelFor}
            labelText={translate("registrationStep2.email")}
            placeholder={translate("registrationStep2.emailAddress") as string}
            type={email.type}
            autoComplete={email.autoComplete}
            required={email.required}
            name={email.name}
            id={email.id}
            errorMsg={email.errorMsg}
            minLength={email.minLength}
            maxLength={email.maxLength}
            isValid={true}
            lang={lang}
            path={path}
            editValue={profileData?.email}
          />
          <Checkbox
            labelFor={EmailCheckbox.labelFor}
            labelText={translate("registrationStep2.dontReceiveEmail") as string}
            type={EmailCheckbox.type}
            name={EmailCheckbox.name}
            id={EmailCheckbox.id}
            required={EmailCheckbox.required}
            checked={formValue.emailOptIn}
            onChange={() => {
              updateFormValue("emailOptIn", !formValue.emailOptIn);
            }}
          />
          <div>
            <Headings
              title={translate("registrationStep2.children") as string}
              subheading={translate("registrationStep2.remarks1") as string}
            />
            <RevampedChip
              unSelectAble
              items={childrenItems}
              onClick={(value: boolean) => {
                updateFormValue("hasChild", value);
              }}
              value={formValue.hasChild}
            />
          </div>

          <div className="registerInfoFormSelectsContainer">
            <Headings
              title={translate("registrationStep2.birthday") as string}
              subheading={translate("registrationStep2.remarks2") as string}
            />
            <div className="flex w-full gap-3">
              <RevampedSelect
                items={monthItems}
                onChange={(value: number) => {
                  updateFormValue("month", value);
                }}
                disabled
                value={formValue.month}
                hasError={!!formError?.month && formError?.month?.length > 0}
                error={formError?.month}
              />
              <RevampedSelect
                items={yearItems}
                onChange={(value: number) => {
                  updateFormValue("year", value);
                }}
                disabled={!!profileData.birthYear}
                value={formValue.year}
                hasError={!!formError?.year && formError?.year?.length > 0}
                error={formError?.year}
                forceDisplay={true}
              />
            </div>
          </div>
          <div>
            <Headings
              title={translate("registrationStep2.yourLivingCountry") as string}
              subheading={translate("registrationStep2.remarks3") as string}
            />
            <RevampedSelect
              items={countryItems}
              onChange={(value: string) => {
                setIsEditing(true);
                setFormValue({
                  ...formValue,
                  livingCountry: value,
                  region: undefined,
                  district: undefined,
                });
              }}
              value={formValue.livingCountry}
              hasError={!!formError?.livingCountry && formError?.livingCountry?.length > 0}
              error={formError?.livingCountry}
            />
            {regionList?.data.length && formValue.livingCountry === "hk" ? (
              <div className="registerInfoFormRegionAndDistrictContainer">
                <Headings title={translate("registrationStep2.yourLivingRegion") as string} />
                <div className="flex w-full gap-3">
                  <RevampedSelect
                    items={regionAndDistrictItems.regionItems}
                    onChange={(value: string) => {
                      setFormValue({
                        ...formValue,
                        region: value,
                        district: undefined,
                      });
                    }}
                    value={formValue.region ?? undefined}
                    hasError={!!formError?.region && formError?.region?.length > 0}
                    error={formError?.region}
                  />
                  <RevampedSelect
                    items={regionAndDistrictItems.districtMap[formValue.region ?? ""]}
                    onChange={(value: string) => {
                      updateFormValue("district", value);
                    }}
                    disabled={!formValue.region}
                    value={formValue.district ?? undefined}
                    hasError={!!formError?.district && formError?.district?.length > 0}
                    error={formError?.district}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <Headings title={translate("registrationStep2.preferredLanguage") as string} />
            <RevampedChip
              items={languageItems}
              onClick={(value: string) => {
                updateFormValue("preferLang", value);
              }}
              value={formValue.preferLang}
              hasError={!!formError?.preferLang && formError?.preferLang?.length > 0}
              error={formError?.preferLang}
            />
          </div>
          <div className="hidden md:flex md:flex-row-reverse">
            <button
              disabled={!isFormValid || !isEditing}
              onClick={e => {
                handleSave(e, false);
              }}
              className={`flex h-[53px] w-full items-center justify-center rounded-full  text-center  font-medium  xl:text-[20px] ${
                !isFormValid || !isEditing
                  ? "bg-primaryGold15 text-primaryGold"
                  : "cursor-pointer bg-primaryGold text-white"
              }`}
            >
              {translate("editProfile.Save")}
            </button>
            <button
              onClick={handleLeavingPopUp}
              className="flex h-[53px] w-[30%]  items-center  justify-center rounded-full  text-center text-primaryGold xl:text-[20px]"
            >
              {translate("registrationStep2.back")}
            </button>
          </div>

          <MobileButtonContainer>
            <div className="flex w-full gap-3">
              <button
                onClick={handleLeavingPopUp}
                className="flex h-[53px] w-[30%]  items-center  justify-center rounded-full  text-center text-primaryGold xl:text-[20px]"
              >
                {translate("registrationStep2.back")}
              </button>

              <button
                disabled={!isFormValid || !isEditing}
                onClick={e => {
                  handleSave(e, false);
                }}
                className={`flex h-[53px] w-full items-center justify-center rounded-full bg-primaryGold text-center font-medium xl:text-[20px] ${
                  !isFormValid || !isEditing
                    ? "bg-primaryGold15 text-primaryGold"
                    : "cursor-pointer bg-primaryGold text-white"
                }`}
              >
                {translate("editProfile.Save")}
              </button>
            </div>
          </MobileButtonContainer>
        </form>
      )}
    </>
  );
};
