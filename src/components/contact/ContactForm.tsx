"use client";

import { useState, useMemo } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { LocaleKeysType } from "@/app/i18n";
import { MessageTextArea } from "./MessageTextArea";
import { Upload } from "./Upload";
import ReCAPTCHA from "react-google-recaptcha";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { useRouter } from "next/navigation";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { Headings } from "../member/Headings";
import { RevampedSelect } from "../forms/RevampedSelect";
import { RevampedChip } from "../forms/RevampedChip";
import { CustomInput } from "../checkout/CustomInput";
import { isEmailValid, isNameValid } from "@/utils/commonUtils";

type FormValueType = {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  title?: string;
  memberNumber?: string;
  typeofEnquiry?: string;
  countryCode?: "852" | "853" | "86";
  recaptcha?: string | boolean;
  orderReceipt?: string;
  comment?: string;
  attachment?: string;
};

type FormErrorType = {
  [key in keyof FormValueType]?: string | boolean;
};

export const ContactForm = ({ lang }: { lang: LocaleKeysType }) => {
  // todo: need to prefill profile data if user is already login
  // const { isAlreadyLogin } = useIsAlreadyLogin();
  // const profileData = useSelector((state: RootState) => state.profile);
  const { translate } = useTranslation(lang);
  const { width } = useWindowSize();
  const router = useRouter();

  const [formValue, setFormValue] = useState<FormValueType>({
    title: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    mobile: undefined,
    memberNumber: undefined,
    typeofEnquiry: undefined,
    recaptcha: undefined,
    countryCode: "852",
    attachment: undefined,
    comment: undefined,
  });

  const [extraFormValue, setExtraFormValue] = useState<{
    orderReceipt?: string;
  }>({
    orderReceipt: undefined,
  })

  const [formError, setFormError] = useState<FormErrorType>({
    title: undefined,
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    mobile: undefined,
    typeofEnquiry: undefined,
    recaptcha: undefined,
    comment: undefined,
    orderReceipt: false,
    memberNumber: false,
    countryCode: false,
    attachment: false,
  });

  const validateFormByField = (
    field: keyof FormValueType,
    value: any,
    latestFormError?: FormErrorType,
  ) => {
    const newErrorObject: FormErrorType = {
      [field]: false,
    };
    switch (true) {
      case !value || value?.length < 1:
        newErrorObject[field] = translate("alertModal.required")!;
        break;
      case field === "firstName" && String(value)?.length !== 0 && !isNameValid(String(value)):
      case field === "lastName" && String(value)?.length !== 0 && !isNameValid(String(value)):
        newErrorObject[field] = translate(`checkout.error.${field}`)!;
        break;
      case field === "email" && String(value)?.length !== 0 && !isEmailValid(String(value)):
        newErrorObject[field] = translate("checkout.error.email")!;
        break;
      case field === "mobile" && (Number.isNaN(value) || String(value)[0] === "0" || (formValue.countryCode === "852" && String(value)?.length !== 8)):
        newErrorObject[field] = translate("checkout.error.hkMobileNumber")!;
        break;
      case field === "mobile" && (Number.isNaN(value) || String(value)[0] === "0" || (formValue.countryCode === "853" && String(value)?.length !== 8)):
        newErrorObject[field] = translate("checkout.error.hkMobileNumber")!;
        break;
      case field === "mobile" && (Number.isNaN(value) || String(value)[0] === "0" || (formValue.countryCode === "86" && String(value)?.length !== 11)):
        newErrorObject[field] = translate("checkout.error.hkMobileNumber")!;
        break;
      case field === "memberNumber" && String(value).length > 0 && (Number.isNaN(value) || value.length < 8 || value.length > 10):
        newErrorObject[field] = translate("contactUs.memberNumMsg")!;
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

  const onSubmit = () => {
    router.push(`/${lang}/contact/submitted`);
  };

  const isFormValid = useMemo(() => {
    return Object.values(formError).filter(error => error === false).length === Object.keys(formError).length;
  }, [formError, formValue]);

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

  const typeofEnquiryItems = useMemo(() => {
    const commonStyle = "";
    return [
      {
        label: translate("contactUs.typeofEnquiryOptions.- Select Enquiry Type-"),
        code: undefined,
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Account Login"),
        code: "1",
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Member Upgrade/ Renewal"),
        code: "2",
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Member Registration/ Recruitment"),
        code: "3",
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Promotion/ Transactions"),
        code: "4",
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Feedback(Order/ Service/ Food)"),
        code: "5",
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Membership Cancellation"),
        code: "6",
        buttonStyle: commonStyle,
      },
      {
        label: translate("contactUs.typeofEnquiryOptions.Others"),
        code: "7",
        buttonStyle: commonStyle,
      },
    ];
  }, []);

  return (
    <form className="ContactFormClass">
      {width <= 1535 ? (
        <div>
          <Headings title={`${translate("personalInfo.title")}`} />
          <RevampedSelect
            items={titleItems}
            onChange={(value: string) => {
              setFormValue({
                ...formValue,
                title: value,
              });
              validateFormByField("title", value);
            }}
            value={formValue.title}
            hasError={!!formError?.title}
            error={formError?.title as string}
          />
        </div>
      ) : (
        <div>
          <Headings title={translate("personalInfo.title") as string} />
          <RevampedChip
            items={titleItems}
            onClick={(value: string) => {
              setFormValue({
                ...formValue,
                title: value,
              });
              validateFormByField("title", value);
            }}
            value={formValue.title}
            hasError={!!formError?.title}
            error={formError?.title as string}
          />
        </div>
      )}
      <div className="ContactFormNameContainer">
        <CustomInput
          labelClasses="labelText"
          label={translate("personalInfo.yourName") as string}
          type="TEXT"
          placeholder={translate("personalInfo.givenName")}
          value={formValue.firstName}
          handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValue({
              ...formValue,
              firstName: event.target.value,
            });
          }}
          hasError={!!formError?.firstName}
          error={formError?.firstName as string}
          onBlur={() => validateFormByField("firstName", formValue.firstName)}
        />
        <CustomInput
          labelClasses="labelText"
          remainLabelHeight
          type="TEXT"
          placeholder={translate("personalInfo.birthName")}
          value={formValue.lastName}
          handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValue({
              ...formValue,
              lastName: event.target.value,
            });
          }}
          hasError={!!formError?.lastName}
          error={formError?.lastName as string}
          onBlur={() => validateFormByField("lastName", formValue.lastName)}
        />
      </div>
      <div>
        <CustomInput
          labelClasses="labelText"
          label={translate("personalInfo.emailWithStar") as string}
          type="TEXT"
          placeholder={translate("personalInfo.yourEmail")}
          value={formValue.email}
          handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValue({
              ...formValue,
              email: event.target.value,
            });
          }}
          hasError={!!formError?.email}
          error={formError?.email as string}
          onBlur={() => validateFormByField("email", formValue.email)}
        />

        <div className="mt-1 px-5 text-[12px] font-medium leading-[18px] tracking-[-0.2px] text-primaryDark opacity-60 lg:mt-2  lg:text-primaryGold lg:opacity-100  xl:text-[14px]">
          <p>
            {translate("contactUs.emailRemark1")}
            <span className={`${lang === "tc" ? "hidden" : "block"}`}></span>
            {translate("contactUs.emailRemark2")}
          </p>
        </div>
      </div>

      <CustomInput
        labelClasses="labelText"
        label={translate("personalInfo.mobileNumberWithStar") as string}
        type="TEXT"
        placeholder={translate("personalInfo.onlyHkNumberAllowed")}
        value={formValue.mobile}
        handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFormValue({
            ...formValue,
            mobile: event.target.value,
          });
        }}
        hasError={!!formError?.mobile}
        error={formError?.mobile as string}
        onBlur={() => validateFormByField("mobile", formValue.mobile)}
        leftComponent={() => (
          <div
            className={
              "absolute left-0 top-0 flex h-full w-[80px] items-center pl-6 pr-[60px] text-14 font-semibold md:pl-10 md:text-lg"
            }
          >
            +852
          </div>
        )}
      />
      <CustomInput
        labelClasses="labelText"
        label={translate("personalInfo.memberNumber") as string}
        type="TEXT"
        placeholder={translate("personalInfo.memberNumber")}
        value={formValue.memberNumber}
        handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setFormValue({
            ...formValue,
            memberNumber: event.target.value,
          });
        }}
        hasError={!!formError?.memberNumber}
        error={formError?.memberNumber as string}
        onBlur={() => validateFormByField("memberNumber", formValue.memberNumber)}
      />
      <div>
        <Headings title={`${translate("contactUs.typeofEnquiry")}`} />
        <RevampedSelect
          items={typeofEnquiryItems}
          onChange={(value: string) => {
            setFormValue({
              ...formValue,
              typeofEnquiry: value,
            });
            validateFormByField("typeofEnquiry", value);
          }}
          value={formValue.typeofEnquiry}
          hasError={!!formError?.typeofEnquiry}
          error={formError?.typeofEnquiry as string}
        />
      </div>

      {formValue.typeofEnquiry === "3" && (
        <CustomInput
          // labelClasses="labelText"
          label={translate("contactUs.orderReceiptNumber") as string}
          type="TEXT"
          placeholder={translate("contactUs.orderReceiptNumberOptional")}
          value={formValue.memberNumber}
          handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setExtraFormValue({
              ...extraFormValue,
              orderReceipt: event.target.value,
            });
          }}
          hasError={false}
        />
      )}
      

      {formValue.typeofEnquiry !== undefined && (
        <>
          <MessageTextArea
            name={"message"}
            id={"message"}
            maxLen={2000}
            minLen={1}
            rows={4}
            cols={40}
            required={true}
            onChange={(event) => {
              setFormValue({
                ...formValue,
                comment: event.target.value,
              })
            }}
            lang={lang}
            onBlur={() => validateFormByField("comment", formValue.comment)}
          />

          <Upload 
            onImageUpload={(file: File) => {
              // might need to use "FormData" for attachment object
              const imageUrl = URL.createObjectURL(file);
              setFormValue({
                ...formValue,
                attachment: imageUrl,
              })
            }} 
            lang={lang} 
          />
        </>
      )}

      <div className="ContactFormReCAPTCHA">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
          onChange={(token: string | null) => {
            setFormValue({
              ...formValue,
              recaptcha: token === null ? undefined : token,
            })
            setFormError({
              ...formError,
              recaptcha: token === null ? true : false,
            })
          }}
          onExpired={() => {
            setFormValue({
              ...formValue,
              recaptcha: undefined,
            })
            setFormError({
              ...formError,
              recaptcha: true,
            })
          }}
          size="normal"
          badge="inline"
          hl={`${lang === "en" ? "en" : "zh-HK"}`}
        />
      </div>

      <MobileButtonContainer>
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className={`ContactFormMobileSubmitBtn ${
            !isFormValid
              ? "bg-primaryGold bg-opacity-40 text-primaryGold"
              : "cursor-pointer bg-primaryGold text-white  hover:bg-[#79684D]"
          } `}
        >
          {translate("contactUs.submit")}
        </button>
      </MobileButtonContainer>

      <button
        onClick={onSubmit}
        disabled={!isFormValid}
        className={`ContactFormDesktopSubmitBtn ${
          !isFormValid ? "bg-primaryGold bg-opacity-40" : "cursor-pointer bg-primaryGold  hover:bg-[#79684D]"
        } `}
      >
        {translate("contactUs.submit")}
      </button>
    </form>
  );
};
