/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import moment from "moment";
import MaleIcon from "@/images/icons/Icon_male.png";
import FemaleIcon from "@/images/icons/Icon_female.png";
import SelectedMale from "@/images/icons/Icon_Male-white@3x.png";
import SelectedFemale from "@/images/icons/Icon_Female-white@3x.png";
import { useState, FormEvent, useEffect, useMemo, MouseEvent } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { usePathname, useSearchParams } from "next/navigation";
import { LocaleKeysType } from "@/app/i18n";
import { Checkbox } from "./Checkbox";
import { EmailCheckbox, SMSCheckbox, TermsCheckbox } from "@/constants/registration/checkbox";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { useGetRegionListQuery } from "@/redux/api/branchApi";
import { useTokenValidationMutation } from "@/redux/api/memberApi";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Headings } from "../member/Headings";
import { alertMessageMapperForRegistration } from "@/utils/clientUtils";
import { ROUTES } from "@/constants";
import { RevampedSelect } from "./RevampedSelect";
import { RevampedChip } from "./RevampedChip";
import { useSendRegistrationInfoMutation } from "@/redux/api/authApi";
import { ExtraFormValueType, FormErrorType, FormValueType } from "./EditProfileForm";
import { PrivacyPolicyPopup } from "./PrivacyPolicyPopup";
import { mockMemberships, mockPolicies, mockTerms } from "@/app/mock/mockTerms";
import { createPortal } from "react-dom";
import { setGlobalAlertStatus, setRegisterEmail } from "@/redux/slice/generalStateSlice";
import "@/style/auth/auth.scss";
import { CustomInput } from "../checkout/CustomInput";
import { getRouteNameFromPathname, isEmailValid, isNameValid } from "@/utils/commonUtils";

type RegistrationFormErrorType = {
  [key in keyof (FormErrorType & ExtraFormValueType & { token?: any })]: string | boolean;
};

export const InfoForm = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate: t } = useTranslation(lang);
  const path = usePathname();
  const slug = getRouteNameFromPathname(path);
  const query = useSearchParams();
  const route = useRouter();
  const { width } = useWindowSize();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const dispatch = useDispatch();
  const [sendRegistrationInfo, { isError: registrationError }] = useSendRegistrationInfoMutation();
  const [tokenValidation] = useTokenValidationMutation();
  const { data: regionList } = useGetRegionListQuery({ lang });
  const countryCode = useSelector((state: RootState) => state.registrationMobile.code);
  const token = query.get("token") ?? "";

  const mobileNumber = useMemo(() => {
    if (typeof localStorage !== "undefined") {
      const storeValue = localStorage.getItem("MobileNumber");
      return storeValue ? storeValue.replace(/"/g, "") : "";
    }
    return undefined;
  }, [localStorage]);

  const [extraFormValue, setExtraFormValue] = useState<ExtraFormValueType>({});

  const [formValue, setFormValue] = useState<FormValueType & { token?: string }>({
    firstName: undefined,
    lastName: undefined,
    countryCode: countryCode,
    mobile: mobileNumber,
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
    token: undefined,
  });

  const [formError, setFormError] = useState<RegistrationFormErrorType>({
    firstName: undefined,
    lastName: undefined,
    mobile: undefined,
    email: undefined,
    gender: undefined,
    title: undefined,
    month: undefined,
    region: undefined,
    district: undefined,
    livingCountry: undefined,
    preferLang: undefined,
    token: undefined,
  });

  useEffect(() => {
    tokenValidation({ token: token })
      .unwrap()
      .then(res => {
        if (res.statusCode !== 200 || (res.statusCode === 200 && !res.data.isValid)) {
          alertMessageMapperForRegistration({
            alertCode: res?.returnCode ?? "",
            translate: t,
            dispatch,
            lang,
            onLeftButtonClick() {
              window.location.href = `/${lang}/${ROUTES.LOGIN}`;
            },
            onRightButtonClick() {
              window.location.href = `/${lang}/${ROUTES.LOGIN}`;
            },
          });
        } else {
          const preferLang = slug.firstSlug === "tc" ? "zh" : "en";
          setFormValue({
            ...formValue,
            token,
            mobile: (mobileNumber ?? "").split(" ").join("").replaceAll('"', ""),
            preferLang,
          });
          let latestError = validateFormByField("token", token);
          latestError = validateFormByField("mobile", mobileNumber, latestError);
          validateFormByField("preferLang", preferLang, latestError);
        }
      })
      .catch(error => {
        alertMessageMapperForRegistration({
          alertCode: error.error.returnCode,
          translate: t,
          dispatch,
          lang,
          onLeftButtonClick() {
            window.location.href = `/${lang}/${ROUTES.LOGIN}`;
          },
          onRightButtonClick() {
            window.location.href = `/${lang}/${ROUTES.LOGIN}`;
          },
        });
      });
  }, [query]);

  useEffect(() => {
    if ((registrationError as any)?.message === "Aborted" && (registrationError as any)?.name === "AbortError") {
      dispatch(
        setGlobalAlertStatus({
          isGlobalAlertDisplay: true,
          alertTitle: t("alertModal.registration_timeout_popup_title"),
          alertContent: t("alertModal.registration_timeout_popup_content"),
          leftButtonText: t("alertModal.registration_timeout_popup_left_button_text"),
          rightButtonText: t("alertModal.registration_timeout_popup_right_button_text"),
        })
      );
    }
  }, [registrationError]);

  const isFormValid = useMemo(() => {
    return Object.values(formError).filter(error => error === false).length === Object.keys(formError).length;
  }, [formError, formValue]);

  const validateFormByField = (
    field: keyof (FormValueType & ExtraFormValueType & { token?: string }),
    value: any,
    latestFormError?: RegistrationFormErrorType
  ) => {
    const newErrorObject: RegistrationFormErrorType = {
      [field]: false,
    };
    switch (true) {
      case !value || value?.length < 1:
        newErrorObject[field] = t("alertModal.required")!;
        break;
      case field === "firstName" && String(value)?.length !== 0 && !isNameValid(String(value)):
      case field === "lastName" && String(value)?.length !== 0 && !isNameValid(String(value)):
        newErrorObject[field] = t(`checkout.error.${field}`)!;
        break;
      case field === "email" && String(value)?.length !== 0 && !isEmailValid(String(value)):
        newErrorObject[field] = t("checkout.error.email")!;
        break;
      case field === "emailForVerify" && String(value)?.length !== 0 && !isEmailValid(String(value)):
        newErrorObject[field] = t("checkout.error.email")!;
        break;
      case field === "emailForVerify" &&
        String(value)?.length !== 0 &&
        isEmailValid(String(value)) &&
        String(value) !== formValue.email:
        newErrorObject[field] = t("checkout.error.emailVerify")!;
        break;
      case field === "livingCountry" && value === "hk":
        newErrorObject.region = undefined;
        newErrorObject.district = undefined;
        break;
      case field === "livingCountry" && value !== "hk":
        newErrorObject.region = false;
        newErrorObject.district = false;
        break;
      case field === "region":
        newErrorObject.district = undefined;
        break;
      default:
        break;
    }

    setFormError({
      ...(latestFormError ?? formError),
      ...newErrorObject,
    });

    return {
      ...(latestFormError ?? formError),
      ...newErrorObject,
    };
  };

  const languageItems = useMemo(() => {
    return [
      {
        label: t("profile.preferLang_zh"),
        code: "zh",
        buttonStyle: "h-[60px] w-[70px] rounded-[12px] xl:h-[55px] xl:w-[75px]",
      },
      {
        label: t("profile.preferLang_en"),
        code: "en",
        buttonStyle: "h-[60px] w-[100px] rounded-[12px] xl:h-[55px] xl:w-[75px]",
      },
    ];
  }, []);

  const childrenItems = useMemo(() => {
    const commonStyle = "chipBtn";
    return [
      {
        label: t("profile.hasChild_yes"),
        code: true,
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.hasChild_no"),
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
        label: "male",
        code: "male",
        isIconButton: true,
        iconSrc: formValue.gender === "male" ? SelectedMale : MaleIcon,
        buttonStyle: iconStyle,
        disabled: formValue.title === "Mrs." || formValue.title === "Miss" || formValue.title === "Ms.",
      },
      {
        label: "female",
        code: "female",
        isIconButton: true,
        iconSrc: formValue.gender === "female" ? SelectedFemale : FemaleIcon,
        buttonStyle: iconStyle,
        disabled: formValue.title === "Mr.",
      },
      {
        label: t("profile.gender_undisclosed"),
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
        label: t("profile.region_default"),
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
          label: t("profile.district_default"),
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
                label: t("profile.district_default"),
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
        label: t("profile.country_default"),
        code: undefined,
      },
      {
        label: t("profile.country_hk"),
        code: "hk",
      },
      {
        label: t("profile.country_macau"),
        code: "macau",
      },
      {
        label: t("profile.country_mainland"),
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
        label: t("profile.month"),
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
        label: t("profile.year_optional"),
        code: undefined,
        defaultLabel: t("profile.year_optional"),
      },
    ];
    for (let i = moment().subtract(18, "year").year(); i >= moment().subtract(99, "year").year(); i--) {
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
        label: t("profile.title_default"),
        code: undefined,
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.title_mr"),
        code: "Mr.",
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.title_mrs"),
        code: "Mrs.",
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.title_ms"),
        code: "Ms.",
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.title_miss"),
        code: "Miss",
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.title_dr"),
        code: "Dr.",
        buttonStyle: commonStyle,
      },
      {
        label: t("profile.title_prof"),
        code: "Prof.",
        buttonStyle: commonStyle,
      },
    ];
  }, []);

  const handleOnBackClick = () => {
    alertMessageMapperForRegistration({
      alertCode: "g53",
      translate: t,
      dispatch,
      lang,
      onLeftButtonClick: () => {
        window.location.href = `/${lang}/${ROUTES.REGISTRATION}?register=${token}&mobileNumber=${mobileNumber}`;
      },
    });
  };

  const handleShowTermsModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowTermsModal(!showTermsModal);
  };

  const handleShowMembershipModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMembershipModal(!showMembershipModal);
  };

  const handleShowPrivacyModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPrivacyModal(!showPrivacyModal);
  };

  const handleSubmitInfo = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await sendRegistrationInfo({
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        countryCode: countryCode,
        mobileNumber: (formValue.mobile ?? "").split(" ").join("").replaceAll('"', "")!,
        mobileOptin: !formValue.smsOptIn,
        email: formValue.email!,
        emailOptin: !formValue.emailOptIn,
        gender: formValue.gender!,
        title: formValue.title!,
        hasChild: formValue.hasChild,
        birthMonth: formValue.month!,
        birthYear: formValue.year!,
        regionCode: formValue.region ? formValue.region : undefined,
        districtCode: formValue.district ? formValue.district : undefined,
        livingCountry: formValue.livingCountry!,
        preferLang: formValue.preferLang!,
        token: formValue.token!,
      })
        .unwrap()
        .then(res => {
          if (res?.statusCode === 400) {
            // same alert
            if (res.returnCode === "49999") {
              res.returnCode = "10023";
            }
            dispatch(
              setGlobalAlertStatus({
                isGlobalAlertDisplay: true,
                alertTitle: t(`alertModal.${res.returnCode}_popup_title`),
                alertContent: t(`alertModal.${res.returnCode}_popup_content`),
                leftButtonText: t(`alertModal.${res.returnCode}_popup_left_button_text`),
                rightButtonText: t(`alertModal.${res.returnCode}_popup_right_button_text`),
                onLeftButtonClick: () => {
                  localStorage.setItem("isContactClickedInRegisterSubmittedPage", "true");
                  window.location.href = `/${lang}/${ROUTES.CONTACT}`;
                  setIsSubmitting(false);
                },
              })
            );
          }

          if (res?.statusCode === 201) {
            localStorage.removeItem("MobileNumber");
            dispatch(setRegisterEmail(formValue.email!));
            route.push(ROUTES.REGISTRATION_SUBMITTED);
          }
        });
    } catch (error) {
      if (error instanceof Error) {
        return new Error("Unexpected Status code");
      }
    }
  };

  const updateTitleAndGender = (title?: string) => {
    let gender: string | undefined = formValue.gender;
    if (title === "Mr." && gender !== "undisclosed") {
      gender = "male";
    } else if ((title === "Mrs." || title === "Ms." || title === "Miss") && gender !== "undisclosed") {
      gender = "female";
    }
    setFormValue({
      ...formValue,
      title,
      gender,
    });
    const latestFormError = validateFormByField("title", title);
    validateFormByField("gender", gender, latestFormError);
  };

  return (
    <>
      <form className="registerInfoForm">
        {width <= 1290 ? (
          <div>
            <Headings title={t("registrationStep2.title") as string} />
            <RevampedSelect
              items={titleItems}
              onChange={(value: string) => {
                updateTitleAndGender(value);
              }}
              value={formValue.title}
              hasError={!!formError?.title}
              error={formError?.title as string}
            />
          </div>
        ) : (
          <div>
            <Headings title={t("registrationStep2.title") as string} />
            <RevampedChip
              items={titleItems}
              onClick={(value: string) => {
                updateTitleAndGender(value);
              }}
              value={formValue.title}
              hasError={!!formError?.title}
              error={formError?.title as string}
            />
          </div>
        )}
        <div className="registerInfoFormNamesContainer">
          <CustomInput
            label={t("registrationStep2.yourName") as string}
            type="TEXT"
            placeholder={t("registrationStep2.givenName")}
            value={formValue.firstName}
            labelClasses="labelText"
            handleChange={event => {
              setFormValue({ ...formValue, firstName: event.target.value });
            }}
            onBlur={() => {
              validateFormByField("firstName", formValue.firstName);
            }}
            hasError={!!formError?.firstName}
            error={formError?.firstName as string}
          />
          <CustomInput
            remainLabelHeight={true}
            type="TEXT"
            placeholder={t("registrationStep2.birthName")}
            value={formValue.lastName}
            handleChange={event => {
              setFormValue({ ...formValue, lastName: event.target.value });
            }}
            onBlur={() => {
              validateFormByField("lastName", formValue.lastName);
            }}
            hasError={!!formError?.lastName}
            error={formError?.lastName as string}
          />
        </div>
        <div>
          <Headings title={t("registrationStep2.gender") as string} />
          <RevampedChip
            items={genderItems}
            onClick={(value: string) => {
              setFormValue({ ...formValue, gender: value });
            }}
            value={formValue.gender}
            hasError={!!formError?.gender}
            error={formError?.gender as string}
          />
        </div>
        <CustomInput
          disabledTextClasses="opacity-50 border-primaryGold bg-primaryGold/20"
          disabled={true}
          label={t("registrationStep2.mobileNum") as string}
          labelClasses="labelText"
          type="TEXT"
          placeholder={""}
          value={formValue.mobile}
          handleChange={event => {
            setFormValue({ ...formValue, mobile: event.target.value });
          }}
          onBlur={() => {
            validateFormByField("mobile", formValue.mobile);
          }}
          hasError={!!formError?.mobile}
          error={formError?.mobile as string}
        />
        <Checkbox
          labelFor={SMSCheckbox.labelFor}
          labelText={t("registrationStep2.dontReceiveSMS") as string}
          type={SMSCheckbox.type}
          name={SMSCheckbox.name}
          id={SMSCheckbox.id}
          required={SMSCheckbox.required}
          checked={formValue.smsOptIn}
          onChange={() => {
            setFormValue({
              ...formValue,
              smsOptIn: !formValue.smsOptIn,
            });
          }}
        />
        <CustomInput
          label={t("registrationStep2.email") as string}
          labelClasses="labelText"
          type="TEXT"
          placeholder={t("registrationStep2.emailAddress")}
          value={formValue.email}
          handleChange={event => {
            setFormValue({ ...formValue, email: event.target.value });
          }}
          onBlur={() => {
            const latestFormError = validateFormByField("email", formValue.email);
            if (extraFormValue.emailForVerify?.length) {
              validateFormByField("emailForVerify", extraFormValue.emailForVerify, latestFormError);
            }
          }}
          hasError={!!formError?.email}
          error={formError?.email as string}
        />
        <Checkbox
          labelFor={EmailCheckbox.labelFor}
          labelText={t("registrationStep2.dontReceiveEmail") as string}
          type={EmailCheckbox.type}
          name={EmailCheckbox.name}
          id={EmailCheckbox.id}
          required={EmailCheckbox.required}
          checked={formValue.emailOptIn}
          onChange={() => {
            setFormValue({
              ...formValue,
              emailOptIn: !formValue.emailOptIn,
            });
          }}
        />
        <CustomInput
          label={t("registrationStep2.confirmEmail") as string}
          labelClasses="labelText"
          type="TEXT"
          placeholder={t("registrationStep2.confirmYourEmail")}
          value={extraFormValue.emailForVerify}
          handleChange={event => {
            setExtraFormValue({ ...extraFormValue, emailForVerify: event.target.value });
          }}
          onBlur={() => {
            validateFormByField("emailForVerify", extraFormValue.emailForVerify);
          }}
          hasError={!!formError?.emailForVerify}
          error={formError?.emailForVerify as string}
        />
        <div>
          <Headings
            title={t("registrationStep2.children") as string}
            subheading={t("registrationStep2.remarks1") as string}
          />
          <RevampedChip
            unSelectAble
            items={childrenItems}
            onClick={(value?: boolean) => {
              setFormValue({ ...formValue, hasChild: value });
            }}
            value={formValue.hasChild}
          />
        </div>
        <div className="registerInfoFormSelectsContainer">
          <Headings
            title={t("registrationStep2.birthday") as string}
            subheading={t("registrationStep2.remarks2") as string}
          />
          <div className="flex w-full gap-3">
            <RevampedSelect
              items={monthItems}
              onChange={value => {
                setFormValue({
                  ...formValue,
                  month: value,
                });
                validateFormByField("month", value);
              }}
              value={formValue.month}
              hasError={!!formError?.month}
              error={formError?.month as string}
            />
            <RevampedSelect
              items={yearItems}
              onChange={value => {
                setFormValue({
                  ...formValue,
                  year: value,
                });
              }}
              value={formValue.year}
              hasError={!!formError?.year}
              error={formError?.year as string}
            />
          </div>
        </div>
        <div>
          <Headings
            title={t("registrationStep2.yourLivingCountry") as string}
            subheading={t("registrationStep2.remarks3") as string}
          />
          <RevampedSelect
            items={countryItems}
            onChange={value => {
              setFormValue({
                ...formValue,
                livingCountry: value,
                region: undefined,
                district: undefined,
              });

              validateFormByField("livingCountry", value);
            }}
            value={formValue.livingCountry}
            hasError={!!formError?.livingCountry}
            error={formError?.livingCountry as string}
          />
          {regionList?.data.length && formValue.livingCountry === "hk" ? (
            <div className="registerInfoFormRegionAndDistrictContainer">
              <Headings title={t("registrationStep2.yourLivingRegion") as string} />
              <div className="flex w-full gap-3">
                <RevampedSelect
                  items={regionAndDistrictItems.regionItems}
                  onChange={value => {
                    setFormValue({
                      ...formValue,
                      region: value,
                      district: undefined,
                    });
                    validateFormByField("region", value);
                  }}
                  value={formValue.region ?? undefined}
                  hasError={!!formError?.region}
                  error={formError?.region as string}
                />
                <RevampedSelect
                  items={regionAndDistrictItems.districtMap[formValue.region ?? ""]}
                  onChange={value => {
                    setFormValue({
                      ...formValue,
                      district: value,
                    });
                    validateFormByField("district", value);
                  }}
                  disabled={!formValue.region}
                  value={formValue.district ?? undefined}
                  hasError={!!formError?.district}
                  error={formError?.district as string}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <Headings title={t("registrationStep2.preferredLanguage") as string} />
          <RevampedChip
            items={languageItems}
            onClick={(value: string) => {
              setFormValue({ ...formValue, preferLang: value });
              validateFormByField("preferLang", value);
            }}
            value={formValue.preferLang}
            hasError={!!formError?.preferLang}
            error={formError?.preferLang as string}
          />
        </div>
        <div className="mb-14 lg:my-4">
          <Checkbox
            labelFor={TermsCheckbox.labelFor}
            labelText={t("registrationStep2.acceptTerms") as string}
            labelButton={t("registrationStep2.terms") as string}
            labelButton2={t("registrationStep2.membership") as string}
            labelButton3={t("registrationStep2.privacy") as string}
            type={TermsCheckbox.type}
            name={TermsCheckbox.name}
            id={TermsCheckbox.id}
            required={TermsCheckbox.required}
            onClick={handleShowTermsModal}
            onClickMembership={handleShowMembershipModal}
            onClickPrivacy={handleShowPrivacyModal}
            onChange={() => setIsTermsChecked(!isTermsChecked)}
            path={path}
            lang={lang}
          />
        </div>
        <div className="registerInfoFormWebButtonsContainer">
          <button type="button" onClick={handleOnBackClick} className="registerInfoFormGoBackBtn">
            {t("registrationStep2.back")}
          </button>
          <button
            disabled={isFormValid === false || isTermsChecked === false || isSubmitting}
            onClick={handleSubmitInfo}
            className={`registerInfoFormSubmitBtn ${
              isFormValid === false || isTermsChecked === false || isSubmitting
                ? "registerInfoFormSubmitDeactivate"
                : "registerInfoFromSubmitActivate"
            }`}
          >
            {t("registrationStep2.submit")}
          </button>
        </div>
        <MobileButtonContainer zIndex={999}>
          <div className="registerInfoFormMobileButtonsContainer">
            <button type="button" onClick={handleOnBackClick} className="registerInfoFormGoBackBtn">
              {t("registrationStep2.back")}
            </button>
            <button
              disabled={isFormValid === false || isTermsChecked === false || isSubmitting}
              onClick={handleSubmitInfo}
              className={`registerInfoFormSubmitBtn ${
                isFormValid === false || isTermsChecked === false || isSubmitting
                  ? "registerInfoFormSubmitDeactivate"
                  : "registerInfoFromSubmitActivate"
              }`}
            >
              {t("registrationStep2.submit")}
            </button>
          </div>
        </MobileButtonContainer>
      </form>
      {showTermsModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockTerms}
            lang={lang}
            onClose={handleShowTermsModal}
            showModal={showTermsModal}
          />,
          document.body
        )}
      {showMembershipModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockMemberships}
            lang={lang}
            onClose={handleShowMembershipModal}
            showModal={showMembershipModal}
          />,
          document.body
        )}

      {showPrivacyModal &&
        createPortal(
          <PrivacyPolicyPopup
            terms={mockPolicies}
            lang={lang}
            onClose={handleShowPrivacyModal}
            showModal={showPrivacyModal}
          />,
          document.body
        )}
    </>
  );
};
