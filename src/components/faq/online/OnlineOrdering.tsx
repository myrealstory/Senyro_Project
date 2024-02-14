"use client";

import { CustomCategory } from "../CustomCategory";
import { onlineOrdering } from "@/constants/faq/questions";
import { Accordion } from "../Accordion";
import { useState } from "react";
import "@/style/general-information/general-information.scss";
import { useTranslation } from "@/app/i18n/client";
import { LocaleKeysType } from "@/app/i18n";
import { useDispatch } from "react-redux";
import { setActiveIndexFaq } from "@/redux/slice/generalStateSlice";

export const OnlineOrdering = ({ lang }: { lang: LocaleKeysType }) => {
  const dispatch = useDispatch();
  const { translate } = useTranslation(lang);
  const [category, setCategory] = useState(`${translate("FAQOnline.SystemRequirements")}`);
  const handleCategoryChange = (mode: string) => {
    dispatch(setActiveIndexFaq(-1));
    setCategory(mode);
  };
  const systemRequirementsFaqs = onlineOrdering.filter(items => items.category === "System Requirements");
  const systemRequirementsFaqsTC = onlineOrdering.filter(items => items.category === "系統要求");
  const paymentSecruityFaqs = onlineOrdering.filter(items => items.category === "Payment Secruity");
  const paymentSecruityFaqsTC = onlineOrdering.filter(items => items.category === "付款安全");
  const onlineOrderFaqs = onlineOrdering.filter(item => item.category === "Online Order");
  const onlineOrderFaqsTC = onlineOrdering.filter(item => item.category === "線上訂購");
  const orderPickupFaqs = onlineOrdering.filter(item => item.category === "Order Pickup");
  const orderPickupFaqsTC = onlineOrdering.filter(item => item.category === "取餐安排");
  const changeOrderFaqs = onlineOrdering.filter(item => item.category === "Change Order");
  const changeOrderFaqsTC = onlineOrdering.filter(item => item.category === "更改訂單");

  const renderOnlineOrderingFAQs = () => {
    switch (category) {
      case "System Requirements": {
        return <Accordion faqs={systemRequirementsFaqs} id={"System Requirements"} />;
      }
      case "系統要求": {
        return <Accordion faqs={systemRequirementsFaqsTC} id={"System Requirements"} />;
      }
      case "Payment Security": {
        return <Accordion faqs={paymentSecruityFaqs} id={"Payment Security"} />;
      }
      case "付款安全": {
        return <Accordion faqs={paymentSecruityFaqsTC} id={"Payment Security"} />;
      }
      case "Online Order": {
        return <Accordion faqs={onlineOrderFaqs} id={"Online Order"} />;
      }
      case "線上訂購": {
        return <Accordion faqs={onlineOrderFaqsTC} id={"Online Order"} />;
      }
      case "Order Pickup": {
        return <Accordion faqs={orderPickupFaqs} id={"Order Pickup"} />;
      }
      case "取餐安排": {
        return <Accordion faqs={orderPickupFaqsTC} id={"Order Pickup"} />;
      }
      case "Change Order": {
        return <Accordion faqs={changeOrderFaqs} id={"Change Order"} />;
      }
      case "更改訂單": {
        return <Accordion faqs={changeOrderFaqsTC} id={"Change Order"} />;
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
          `${translate("FAQOnline.SystemRequirements")}`,
          `${translate("FAQOnline.PaymentSecruity")}`,
          `${translate("FAQOnline.OnlineOrder")}`,
          `${translate("FAQOnline.OrderPickup")}`,
          `${translate("FAQOnline.ChangeOrder")}`,
        ]}
        lang={lang}
      />
      <div className="FAQOnlineOrderingContentContainer">{renderOnlineOrderingFAQs()}</div>
    </>
  );
};
