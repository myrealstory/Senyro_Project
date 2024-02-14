"use client";

import { ChangeEvent, useState, MouseEvent } from "react";
import { useWindowSize } from "@/hook/useWindowSize";
import { usePathname } from "next/navigation";
import { LocaleKeysType } from "@/app/i18n";
import { campaignEnquiry, selectNumberOfGuests, titles, hours, minutes } from "@/constants/registration/select";
import { numberOfGuestsChip, titleChips } from "@/constants/registration/chips";
import { email, firstName, lastName, mobileForContact, company, budget } from "@/constants/registration/input";
import { MobileButtonContainer } from "../layout/MobileButtonContainer";
import { TitleChip } from "../forms/TitleChip";
import { Input, Select } from "../forms";
import { MessageTextArea } from "../contact/MessageTextArea";
import { EnquiryMessage } from "@/types/contact/contact";
import { GuestChip } from "./GuestChip";
import ReCAPTCHA from "react-google-recaptcha";
import CustomDatepicker from "../CustomDatepicker";
import moment from "moment";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/style/campagin/campagin.scss";
import { useTranslation } from "@/app/i18n/client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useIsAlreadyLogin } from "@/hook/useIsAlreadyLogin";
import { Headings } from "../member/Headings";

export const CampaignForm = ({ lang }: { lang: LocaleKeysType }) => {
  const { isAlreadyLogin } = useIsAlreadyLogin();
  const profileData = useSelector((state: RootState) => state.profile);
  // console.log(profileData,'profileData')
  const { translate: t } = useTranslation(lang);
  const { width } = useWindowSize();
  const path = usePathname();
  const [, setType] = useState("");
  const [selectGuest, setSelectGuest] = useState({ numberOfGuests: "" });
  const [chipGuest, setChipGuest] = useState({ numOfGuests: "" });
  const [selectTitle, setSelectTitle] = useState({ title: "" });
  const [chipTitle, setChipTitle] = useState({ title: "" });
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState({ hours: "", minutes: "" });
  const [inputVal, setInputVal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    company: "",
    budget: "",
  });
  const [selectVal, setSelectVal] = useState({
    campaignEnquiry: "",
  });

  const [isFistNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);
  const [isSubmitBtnDisabled, setIsSubmitBtnDisabled] = useState(true);
  const [message, setMessage] = useState<EnquiryMessage>({ message: "" });
  const [availableData, setAvailableData] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const racaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (
      inputVal.firstName !== "" &&
      inputVal.lastName !== "" &&
      inputVal.email !== "" &&
      (chipTitle.title || selectTitle.title !== "") &&
      inputVal.company !== "" &&
      message.message !== "" &&
      isRecaptchaValid &&
      selectVal.campaignEnquiry !== "" &&
      (chipGuest.numOfGuests !== "" || selectGuest.numberOfGuests !== "") &&
      eventDate !== "" &&
      eventTime.hours !== "" &&
      eventTime.minutes !== ""
    ) {
      setIsSubmitBtnDisabled(false);
    }
  }, [
    inputVal,
    selectVal,
    chipTitle,
    selectTitle,
    chipGuest,
    eventDate,
    eventTime,
    message,
    isRecaptchaValid,
    selectGuest,
  ]);

  const nameRegex = /^[a-zA-Z\u4E00-\u9FFF\u3400-\u4DBF]*$/u;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const mobileRegex = /^(5|6|9)\d{7}$/;

  const handleCheckType = (value: string) => {
    setType(value);
  };

  const handleSelect = (name: string, str: string) => {
    const newValues = str;
    setSelectVal({
      ...selectVal,
      [name]: newValues,
    });
  };
  const router = useRouter();

  const handleTitle = (name: string, str: string) => {
    const newValues = str;
    setSelectTitle({
      ...selectTitle,
      [name]: newValues,
    });
  };

  const handleChipTitleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const button: HTMLButtonElement = e.currentTarget;
    setChipTitle({
      ...chipTitle,
      [button.name]: button.value,
    });
  };

  const handleNumberOfGuestChip = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const button: HTMLButtonElement = e.currentTarget;
    setChipGuest({
      ...chipGuest,
      [button.name]: button.value,
    });
  };

  const handleSelectGuestChange = (name: string, str: string) => {
    const newValues = str;
    setSelectGuest({
      ...selectGuest,
      [name]: newValues,
    });
  };

  const handleSelectHourChange = (name: string, str: string) => {
    const newValues = str;
    setEventTime({
      ...eventTime,
      [name]: newValues,
    });
  };
  const handleSelectMinuteChange = (name: string, str: string) => {
    const newValues = str;
    setEventTime({
      ...eventTime,
      [name]: newValues,
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "firstName") {
      if (nameRegex.test(value) === true) {
        setIsFirstNameValid(true);
      } else {
        setIsFirstNameValid(false);
      }
      setInputVal({ ...inputVal, [name]: value });
    }

    if (name === "lastName") {
      if (nameRegex.test(value) === true) {
        setIsLastNameValid(true);
      } else {
        setIsLastNameValid(false);
      }
      setInputVal({ ...inputVal, [name]: value });
    }

    if (name === "email") {
      if (emailRegex.test(value) === true) {
        setIsEmailValid(true);
      } else {
        setIsEmailValid(false);
      }
      setInputVal({ ...inputVal, [name]: value });
    }

    if (name === "mobile") {
      if (mobileRegex.test(value) === true) {
        setIsMobileValid(true);
      } else {
        setIsMobileValid(false);
      }
      setInputVal({ ...inputVal, [name]: value });
    }

    if (name === "company") {
      if (nameRegex.test(value) === true) {
        setIsMobileValid(true);
      } else {
        setIsMobileValid(false);
      }
      setInputVal({ ...inputVal, [name]: value });
    }

    if (name === "budget") {
      setInputVal({ ...inputVal, [name]: value });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedMessage: EnquiryMessage = { ...message, message: e.target.value };

    setMessage(updatedMessage);
  };

  const handelFormSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // console.log(inputVal, "inputVal");
    // console.log(selectGuest, "selectGuest/chip", chipGuest);
    // console.log(selectTitle, "selectTitle/chip", "chipTitle");
    // console.log(eventDate, eventTime, "time");
    // console.log(selectVal, "campaignEnquiryType");
    // console.log(budget, "budget");
    // console.log(message, "message");
    // console.log(type, "type");
    router.push("/campaign/submitted");
  };

  const handleDateSelecting = (date: string) => {
    setEventDate(date);
    // console.log(date, "date");
  };

  const handleBackBtn = () => {
    router.push("/campaign");
  };

  const dates: string[] = [];

  const generateDateArray = () => {
    const today = moment();
    for (let i = 0; i < 182; i++) {
      dates.push(today.clone().add(i, "days").format("DD-MM-YYYY"));
    }
    return dates;
  };

  useEffect(() => {
    generateDateArray();
    setAvailableData(dates);
  }, []);

  useEffect(() => {
    if (isAlreadyLogin && profileData) {
      setInputVal({
        ...inputVal,
        firstName: profileData?.firstName,
        lastName: profileData?.lastName,
        email: profileData?.email,
        mobile: profileData?.mobile,
      });

      setSelectTitle({
        ...selectTitle,
        title: profileData?.title,
      });

      setChipTitle({
        ...chipTitle,
        title: profileData?.title,
      });

      setIsFirstNameValid(true);
      setIsLastNameValid(true);
      setIsEmailValid(true);
      setIsMobileValid(true);
    }
  }, [isAlreadyLogin, profileData]);

  return (
    <>
      <form className="campaignFormComponent">
        {width <= 1290 ? (
          <Select
            items={lang === "tc" ? titles.itemsTC : titles.items}
            onChange={handleTitle}
            id={titles.id}
            name={titles.name}
            labelText={`${t("personalInfo.title")}`}
            defaultSelectVal={profileData?.title}
            isActive={activeIndex === 4}
            onShow={() => setActiveIndex(4)}
          />
        ) : (
          <div>
            <Headings title={t("personalInfo.title") as string} />
            <TitleChip
              items={titleChips.items}
              labelFor={titleChips.labelFor}
              onChange={handleChipTitleClick}
              buttonClass={"flex-1"}
              onCheckType={() => handleCheckType(titleChips.type)}
              lang={lang}
              editValue={profileData?.title}
            />
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-[48%]">
            <Input
              labelFor={firstName.labelFor}
              labelText={`${t("personalInfo.yourName")}`}
              placeholder={`${t("personalInfo.givenName")}`}
              type={firstName.type}
              autoComplete={firstName.autoComplete}
              required={firstName.required}
              name={firstName.id}
              id={firstName.id}
              errorMsg={`${t("checkout.error.firstName")}`}
              minLength={firstName.minLength}
              maxLength={firstName.maxLength}
              isValid={isFistNameValid}
              onChange={handleInputChange}
              lang={lang}
              path={path}
              value={inputVal.firstName}
              contactFormHeight
            />
          </div>
          <div className="lg:w-[48%]">
            <Input
              labelFor={lastName.labelFor}
              labelText={`${t("personalInfo.yourName")}`}
              placeholder={`${t("personalInfo.birthName")}`}
              type={lastName.type}
              autoComplete={lastName.autoComplete}
              required={lastName.required}
              name={lastName.name}
              id={lastName.id}
              errorMsg={`${t("checkout.error.lastName")}`}
              minLength={lastName.minLength}
              maxLength={lastName.maxLength}
              isValid={isLastNameValid}
              onChange={handleInputChange}
              lang={lang}
              path={path}
              value={inputVal.lastName}
              contactFormHeight
            />
          </div>
        </div>

        <Input
          labelFor={mobileForContact.labelFor}
          labelText={`${t("personalInfo.mobileNumberWithStar")}`}
          placeholder={`${t("personalInfo.onlyHkNumberAllowed")}`}
          type={mobileForContact.type}
          autoComplete={mobileForContact.autoComplete}
          required={mobileForContact.required}
          name={mobileForContact.name}
          id={mobileForContact.id}
          minLength={mobileForContact.minLength}
          maxLength={mobileForContact.maxLength}
          onChange={handleInputChange}
          value={inputVal.mobile}
          isValid={isMobileValid}
          errorMsg={`${t("checkout.error.hkMobileNumber")}`}
          lang={lang}
          path={path}
          contactFormHeight
          campaignForm
        />
        <div>
          <Input
            labelFor={email.labelFor}
            labelText={`${t("personalInfo.emailWithStar")}`}
            placeholder={`${t("personalInfo.yourEmail")}`}
            type={email.type}
            autoComplete={email.autoComplete}
            required={email.required}
            name={email.name}
            id={email.id}
            errorMsg={`${t("checkout.error.email")}`}
            minLength={email.minLength}
            maxLength={email.maxLength}
            isValid={isEmailValid}
            onChange={handleInputChange}
            lang={lang}
            path={path}
            value={inputVal.email}
            contactFormHeight
          />
          <div className="mt-1 px-5 text-[12px] font-medium leading-[18px] tracking-[-0.2px] text-primaryGold lg:mt-2 lg:px-3 lg:text-primaryGold lg:opacity-100 xl:px-5 xl:text-[14px]">
            <p>
              {t("contactUs.emailRemark1")}
              {/* <span className={`${lang === "tc" ? "hidden" : "block"}`}></span> */}
              {t("contactUs.emailRemark2")}
            </p>
          </div>
        </div>
        <div>
          <Headings title={`${t("campaignPage.campaignType")}`} />
          <Select
            items={lang === "tc" ? campaignEnquiry.itemsTC : campaignEnquiry.items}
            onChange={handleSelect}
            id={campaignEnquiry.id}
            name={campaignEnquiry.name}
            labelText={`${t("campaignPage.campaignType")}`}
            isActive={activeIndex === 0}
            onShow={() => setActiveIndex(0)}
          />
        </div>
        <div className="relative ">
          <h3 className="labelText">{t("campaignPage.eventDateTitle")}</h3>
          <div className="campaignFormDatePickerParentDiv h-fit">
            <div className=" h-fit w-full md:flex md:justify-between">
              <div className="campaignFormDatePickerComponent">
                <CustomDatepicker
                  containerClasses="h-[50px] w-full flex-[4] z-[1]"
                  date={""}
                  onSelect={handleDateSelecting}
                  availableDates={availableData && availableData}
                  contactForm
                />
              </div>
              <div className="campaignFormDateSelectorContainer">
                <Select
                  items={hours.items}
                  onChange={handleSelectHourChange}
                  id={hours.id}
                  name={hours.name}
                  isActive={activeIndex === 1}
                  onShow={() => setActiveIndex(1)}
                />
                <Select
                  items={minutes.items}
                  onChange={handleSelectMinuteChange}
                  id={minutes.id}
                  name={minutes.name}
                  isActive={activeIndex === 2}
                  onShow={() => setActiveIndex(2)}
                />
              </div>
            </div>
          </div>
        </div>

        {width <= 1290 ? (
          <div>
            <Headings title={`${t("campaignPage.numberOfGuests")}`} />
            <Select
              items={selectNumberOfGuests.items}
              onChange={handleSelectGuestChange}
              id={selectNumberOfGuests.id}
              name={selectNumberOfGuests.name}
              labelText={`${t("campaignPage.numberOfGuests")}`}
              isActive={activeIndex === 3}
              onShow={() => setActiveIndex(3)}
            />
          </div>
        ) : (
          <GuestChip
            items={numberOfGuestsChip}
            path={path}
            lang={lang}
            buttonClass={"flex-1"}
            onChange={handleNumberOfGuestChip}
          />
        )}

        <Input
          labelFor={company.labelFor}
          labelText={`${t("campaignPage.companyTitle")}`}
          placeholder={`${t("campaignPage.companyName")}`}
          type={company.type}
          autoComplete={company.autoComplete}
          required={company.required}
          name={company.name}
          id={company.id}
          errorMsg={company.errorMsg}
          minLength={company.minLength}
          maxLength={company.maxLength}
          onChange={handleInputChange}
          lang={lang}
          path={path}
          value={inputVal.company}
          contactFormHeight
        />
        <Input
          labelFor={budget.labelFor}
          labelText={`${t("campaignPage.budgetTitle")}`}
          placeholder={`${t("campaignPage.budgetPlaceHolder")}`}
          type={budget.type}
          autoComplete={budget.autoComplete}
          required={budget.required}
          name={budget.name}
          id={budget.id}
          errorMsg={budget.errorMsg}
          minLength={budget.minLength}
          maxLength={budget.maxLength}
          onChange={handleInputChange}
          lang={lang}
          path={path}
          value={inputVal.budget}
          contactFormHeight
        />
        <MessageTextArea
          name={"message"}
          id={"message"}
          maxLen={20000}
          minLen={1}
          rows={4}
          cols={40}
          required={true}
          onChange={handleMessageChange}
          lang={lang}
          campaignForm
        />
        <div className="reCAPTCHA campaignFormreCAPTCHA">
          <ReCAPTCHA
            sitekey={racaptchaSiteKey}
            onChange={() => setIsRecaptchaValid(true)}
            size="normal"
            hl={`${lang === "en" ? "en" : "zh-HK"}`}
          />
        </div>

        <MobileButtonContainer>
          <div className="campaignFormBtnMobileDiv">
            <button onClick={handleBackBtn} className="campaignFormBackBtnMobile">
              {t("personalInfo.back")}
            </button>

            <button
              disabled={isSubmitBtnDisabled}
              onClick={handelFormSubmit}
              className={`campaignFormSubmitBtnnMobile ${
                isSubmitBtnDisabled
                  ? "bg-primaryGold bg-opacity-40"
                  : "cursor-pointer bg-primaryGold  hover:bg-[#79684D]"
              }`}
            >
              {t("campaignPage.submit")}
            </button>
          </div>
        </MobileButtonContainer>

        <button
          onClick={handelFormSubmit}
          disabled={isSubmitBtnDisabled}
          className={`campaignFormSubmitBtnDesktop ${
            isSubmitBtnDisabled ? "bg-primaryGold bg-opacity-40" : "cursor-pointer bg-primaryGold  hover:bg-[#79684D]"
          } `}
        >
          {t("campaignPage.submit")}
        </button>
      </form>
    </>
  );
};
