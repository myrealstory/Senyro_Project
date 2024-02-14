"use client";

import { CustomCategory } from "../CustomCategory";
import { membership } from "@/constants/faq/questions";
import { Accordion } from "../Accordion";
import { useState } from "react";
import { LocaleKeysType } from "@/app/i18n";
import { useTranslation } from "@/app/i18n/client";
import "@/style/general-information/general-information.scss";
import { useDispatch } from "react-redux";
import { setActiveIndexFaq } from "@/redux/slice/generalStateSlice";

export const Membership = ({ lang }: { lang: LocaleKeysType }) => {
  const { translate } = useTranslation(lang);
  const dispatch = useDispatch();

  const [category, setCategory] = useState(`${translate("FAQMembership.Membership")}`);

  const handleCategoryChange = (mode: string) => {
    setCategory(mode);
    dispatch(setActiveIndexFaq(-1));
  };
  const membershipFaqs = membership.filter(item => item.category === "membership");
  const membershipFaqsTC = membership.filter(item => item.category === "千両會員計劃");
  const privilegeFaqs = membership.filter(item => item.category === "privileges");
  const privilegeFaqsTC = membership.filter(item => item.category === "會員禮遇");
  const accountFaqs = membership.filter(item => item.category === "member account");
  const accountFaqsTC = membership.filter(item => item.category === "會員帳戶");

  const renderMembershipFAQs = () => {
    switch (category) {
      case "Membership": {
        return <Accordion faqs={membershipFaqs} id={"0"} />;
      }
      case "千両會員計劃": {
        return <Accordion faqs={membershipFaqsTC} id={"0"} />;
      }
      case "Privileges": {
        return <Accordion faqs={privilegeFaqs} id={"1"} />;
      }
      case "會員禮遇": {
        return <Accordion faqs={privilegeFaqsTC} id={"1"} />;
      }
      case "Account": {
        return <Accordion faqs={accountFaqs} id={"2"} />;
      }
      case "會員帳戶": {
        return <Accordion faqs={accountFaqsTC} id={"2"} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <>
      <CustomCategory
        onChange={handleCategoryChange}
        category={category}
        tabs={[
          `${translate("FAQMembership.Membership")}`,
          `${translate("FAQMembership.Privileges")}`,
          `${translate("FAQMembership.Account")}`,
        ]}
      />
      <div className="FAQOnlineOrderingContentContainer">{renderMembershipFAQs()}</div>
    </>
  );
};
